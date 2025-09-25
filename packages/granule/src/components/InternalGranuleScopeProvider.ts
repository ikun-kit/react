/**
 * ⚠️ 内部使用 - GranuleScopeProvider 组件
 *
 * 提供作用域管理的根组件，负责：
 * - DOM 容器管理和 React Root 创建
 * - 作用域项目的渲染和生命周期管理
 * - 事件监听和资源清理
 *
 * @internal 此组件仅供内部使用，业务代码应使用 useGranuleScope 返回的 Provider
 *
 * ⚠️ 警告：此文件为内部实现，不应在业务代码中直接使用
 */
import { createElement, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import { GranuleScopeCoreContext } from '../contexts/InternalGranuleScopeLayeredContexts';
import type {
  TGranuleScopeInsertPayload,
  TGranuleScopeMovePayload,
  TGranuleScopeProviderProps,
} from '../types/internal';

/**
 * 作用域提供者组件
 *
 * 管理作用域项目的 DOM 渲染和生命周期，为子组件提供作用域上下文
 *
 * @template K - 项目 ID 的类型
 * @template V - 项目状态数据的类型
 * @template U - 向上通信事件载荷映射类型
 */
export const GranuleScopeProvider = <
  K,
  V,
  U extends Record<string, any> = Record<string, any>,
>(
  props: TGranuleScopeProviderProps<K, V, U>,
) => {
  const { context: coreContext, children, ...properties } = props;
  const containerRef = coreContext.domRef;
  // 存储每个项目的 React Root 实例，用于正确的资源清理
  const rootsRef = useRef<Map<K, any>>(new Map());

  /** 删除项目的内部实现 */
  const deleteItem = (id: K): void => {
    console.debug('Deleting item:', id);

    // 通知卸载事件
    coreContext.item.unmount(id);

    // 异步卸载 React Root
    const root = rootsRef.current.get(id);

    if (root) {
      window.queueMicrotask(() => {
        try {
          // 立即移除 DOM 元素
          const element = containerRef.current!.querySelector(
            `[data-granule-key="${String(id)}"]`,
          );
          if (element) {
            element.remove();
          }

          // 清理 imperative API
          coreContext.unregisterImperative(id);

          // 清理 react root 缓存
          rootsRef.current.delete(id);

          root.unmount();
        } catch (error) {
          console.warn('Error unmounting root for item:', id, error);
        }
      });
    }
  };

  /** 插入项目的内部实现 */
  const insertItem = (payload: TGranuleScopeInsertPayload<K, V>): void => {
    const { id, data: state, beforeId } = payload;

    // 创建 DOM 容器元素
    const element = children.createElement(state);
    element.setAttribute('data-granule-key', String(id));

    if (!containerRef.current) {
      throw new Error('GranuleScopeProvider: containerRef.current is null');
    }

    // 处理 insert before 功能
    if (beforeId !== undefined) {
      const beforeElement = containerRef.current.querySelector(
        `[data-granule-key="${String(beforeId)}"]`,
      );
      if (beforeElement) {
        containerRef.current.insertBefore(element, beforeElement);
      } else {
        // 如果找不到 beforeId 对应的元素，则追加到末尾
        containerRef.current.appendChild(element);
      }
    } else {
      // 如果没有指定 beforeId，则追加到末尾
      containerRef.current.appendChild(element);
    }

    // 创建 React Root 并渲染组件
    const root = createRoot(element);
    rootsRef.current.set(id, root);

    root.render(
      createElement(
        GranuleScopeCoreContext.Provider,
        { value: coreContext as any },
        children({ id }),
      ),
    );

    // 使用微任务延迟触发挂载事件
    window.queueMicrotask(() => {
      coreContext.item.mount(id);
    });
  };

  /** 移动项目的内部实现 */
  const moveItems = (payload: TGranuleScopeMovePayload<K>): void => {
    const { ids, beforeId } = payload;

    if (!containerRef.current) {
      throw new Error('GranuleScopeProvider: containerRef.current is null');
    }

    // 收集要移动的元素
    const elements: Element[] = [];
    for (const id of ids) {
      const element = containerRef.current.querySelector(
        `[data-granule-key="${String(id)}"]`,
      );
      if (element) {
        elements.push(element);
      } else {
        console.warn(`Element with id "${id}" not found for move operation`);
      }
    }

    if (elements.length === 0) return;

    // 处理移动到新位置
    if (beforeId !== undefined) {
      const beforeElement = containerRef.current.querySelector(
        `[data-granule-key="${String(beforeId)}"]`,
      );
      if (beforeElement) {
        // 按顺序插入到目标位置之前
        for (const element of elements) {
          containerRef.current.insertBefore(element, beforeElement);
        }
      } else {
        console.warn(
          `Target element with id "${beforeId}" not found for move operation, DOM may be out of sync`,
        );
        return;
      }
    } else {
      // 如果没有指定 beforeId，则移动到末尾
      for (const element of elements) {
        containerRef.current.appendChild(element);
      }
    }

    console.debug('Moved items:', ids, 'before:', beforeId);
  };

  // 组件挂载时初始化所有项目并注册事件监听
  useEffect(() => {
    let insertDisposer: (() => void) | undefined;
    let deleteDisposer: (() => void) | undefined;
    let moveDisposer: (() => void) | undefined;

    // 为了保证副作用运行顺序，这里使用微任务进行延迟处理
    window.queueMicrotask(() => {
      coreContext.state.forEach(({ id, state }) => {
        insertItem({ id, data: state });
      });

      insertDisposer = coreContext.list.onInsert(insertItem);
      deleteDisposer = coreContext.list.onDelete(deleteItem);
      moveDisposer = coreContext.list.onMove(moveItems);
    });

    // 组件卸载时清理所有资源
    return () => {
      // 取消事件订阅
      insertDisposer?.();
      deleteDisposer?.();
      moveDisposer?.();
      console.debug('GranuleScopeProvider cleanup start');

      // 1. 先触发所有项目的卸载事件并清理 imperative API
      coreContext.state.forEach(({ id }) => {
        coreContext.item.unmount(id);
        coreContext.unregisterImperative(id);
      });

      // 2. 立即清理所有 DOM 元素（同步进行）
      if (containerRef.current) {
        const elements =
          containerRef.current.querySelectorAll('[data-granule-key]');
        elements.forEach(element => {
          element.remove();
        });
      }

      window.queueMicrotask(() => {
        // 3. 使用微任务清理 React Root 实例
        rootsRef.current.forEach(root => {
          try {
            root.unmount();
          } catch (error) {
            console.warn('Error unmounting root:', error);
          }
        });
        rootsRef.current.clear();

        console.debug('GranuleScopeProvider roots cleared');

        // 4. 立即清理事件观察者
        coreContext.destroy();

        console.debug('GranuleScopeProvider cleanup complete');
      });
    };
  }, [coreContext]);

  return createElement(
    GranuleScopeCoreContext.Provider,
    { value: coreContext as any },
    createElement('div', { ...properties, ref: containerRef }),
  );
};
