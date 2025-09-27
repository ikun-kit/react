/**
 * ⚠️ 内部使用 - useGranuleScopeCore Hook
 *
 * 作用域管理的核心 Hook，创建并管理一个作用域核心模型实例
 * 提供完整的内部状态管理和事件系统，包括项目级操作、列表级操作和事件订阅机制
 *
 * @internal 此 Hook 仅供内部使用，业务代码应使用 useGranuleScope 等公共接口
 *
 * ⚠️ 警告：此文件为内部实现，不应在业务代码中直接使用
 */
import { useMemo, useRef } from 'react';

import type {
  TGranuleScopeCore,
  TGranuleScopeInsertPayload,
  TGranuleScopeItem,
  TGranuleScopeMovePayload,
  TGranuleScopePayloadMap,
} from '../types/internal';
import { Observable } from '../utils/observable';
import type { ExtractCallback, ExtractPayload } from '../utils/observable';

/**
 * 创建作用域核心模型的 Hook（内部使用）
 *
 * @internal
 * @template K - 项目 ID 的类型
 * @template V - 项目状态数据的类型
 * @template U - 向上通信事件载荷映射类型
 * @param items - 初始的作用域项目列表
 * @returns 作用域核心模型实例，包含完整的内部管理功能
 */
export const useInternalGranuleScopeCore = <
  K,
  V,
  U extends { [K in keyof U]: (...args: any[]) => any } = Record<
    string,
    (...args: any[]) => any
  >,
