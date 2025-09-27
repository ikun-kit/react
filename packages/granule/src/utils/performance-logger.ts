/**
 * 性能记录工具 - 用于精确定位性能瓶颈
 *
 * 提供轻量级的性能监控，只记录超过阈值的操作
 */

export interface PerformanceLoggerConfig {
  /** 最小记录阈值(ms)，超过此时间才会打印日志 */
  threshold: number;
  /** 是否启用性能日志 */
  enabled: boolean;
  /** 日志前缀 */
  prefix: string;
}

export class PerformanceLogger {
  private config: PerformanceLoggerConfig;
  private activeTimers = new Map<string, number>();

  constructor(config: Partial<PerformanceLoggerConfig> = {}) {
    this.config = {
      threshold: 2, // 默认超过2ms才打印
      enabled: true,
      prefix: '🎯',
      ...config,
    };
  }

  /** 开始计时 */
  start(label: string): void {
    if (!this.config.enabled) return;
    this.activeTimers.set(label, performance.now());
  }

  /** 结束计时并记录（如果超过阈值） */
  end(label: string, context?: Record<string, any>): number {
    if (!this.config.enabled) return 0;

    const startTime = this.activeTimers.get(label);
    if (!startTime) {
      console.warn(`PerformanceLogger: Timer "${label}" was not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.activeTimers.delete(label);

    if (duration >= this.config.threshold) {
      const contextStr = context
        ? ` | ${Object.entries(context)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ')}`
        : '';
      console.log(
        `${this.config.prefix} [${label}] ${duration.toFixed(2)}ms${contextStr}`,
      );
    }

    return duration;
  }

  /** 测量同步函数执行时间 */
  measure<T>(label: string, fn: () => T, context?: Record<string, any>): T {
    if (!this.config.enabled) return fn();

    this.start(label);
    try {
      const result = fn();
      this.end(label, context);
      return result;
    } catch (error) {
      this.end(label, { ...context, error: true });
      throw error;
    }
  }

  /** 测量异步函数执行时间 */
  async measureAsync<T>(
    label: string,
    fn: () => Promise<T>,
    context?: Record<string, any>,
  ): Promise<T> {
    if (!this.config.enabled) return fn();

    this.start(label);
    try {
      const result = await fn();
      this.end(label, context);
      return result;
    } catch (error) {
      this.end(label, { ...context, error: true });
      throw error;
    }
  }

  /** 快速测量：直接返回是否超过阈值的时间 */
  quick(
    label: string,
    startTime: number,
    context?: Record<string, any>,
  ): number {
    if (!this.config.enabled) return 0;

    const duration = performance.now() - startTime;
    if (duration >= this.config.threshold) {
      const contextStr = context
        ? ` | ${Object.entries(context)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ')}`
        : '';
      console.log(
        `${this.config.prefix} [${label}] ${duration.toFixed(2)}ms${contextStr}`,
      );
    }
    return duration;
  }

  /** 更新配置 */
  configure(config: Partial<PerformanceLoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /** 启用/禁用日志 */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  /** 设置阈值 */
  setThreshold(threshold: number): void {
    this.config.threshold = threshold;
  }

  /** 清理所有活跃计时器 */
  clear(): void {
    this.activeTimers.clear();
  }
}

// 默认实例
export const perfLogger = new PerformanceLogger();

// 便捷函数
export const perf = {
  start: (label: string) => perfLogger.start(label),
  end: (label: string, context?: Record<string, any>) =>
    perfLogger.end(label, context),
  measure: <T>(label: string, fn: () => T, context?: Record<string, any>) =>
    perfLogger.measure(label, fn, context),
  measureAsync: <T>(
    label: string,
    fn: () => Promise<T>,
    context?: Record<string, any>,
  ) => perfLogger.measureAsync(label, fn, context),
  quick: (label: string, startTime: number, context?: Record<string, any>) =>
    perfLogger.quick(label, startTime, context),
  configure: (config: Partial<PerformanceLoggerConfig>) =>
    perfLogger.configure(config),
  setEnabled: (enabled: boolean) => perfLogger.setEnabled(enabled),
  setThreshold: (threshold: number) => perfLogger.setThreshold(threshold),
};
