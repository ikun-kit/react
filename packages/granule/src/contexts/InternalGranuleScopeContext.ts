/**
 * GranuleScope React Context 定义
 *
 * 提供作用域模型的 React Context 机制，使得组件树中的任何组件
 * 都可以访问到父级 GranuleScopeProvider 提供的作用域模型实例
 *
 * 这个模块包含：
 * - GranuleScopeContext: React Context 实例
 * - useInternalGranuleScopeContext: 用于访问 Context 的自定义 Hook
 */
import { createContext, useContext } from 'react';

import type { TGranuleScopeCore } from '../types/internal';

/**
 * Granule 作用域的 React Context
 *
 * 用于在组件树中传递作用域模型实例，支持任意类型的 ID 和状态数据
 */
export const GranuleScopeContext = createContext<TGranuleScopeCore<
  any,
  any
> | null>(null);

/**
 * 获取 Granule 作用域 Context 的自定义 Hook
 *
 * 从最近的 GranuleScopeProvider 中获取作用域模型实例
 * 必须在 GranuleScopeProvider 的子组件中使用
 *
 * @template K - 项目 ID 的类型
 * @template V - 项目状态数据的类型
 *
 * @returns 作用域模型实例
 * @throws 如果没有在 GranuleScopeProvider 内使用会抛出错误
 */
export const useInternalGranuleScopeContext = <K, V>(): TGranuleScopeCore<
  K,
  V
> => {
  const context = useContext(GranuleScopeContext);
  if (!context) {
    throw new Error(
      'useInternalGranuleScopeContext must be used within a GranuleScopeProvider',
    );
  }
  return context as TGranuleScopeCore<K, V>;
};