>(
  items: Array<TGranuleScopeItem<K, V>>,
): TGranuleScopeCore<K, V, U> => {
  const domRef = useRef<HTMLDivElement>(null);

  return useMemo(() => {
    // 创建副本避免直接修改输入数据
    const state = [...items];
    // 创建事件观察者实例，用于管理所有作用域事件
    const observable = new Observable<TGranuleScopePayloadMap<K, V>>();
    // 创建向上通信的事件观察者实例
    const upwardObservableInstance = new Observable<U>();

    // 创建 imperative API 注册表
    const imperativeAPIRegistry = new Map<K, any>();

    // 项目级操作 - 针对单个作用域项目的操作
    const item: TGranuleScopeCore<K, V>['item'] = {
      /** 更新指定项目的状态数据 */
      update: (id: K, data: V) => {
        const itemIndex = state.findIndex(item => item.id === id);
        if (itemIndex === -1) {
          console.warn(
            `GranuleScope: cannot update non-existent item with id ${id}`,
          );
        }
        state[itemIndex].state = data;

        // 发布特定项目的更新事件
        observable.broadcast(`item:update:${id}`, data);
      },

      /** 订阅指定项目的更新事件 */
      onUpdate: (id: K, callback: (data: V) => void) => {
        return observable.subscribe(`item:update:${id}`, callback);
      },
    };

    // 列表级操作 - 针对整个作用域列表的操作
    const list: TGranuleScopeCore<K, V>['list'] = {
      insert(id: K, data: V, beforeId?: K) {
        if (state.find(item => item.id === id)) {
          throw new Error(`GranuleScope: item with id ${id} already exists`);
        }

        const newItem: TGranuleScopeItem<K, V> = { id, state: data };

        if (beforeId) {
          const beforeIndex = state.findIndex(item => item.id === beforeId);
          if (beforeIndex !== -1) {
            state.splice(beforeIndex, 0, newItem);
          } else {
            state.push(newItem);
          }
        } else {
          state.push(newItem);
        }

        observable.broadcast('list:insert', {
          id,
          data,
          beforeId,
        });
      },
      delete(id: K) {
        // 1. 通知 list 删除
        observable.broadcast('list:delete', id);

        const itemIndex = state.findIndex(item => item.id === id);
        if (itemIndex === -1) {
          return; // 静默处理不存在的删除
        }

        // 2. 清理该 item 的所有监听器
        observable.clear(`item:update:${id}`);

        // 3. 清理该 item 的 imperative API
        imperativeAPIRegistry.delete(id);

        // 4. 最后从状态中删除
        state.splice(itemIndex, 1);
      },
      move(ids: K[], beforeId?: K) {
        const fromIndexes: number[] = [];
        const itemsToMove: Array<TGranuleScopeItem<K, V>> = [];

        // 1. 验证所有项目都存在并收集它们
        for (const id of ids) {
          const itemIndex = state.findIndex(item => item.id === id);
          if (itemIndex === -1) {
            throw new Error(
              `GranuleScope: cannot move non-existent item with id ${id}`,
            );
          }
          fromIndexes.push(itemIndex);
        }

        // 2. 验证目标位置（如果指定）
        let targetIndex: number;
        if (beforeId !== undefined) {
          const beforeIndex = state.findIndex(item => item.id === beforeId);
          if (beforeIndex === -1) {
            throw new Error(
              `GranuleScope: cannot move items before non-existent item ${beforeId}`,
            );
          }
          targetIndex = beforeIndex;
        } else {
          targetIndex = state.length; // 移动到末尾
        }

        // 3. 从后往前删除项目（避免索引变化）
        const sortedIndexes = fromIndexes
          .map((index, i) => ({ index, id: ids[i] }))
          .sort((a, b) => b.index - a.index);

        for (const { index } of sortedIndexes) {
          const [item] = state.splice(index, 1);
          itemsToMove.unshift(item); // 维持原始顺序
        }

        // 4. 重新计算目标索引（因为删除了项目）
        let adjustedTargetIndex = targetIndex;
        for (const index of fromIndexes) {
          if (index < targetIndex) {
            adjustedTargetIndex--;
          }
        }

        // 5. 插入到新位置
        state.splice(adjustedTargetIndex, 0, ...itemsToMove);

        // 6. 发布移动事件
        observable.broadcast('list:move', {
          ids,
          beforeId,
          fromIndexes,
          toIndex: adjustedTargetIndex,
        });
      },
      update: (id: K, data: V) => {
        const itemIndex = state.findIndex(item => item.id === id);
        if (itemIndex === -1) {
          throw new Error(
            `GranuleScope: cannot update non-existent item with id ${id}`,
          );
        }
        state[itemIndex].state = data;

        // 发布特定 item 的更新事件
        observable.broadcast(`item:update:${id}`, data);
      },
      onInsert(callback: (payload: TGranuleScopeInsertPayload<K, V>) => void) {
        return observable.subscribe('list:insert', callback);
      },
      onDelete(callback: (id: K) => void) {
        return observable.subscribe('list:delete', callback);
      },
      onMove(callback: (payload: TGranuleScopeMovePayload<K>) => void) {
        return observable.subscribe('list:move', callback);
      },
    };

    // 销毁函数 - 清理所有观察者和资源
    const destroy: TGranuleScopeCore<K, V>['destroy'] = () => {
      observable.destroy();
      upwardObservableInstance.destroy();
      imperativeAPIRegistry.clear();
    };

    // 向上通信操作 - 封装向上事件的发射和订阅功能
    const upward: TGranuleScopeCore<K, V, U>['upward'] = {
      /** 发射向上事件到父组件 */
      emit: <T extends keyof U>(
        eventName: T,
        ...payload: ExtractPayload<U, T>
      ) => {
        upwardObservableInstance.broadcast(eventName, ...payload);
      },

      /** 订阅来自子组件的向上事件 */
      subscribe: <T extends keyof U>(
        eventName: T,
        callback: ExtractCallback<U, T>,
      ) => {
        return upwardObservableInstance.subscribe(eventName, callback);
      },
    };

    // imperative API 管理函数
    const registerImperative = (id: K, api: any) => {
      imperativeAPIRegistry.set(id, api);
    };

    const unregisterImperative = (id: K) => {
      imperativeAPIRegistry.delete(id);
    };

    const getImperative = (id: K) => {
      return imperativeAPIRegistry.get(id);
    };

    return {
      item,
      list,
      upward,
      state,
      destroy,
      domRef,
      registerImperative,
      unregisterImperative,
      getImperative,
    };
  }, [items, domRef]);
};
