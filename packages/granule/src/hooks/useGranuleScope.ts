/**
 * useGranuleScope Hook - 组合式作用域管理
 *
 * 结合了 Provider 和 Controller 的完整解决方案
 * 为根组件提供安全的 API 集合，同时向下注入上下文
 */
import { createElement, useMemo } from 'react';

import { GranuleScopeProvider } from '../components/InternalGranuleScopeProvider';
import type {
  TGranuleScopeController,
  TGranuleScopeResult,
  TGranuleScopeSubscriber,
} from '../types/external';
import type {
  TGranuleScopeInsertPayload,
  TGranuleScopeItem,
  TGranuleScopeMovePayload,
  TGranuleScopeProviderProps,
} from '../types/internal';
import { useInternalGranuleScopeCore } from './useInternalGranuleScopeCore';

/**
 * 创建作用域管理实例
 *
 * 提供完整的作用域管理解决方案，包括：
 * - Provider: 用于向下注入上下文
 * - controller: 根组件使用的安全 API 集合
 *
 * @template K - 项目 ID 的类型
 * @template V - 项目状态数据的类型
 * @param data - 初始的作用域项目列表
 * @returns 包含 Provider 和 controller 的对象
 */
export function useGranuleScope<K, V>(
  data: Array<TGranuleScopeItem<K, V>>,
): TGranuleScopeResult<K, V> {
  const scopeCore = useInternalGranuleScopeCore<K, V>(data);

  // 创建安全的控制器 API
  const controller = useMemo((): TGranuleScopeController<K, V> => {
    return {
      insert: (id: K, data: V, beforeId?: K) => {
        scopeCore.list.insert(id, data, beforeId);
      },
      delete: (id: K) => {
        scopeCore.list.delete(id);
      },
      move: (ids: K[], beforeId?: K) => {
        scopeCore.list.move(ids, beforeId);
      },
      update: (id: K, data: V) => {
        scopeCore.item.update(id, data);
      },
      getState: (): ReadonlyArray<TGranuleScopeItem<K, V>> => {
        return scopeCore.state;
      },
      getItem: (id: K): TGranuleScopeItem<K, V> | undefined => {
        return scopeCore.state.find(item => item.id === id);
      },
      hasItem: (id: K): boolean => {
        return scopeCore.state.some(item => item.id === id);
      },
    };
  }, [scopeCore]);

  // 创建事件订阅器 API
  const subscriber = useMemo((): TGranuleScopeSubscriber<K, V> => {
    return {
      onInsert: (
        callback: (payload: TGranuleScopeInsertPayload<K, V>) => void,
      ): (() => void) => {
        return scopeCore.list.onInsert(callback);
      },

      onDelete: (callback: (id: K) => void): (() => void) => {
        return scopeCore.list.onDelete(callback);
      },

      onMove: (
        callback: (payload: TGranuleScopeMovePayload<K>) => void,
      ): (() => void) => {
        return scopeCore.list.onMove(callback);
      },

      onItemUpdate: (id: K, callback: (data: V) => void): (() => void) => {
        return scopeCore.item.onUpdate(id, callback);
      },

      onItemMount: (id: K, callback: (data: V) => void): (() => void) => {
        return scopeCore.item.onMount(id, callback);
      },

      onItemUnmount: (id: K, callback: (data: V) => void): (() => void) => {
        return scopeCore.item.onUnmount(id, callback);
      },
    };
  }, [scopeCore]);

  // 预配置 context 的 Provider
  const Provider = useMemo(
    () => (props: Omit<TGranuleScopeProviderProps<K, V>, 'context'>) => {
      console.log('memo use granule scope provider');
      return createElement(GranuleScopeProvider<K, V>, {
        context: scopeCore,
        ...props,
      });
    },
    [scopeCore],
  );

  return {
    Provider,
    controller,
    subscriber,
    domRef: scopeCore.domRef,
  };
}
