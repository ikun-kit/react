/**
 * BasicScope 向上通信事件类型定义
 * 定义特定于此 Scope 的事件载荷映射
 */

// BasicScope 的向上通信事件类型映射
export interface BasicScopeUpwardPayloadMap {
  // 当项目的值发生变化时
  'value-changed': (payload: {
    oldValue: number;
    newValue: number;
    itemName: string;
  }) => void;
}
