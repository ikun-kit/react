// 性能测试工具 - 用于精确定位瓶颈

export class PerformanceProfiler {
  private timers = new Map<string, number>();

  start(label: string) {
    this.timers.set(label, performance.now());
    console.time(label);
  }

  end(label: string): number {
    const startTime = this.timers.get(label);
    if (!startTime) {
      console.warn(`Timer "${label}" was not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    console.timeEnd(label);
    console.log(`🎯 [${label}] Duration: ${duration.toFixed(2)}ms`);

    this.timers.delete(label);
    return duration;
  }

  async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label);
    try {
      const result = await fn();
      this.end(label);
      return result;
    } catch (error) {
      this.end(label);
      throw error;
    }
  }

  measure<T>(label: string, fn: () => T): T {
    this.start(label);
    try {
      const result = fn();
      this.end(label);
      return result;
    } catch (error) {
      this.end(label);
      throw error;
    }
  }
}

export const profiler = new PerformanceProfiler();
