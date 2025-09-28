// 性能指标类型
export interface PerformanceMetrics {
  totalItems: number;
  mountedItems: number;
  totalMountTime: number | null;
  firstMountTime: number | null;
  averageMountTime: number | null;
}

// Granule Scope API 接口
export interface GranuleScopeAPI {
  /** 重新渲染（重置为初始数据） */
  resetData: () => void;
  /** 获取性能数据 */
  getPerformanceMetrics: () => PerformanceMetrics;
}

// React Native Scope API 接口
export interface ReactNativeScopeAPI {
  /** 重新渲染（重置为初始数据） */
  resetData: () => void;
  /** 获取性能数据 */
  getPerformanceMetrics: () => PerformanceMetrics;
}

// Performance Monitor API 接口
export interface PerformanceMonitorAPI {
  /** 更新 Granule 性能数据 */
  updateGranuleMetrics: (metrics: PerformanceMetrics) => void;
  /** 更新 Native React 性能数据 */
  updateNativeReactMetrics: (metrics: PerformanceMetrics) => void;
  /** 重置 Granule 性能数据 */
  resetGranuleMetrics: () => void;
  /** 重置 Native React 性能数据 */
  resetNativeReactMetrics: () => void;
  /** 重置所有性能数据 */
  resetMetrics: () => void;
}
