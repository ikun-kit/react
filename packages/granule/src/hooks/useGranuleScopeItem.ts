/**
 * useGranuleScopeItem Hook - 单个作用域项目的管理 Hook
 *
 * 提供对指定 ID 的作用域项目的状态访问和操作能力
 * 包括状态获取、生命周期管理和事件监听
 *
 * 专门设计给项目组件内部使用，已经有 id 上下文，所以操作不需要再传入 id
 */
import { useContext, useMemo } from 'react';

import { GranuleScopeCoreContext } from '../contexts/InternalGranuleScopeLayeredContexts';
import type { TGranuleScopeItem } from '../types/internal';

/** 作用域项目 Hook 的返回值类型 */
export interface TGranuleScopeItemHookResult<K, V> {
  /** 当前项目的状态数据 */
  state: V;

  /** 更新当前项目的状态（不需要传 id，因为已知当前项目 id） */
  update: (data: V) => void;

  /** 删除当前项目 */
  delete: () => void;

  /** 移动当前项目到新位置（不需要传 id，因为已知当前项目 id） */
  move: (beforeId?: K) => void;

  /** 获取所有项目的只读状态 */
  getState: () => ReadonlyArray<TGranuleScopeItem<K, V>>;

  /** 注册挂载事件回调 */
  onMount: (callback: (data: V) => void) => () => void;

  /** 注册卸载事件回调 */
  onUnmount: (callback: (data: V) => void) => () => void;

  /** 注册更新事件回调 */
  onUpdate: (callback: (newState: V) => void) => () => void;

  /** 插入新项目到列表（仍需要传入新项目的 id 和 data） */
  insert: (id: K, data: V, beforeId?: K) => void;

  /** 当前项目的 DOM 元素引用 */
  domRef: React.RefObject<HTMLElement>;
}

/**
 * 获取指定作用域项目的管理接口
 *
 * 专门给项目组件内部使用，提供该项目的完整操作接口
 * 由于已知当前项目 id，所以 update/delete/on* 等操作都不需要再传入 id
 *
 * @template K - 项目 ID 的类型
 * @template V - 项目状态数据的类型
 * @param id - 项目的唯一标识符
 * @returns 项目管理接口
 */
export const useGranuleScopeItem = <K, V>(
  id: K,
): TGranuleScopeItemHookResult<K, V> => {
  const context = useContext(GranuleScopeCoreContext);

  if (!context) {
    throw new Error(
      'useGranuleScopeItem must be used within a GranuleScopeProvider',
    );
  }

  // 查找当前项目的状态数据
  const item = context.state.find((item: any) => item.id === id);
  if (!item) {
    throw new Error(`Item with id "${id}" not found in granule context`);
  }

  // 创建 item 专用的 domRef
  const domRef = useMemo(() => {
    return {
      get current() {
        const container = context.domRef.current;
        if (!container) return null;
        return container.querySelector(
          `[data-granule-key="${String(id)}"]`,
        ) as HTMLElement;
      },
    } as React.RefObject<HTMLElement>;
  }, [context.domRef, id]);

  return {
    state: item.state,

    // 当前项目操作
    update: (data: V) => {
      context.item.update(id, data);
    },

    delete: () => {
      context.list.delete(id);
    },

    move: (beforeId?: K) => {
      context.list.move([id], beforeId);
    },

    getState: (): ReadonlyArray<TGranuleScopeItem<K, V>> => {
      return context.state;
    },

    // 当前项目事件监听
    onMount: (callback: (data: V) => void) => {
      return context.item.onMount(id, callback);
    },

    onUnmount: (callback: (data: V) => void) => {
      return context.item.onUnmount(id, callback);
    },

    onUpdate: (callback: (newState: V) => void) => {
      return context.item.onUpdate(id, callback);
    },

    // 列表操作（仍需要传入新项目的参数）
    insert: (newId: K, data: V, beforeId?: K) => {
      context.list.insert(newId, data, beforeId);
    },

    // DOM 引用
    domRef,
  };
};
