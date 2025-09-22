/**
 * 内部使用 - Granule React 内部类型定义
 *
 * ⚠️ 警告：此文件为内部实现，不应在业务代码中直接使用
 *
 * 定义了 Granule 作用域管理系统的内部核心类型：
 * - 内部核心模型接口
 * - 事件系统的载荷类型
 * - Provider 组件的内部类型
 */
import type { HTMLAttributes, ReactNode, RefObject } from 'react';

/**
 * 作用域项目的基础数据结构
 *
 * @template K - 项目 ID 的类型（如 string, number 等）
 * @template V - 项目状态数据的类型
 */
export type TGranuleScopeItem<K, V> = {
  /** 项目的唯一标识符 */
  id: K;
  /** 项目的状态数据 */
  state: V;
};

/**
 * 内部核心模型接口（仅供 Provider 内部使用）
 *
 * ⚠️ 内部使用 - 包含完整的内部管理功能，不对外暴露
 *
 * @template K - 项目 ID 的类型
 * @template V - 项目状态数据的类型
 */
export interface TGranuleScopeCore<K, V> {
  /** 当前所有作用域项目的状态数组 */
  state: Array<TGranuleScopeItem<K, V>>;

  /** 作用域容器 DOM 元素的引用 */
  domRef: RefObject<HTMLDivElement>;

  /** 销毁整个作用域模型，清理所有资源 */
  destroy: () => void;

  /** 项目级操作 - 针对单个作用域项目的操作 */
  item: {
    /** 触发项目挂载事件（仅负责通知） */
    mount: (id: K) => void;

    /** 触发项目卸载事件（仅负责通知） */
    unmount: (id: K) => void;

    /** 更新指定项目的状态数据（实际操作） */
    update: (id: K, data: V) => void;

    /** 监听指定项目的状态更新事件 */
    onUpdate: (id: K, callback: (data: V) => void) => () => void;

    /** 监听指定项目的挂载事件 */
    onMount: (id: K, callback: (data: V) => void) => () => void;

    /** 监听指定项目的卸载事件 */
    onUnmount: (id: K, callback: (data: V) => void) => () => void;
  };

  /** 列表级操作 - 针对整个作用域列表的操作 */
  list: {
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

    /** 更新指定项目的状态（列表级更新） */
    update: (id: K, data: V) => void;

    /** 监听列表插入事件 */
    onInsert: (
      callback: (payload: { id: K; data: V; beforeId?: K }) => void,
    ) => () => void;

    /** 监听列表删除事件 */
    onDelete: (callback: (id: K) => void) => () => void;

    /** 监听列表移动事件 */
    onMove: (
      callback: (payload: TGranuleScopeMovePayload<K>) => void,
    ) => () => void;
  };
}

/**
 * 作用域提供者组件的属性类型
 *
 * ⚠️ 内部使用 - 继承自 HTMLDivElement 的属性，同时提供作用域管理的特定配置
 *
 * @template K - 项目 ID 的类型
 * @template V - 项目状态数据的类型
 */
export interface TGranuleScopeProviderProps<K, V>
  extends Partial<Omit<HTMLAttributes<HTMLDivElement>, 'children'>> {
  /** 作用域核心模型实例，提供内部状态管理功能 */
  context: TGranuleScopeCore<K, V>;

  /**
   * 子组件渲染函数，包含两个必需的方法：
   * - 组件渲染函数：接收 { id } 参数，返回 React 节点
   * - createElement：为每个项目创建 DOM 容器元素
   */
  children: {
    /** React 组件渲染函数 */
    (props: { id: K }): ReactNode;
    /** DOM 容器元素创建函数 */
    createElement: (state: V) => HTMLElement;
  };
}

/**
 * 列表插入事件的载荷类型
 *
 * ⚠️ 内部使用
 *
 * @template K - 项目 ID 的类型
 * @template V - 项目状态数据的类型
 */
export type TGranuleScopeInsertPayload<K, V> = {
  /** 被插入项目的 ID */
  id: K;
  /** 被插入项目的状态数据 */
  data: V;
  /** 可选：插入到指定项目之前的目标项目 ID */
  beforeId?: K;
};

/**
 * 移动事件的载荷类型
 *
 * ⚠️ 内部使用
 *
 * @template K - 项目 ID 的类型
 */
export type TGranuleScopeMovePayload<K> = {
  /** 被移动项目的 ID 列表 */
  ids: K[];
  /** 可选：移动到指定项目之前的目标项目 ID */
  beforeId?: K;
  /** 移动前的索引位置列表 */
  fromIndexes: number[];
  /** 移动后的起始索引位置 */
  toIndex: number;
};

/**
 * 列表清空事件的载荷类型
 *
 * ⚠️ 内部使用
 *
 * @template K - 项目 ID 的类型
 * @template V - 项目状态数据的类型
 */
export type TGranuleScopeClearPayload<K, V> = {
  /** 被删除的所有项目列表 */
  deletedItems: Array<TGranuleScopeItem<K, V>>;
};

/**
 * 完整的事件映射类型定义
 *
 * ⚠️ 内部使用 - 使用 TypeScript 模板字面量类型实现类型安全的事件系统
 * 每个事件名称都对应特定的载荷类型
 *
 * @template K - 项目 ID 的类型
 * @template V - 项目状态数据的类型
 */
export type TGranuleScopePayloadMap<K, V> = {
  /** 项目更新事件映射：item:update:${string} -> V */
  [E in `item:update:${string}`]: V;
} & {
  /** 项目挂载事件映射：item:mount:${string} -> V */
  [E in `item:mount:${string}`]: V;
} & {
  /** 项目卸载事件映射：item:unmount:${string} -> V */
  [E in `item:unmount:${string}`]: V;
} & {
  /** 列表插入事件：载荷包含插入的项目信息 */
  'list:insert': TGranuleScopeInsertPayload<K, V>;
  /** 列表删除事件：载荷为被删除项目的 ID */
  'list:delete': K;
  /** 列表移动事件：载荷包含移动的项目信息 */
  'list:move': TGranuleScopeMovePayload<K>;
};
