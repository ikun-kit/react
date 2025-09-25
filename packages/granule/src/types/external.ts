/**
 * Granule React 公共类型定义
 *
 * 定义了 Granule 作用域管理系统对外暴露的类型：
 * - 公共操作控制器接口
 * - 事件监听器接口
 * - 组合式作用域管理返回类型
 */
import type { CSSProperties, ComponentType, ReactNode, RefObject } from 'react';

import {
  TGranuleScopeInsertPayload,
  TGranuleScopeItem,
  TGranuleScopeMovePayload,
} from './internal';

// 重新导出基础类型
export type { TGranuleScopeItem, TGranuleScopeMovePayload } from './internal';

/**
 * 公共操作控制器接口（暴露给业务代码）
 *
 * 只包含业务操作，隐藏内部实现细节
 *
 * @template K - 项目 ID 的类型
 * @template V - 项目状态数据的类型
 */
export interface TGranuleScopeController<K, V> {
  /**
   * 插入新的作用域项目
   * @param id - 项目 ID
   * @param data - 项目状态数据
   * @param beforeId - 可选：插入到指定项目之前
   */
  insert(id: K, data: V, beforeId?: K): void;

  /** 删除指定的作用域项目 */
  delete(id: K): void;

  /** 移动多个项目到新位置 */
  move(ids: K[], beforeId?: K): void;

  /** 更新指定项目的状态数据 */
  update(id: K, data: V): void;

  /** 获取所有项目的只读状态 */
  getState(): ReadonlyArray<TGranuleScopeItem<K, V>>;

  /** 获取指定项目的状态 */
  getItem(id: K): TGranuleScopeItem<K, V> | undefined;

  /** 检查项目是否存在 */
  hasItem(id: K): boolean;
}

/**
 * 事件监听器接口（专门用于事件订阅）
 *
 * 分离事件监听功能，提供类型安全的事件订阅
 *
 * @template K - 项目 ID 的类型
 * @template V - 项目状态数据的类型
 */
export interface TGranuleScopeSubscriber<K, V> {
  /** 监听列表插入事件 */
  onInsert(
    callback: (payload: TGranuleScopeInsertPayload<K, V>) => void,
  ): () => void;

  /** 监听列表删除事件 */
  onDelete(callback: (id: K) => void): () => void;

  /** 监听列表移动事件 */
  onMove(callback: (payload: TGranuleScopeMovePayload<K>) => void): () => void;

  /** 监听指定项目的状态更新事件 */
  onItemUpdate(id: K, callback: (data: V) => void): () => void;

  /** 监听指定项目的挂载事件 */
  onItemMount(id: K, callback: (data: V) => void): () => void;

  /** 监听指定项目的卸载事件 */
  onItemUnmount(id: K, callback: (data: V) => void): () => void;
}

/**
 * 基础 imperative API 接口
 *
 * 所有组件的 imperative API 都应该继承这个接口
 */
export interface TGranuleScopeItemImperative {
  [key: string]: any;
}

/**
 * 项目引用接口，包含 DOM 引用和自定义 imperative API
 *
 * @template T - 自定义 imperative API 的类型，必须继承 TGranuleScopeItemImperative
 */
export interface TGranuleScopeItemRef<
  T extends TGranuleScopeItemImperative = TGranuleScopeItemImperative,
> {
  /** 项目的 DOM 元素引用 */
  domRef: React.RefObject<HTMLElement>;
  /** 项目的自定义 imperative API */
  imperative?: T;
}

/**
 * 组合式作用域管理的返回类型
 *
 * @template K - 项目 ID 的类型
 * @template V - 项目状态数据的类型
 */
export interface TGranuleScopeResult<K, V> {
  /** 上下文提供者组件 */
  Provider: ComponentType<{
    children: {
      (props: { id: K }): ReactNode;
      createElement: (state: V) => HTMLElement;
    };
    className?: string;
    style?: CSSProperties;
  }>;

  /** 根组件直供的安全 API 集合 */
  controller: TGranuleScopeController<K, V>;

  /** 事件订阅器 API */
  subscriber: TGranuleScopeSubscriber<K, V>;

  /** 作用域容器 DOM 元素的引用 */
  domRef: RefObject<HTMLDivElement>;

  /** 获取指定项目的引用，包含 DOM 和 imperative API */
  getItemRef: <
    T extends TGranuleScopeItemImperative = TGranuleScopeItemImperative,
  >(
    id: K,
  ) => TGranuleScopeItemRef<T> | null;
}
