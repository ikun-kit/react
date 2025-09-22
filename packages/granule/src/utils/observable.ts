/** 事件处理函数类型 */
export type EventHandler<T = any> = (event: T) => void;
/** 取消订阅函数类型 */
export type Disposer = () => void;

/**
 * 类型安全的观察者模式实现
 *
 * 支持泛型载荷映射，提供完整的事件发布订阅功能
 */
export class Observable<PayloadMap = Record<string, never>> {
  /** 事件名称到处理函数集合的映射 */
  private readonly handlerMap = new Map<keyof PayloadMap, Set<EventHandler>>();
  /** 调试模式开关 */
  private debugMode = false;

  /** 订阅指定事件 */
  subscribe<K extends keyof PayloadMap>(
    event: K,
    handler: EventHandler<PayloadMap[K]>,
  ): Disposer {
    if (!this.handlerMap.has(event)) {
      this.handlerMap.set(event, new Set());
    }

    this.handlerMap.get(event)?.add(handler);

    return () => this.unsubscribe(event, handler);
  }

  /** 取消指定事件的订阅 */
  unsubscribe<K extends keyof PayloadMap>(
    event: K,
    handler: EventHandler<PayloadMap[K]>,
  ): void {
    const handlers = this.handlerMap.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlerMap.delete(event);
      }
    }
  }

  /** 向所有订阅者广播事件 */
  broadcast<K extends keyof PayloadMap>(
    event: K,
    payload: PayloadMap[K],
  ): void {
    const handlers = this.handlerMap.get(event);
    if (!handlers) return;

    // 调试模式下打印事件信息
    if (this.debugMode) {
      console.group(`[Observable] Event: ${String(event)}`);
      console.log('Time:', new Date().toLocaleTimeString());
      console.log('Handlers:', handlers.size);
      console.log('Payload:', payload);
      console.groupEnd();
    }

    handlers.forEach(handler => {
      try {
        handler(payload);
      } catch (error) {
        console.error(
          `[Observable] Error in event "${String(event)}" callback:`,
          error,
        );
      }
    });
  }

  /** 启用或禁用调试模式 */
  setDebug(enabled: boolean): void {
    this.debugMode = enabled;
    if (enabled) {
      console.log('[Observable] Debug mode enabled');
    }
  }

  /** 一次性订阅，触发后自动取消 */
  once<K extends keyof PayloadMap>(
    event: K,
    handler: EventHandler<PayloadMap[K]>,
  ): Disposer {
    const onceHandler = (payload: PayloadMap[K]) => {
      handler(payload);
      this.unsubscribe(event, onceHandler);
    };

    return this.subscribe(event, onceHandler);
  }

  /** 获取指定事件的订阅者数量 */
  count<K extends keyof PayloadMap>(event: K): number {
    return this.handlerMap.get(event)?.size ?? 0;
  }

  /** 清除指定事件或所有事件的监听器 */
  clear<K extends keyof PayloadMap>(event?: K): void {
    if (event !== undefined) {
      this.handlerMap.delete(event);
    } else {
      this.handlerMap.clear();
    }
  }

  /** 获取所有已注册的事件名称 */
  get events(): (keyof PayloadMap)[] {
    return Array.from(this.handlerMap.keys());
  }

  /** 销毁实例并清理所有资源 */
  destroy(): void {
    if (this.events.length > 0) {
      console.warn(
        '[Observable] Destroying observable with active events:',
        this.events,
        'This may indicate memory leaks. Please ensure all subscriptions are properly disposed.',
      );
    }
    this.handlerMap.clear();
  }
}
