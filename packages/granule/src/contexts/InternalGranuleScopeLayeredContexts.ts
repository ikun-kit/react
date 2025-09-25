/**
 * ⚠️ 内部使用 - 分层作用域上下文定义
 *
 * 提供三层上下文结构：
 * - GranuleScopeCoreContext: 内部核心管理上下文（仅供 Provider 内部使用）
 * - GranuleScopeControllerContext: 业务操作控制器上下文
 * - GranuleScopeSubscriberContext: 事件监听器上下文
 *
 * @internal 此文件仅供内部使用，业务代码应使用公共 hooks
 *
 * ⚠️ 警告：此文件为内部实现，不应在业务代码中直接使用
 */
import { createContext } from 'react';

import type {
  TGranuleScopeController,
  TGranuleScopeSubscriber,
} from '../types/external';
import type { TGranuleScopeCore } from '../types/internal';

/**
 * 内部核心管理上下文（仅供 Provider 内部使用）
 *
 * @internal
 */
export const GranuleScopeCoreContext = createContext<TGranuleScopeCore<
  any,
  any,
  Record<string, any>
> | null>(null);
