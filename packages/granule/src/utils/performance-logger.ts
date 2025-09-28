/**
 * 性能记录工具 - 类似 console.time/timeEnd 的高性能计时工具
 *
 * 提供轻量级的性能监控，只记录超过阈值的操作
 * 支持全局开关控制，生产环境可关闭
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
      enabled: process.env.NODE_ENV === 'development', // 仅开发环境启用
      prefix: '🎯',
      ...config,
    };
  }

  /** 打标记点 - 开始计时 */
  point(label: string): void {
    if (!this.config.enabled) return;
    this.activeTimers.set(label, performance.now());
  }

  /** 计算时间跨度并记录 */
  span(label: string, context?: Record<string, any>): number {
    if (!this.config.enabled) return 0;

    const startTime = this.activeTimers.get(label);
    if (!startTime) {
      console.warn(`PerformanceLogger: Point "${label}" was not marked`);
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

  /** 立即记录一个已知的时间段 */
  log(label: string, duration: number, context?: Record<string, any>): void {
    if (!this.config.enabled) return;

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

  /** 清理指定标记点 */
  clearPoint(label: string): boolean {
    return this.activeTimers.delete(label);
  }

  /** 清理所有活跃标记点 */
  clearAll(): void {
    this.activeTimers.clear();
  }

  /** 获取所有活跃标记点的标签 */
  getActivePoints(): string[] {
    return Array.from(this.activeTimers.keys());
  }
}

// 默认实例
export const perfLogger = new PerformanceLogger();

// 便捷函数 - 打点计时
export const perf = {
  /** 打标记点 */
  point: (label: string) => perfLogger.point(label),
  /** 计算时间跨度 */
  span: (label: string, context?: Record<string, any>) =>
    perfLogger.span(label, context),
  /** 立即记录时间 */
  log: (label: string, duration: number, context?: Record<string, any>) =>
    perfLogger.log(label, duration, context),
  /** 快速记录（从时间戳开始） */
  quick: (label: string, startTime: number, context?: Record<string, any>) =>
    perfLogger.quick(label, startTime, context),

  // 标记点管理
  clearPoint: (label: string) => perfLogger.clearPoint(label),
  clearAll: () => perfLogger.clearAll(),
  getActivePoints: () => perfLogger.getActivePoints(),

  // 配置相关
  configure: (config: Partial<PerformanceLoggerConfig>) =>
    perfLogger.configure(config),
  setEnabled: (enabled: boolean) => perfLogger.setEnabled(enabled),
  setThreshold: (threshold: number) => perfLogger.setThreshold(threshold),
};
