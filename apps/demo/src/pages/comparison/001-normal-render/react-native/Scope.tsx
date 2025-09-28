import { perf } from '@ikun-kit/react-granule';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { PerformanceMetrics, ReactNativeScopeAPI } from '../types';
import { ReactNativeScopeItem } from './ScopeItem';
import { ReactNativeItem } from './types';

interface ReactNativeScopeProps {
  data: ReactNativeItem[];
  onPerformanceUpdate?: (metrics: PerformanceMetrics) => void;
}

export const ReactNativeScope = forwardRef<
  ReactNativeScopeAPI,
  ReactNativeScopeProps
>(({ data, onPerformanceUpdate }, ref) => {
  // 组件开始渲染就立即计时
  perf.point('ReactNativeScope Total');
  perf.point('ReactNativeScope First Mount');

  const [scopeData, setScopeData] = useState(data);
  const mountedItems = useRef<Set<string>>(new Set());
  const performanceMetrics = useRef<PerformanceMetrics>({
    totalItems: 0,
    mountedItems: 0,
    totalMountTime: null,
    firstMountTime: null,
    averageMountTime: null,
  });
  const firstMountTime = useRef<number | null>(null);

  // 更新性能指标
  const updatePerformanceMetrics = () => {
    const metrics = {
      ...performanceMetrics.current,
      totalItems: scopeData.length,
      mountedItems: mountedItems.current.size,
    };

    performanceMetrics.current = metrics;
    onPerformanceUpdate?.(metrics);
  };

  const handleItemMount = (id: string) => {
    if (!mountedItems.current.has(id)) {
      if (mountedItems.current.size === 0) {
        const firstTime = perf.span('ReactNativeScope First Mount');
        firstMountTime.current = firstTime;
        performanceMetrics.current.firstMountTime = firstTime;
      }

      mountedItems.current.add(id);
      updatePerformanceMetrics();

      // 当所有项目都挂载完成时
      if (mountedItems.current.size >= scopeData.length) {
        const totalTime = perf.span('ReactNativeScope Total', {
          totalItems: mountedItems.current.size,
        });
        // 使用 perf.span 返回的真实时长
        performanceMetrics.current.totalMountTime = totalTime;
        performanceMetrics.current.averageMountTime =
          totalTime / scopeData.length;
        console.log('All React Native items mounted');
      }
    }
  };

  // 重置性能数据
  const resetPerformanceData = () => {
    mountedItems.current.clear();
    firstMountTime.current = null;
    performanceMetrics.current = {
      totalItems: 0,
      mountedItems: 0,
      totalMountTime: null,
      firstMountTime: null,
      averageMountTime: null,
    };
    // 重新开始计时
    perf.point('ReactNativeScope Total');
    perf.point('ReactNativeScope First Mount');
    updatePerformanceMetrics();
  };

  // 暴露 API 方法
  useImperativeHandle(
    ref,
    () => ({
      resetData: () => {
        setScopeData(data);
        resetPerformanceData();
      },

      getPerformanceMetrics: () => performanceMetrics.current,
    }),
    [data],
  );

  return (
    <>
      {/* Items Container */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-750 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            Native React 列表
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            使用原生 React 状态管理 ({scopeData.length} 项)
          </p>
        </div>
        <div style={{ background: '#1f2937' }} className="p-6">
          {scopeData.map(item => (
            <ReactNativeScopeItem
              key={item.id}
              id={item.id}
              state={item.state}
              onMount={handleItemMount}
            />
          ))}
        </div>
      </div>
    </>
  );
});

ReactNativeScope.displayName = 'ReactNativeScope';
