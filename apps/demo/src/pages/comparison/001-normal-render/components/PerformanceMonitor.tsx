import { forwardRef, useImperativeHandle, useState } from 'react';

import { PerformanceMetrics, PerformanceMonitorAPI } from '../types';

// 组件属性 - 移除原有的 metrics props
export interface PerformanceMonitorProps {
  // 可以保留其他非性能数据相关的 props
}

function formatTime(time: number | null): string {
  if (time === null) return '-';
  return `${time.toFixed(2)}ms`;
}

function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
}

function MetricCard({
  title,
  metrics,
  color,
}: {
  title: string;
  metrics: PerformanceMetrics | null;
  color: string;
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className={`text-lg font-semibold mb-4 ${color}`}>{title}</h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">项目总数:</span>
          <span className="text-white font-mono">
            {metrics?.totalItems || 0}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">已挂载:</span>
          <span className="text-white font-mono">
            {metrics?.mountedItems || 0}
            {metrics && (
              <span className="text-gray-500 ml-1">
                ({formatPercentage(metrics.mountedItems, metrics.totalItems)})
              </span>
            )}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">首次挂载:</span>
          <span className="text-white font-mono">
            {formatTime(metrics?.firstMountTime || null)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">总挂载时间:</span>
          <span className="text-white font-mono">
            {formatTime(metrics?.totalMountTime || null)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">平均挂载:</span>
          <span className="text-white font-mono">
            {formatTime(metrics?.averageMountTime || null)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ComparisonCard({
  granuleMetrics,
  nativeReactMetrics,
}: {
  granuleMetrics: PerformanceMetrics | null;
  nativeReactMetrics: PerformanceMetrics | null;
}) {
  const granuleTotal = granuleMetrics?.totalMountTime;
  const nativeTotal = nativeReactMetrics?.totalMountTime;

  let performanceComparison = null;
  if (granuleTotal && nativeTotal) {
    const ratio = granuleTotal / nativeTotal;
    const percentage = ((ratio - 1) * 100).toFixed(1);

    if (ratio > 1) {
      performanceComparison = (
        <div className="text-red-400">
          Granule 比 Native React 慢 {percentage}%
        </div>
      );
    } else {
      performanceComparison = (
        <div className="text-green-400">
          Granule 比 Native React 快{' '}
          {Math.abs(parseFloat(percentage)).toFixed(1)}%
        </div>
      );
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mt-4">
      <h3 className="text-lg font-semibold mb-4 text-yellow-400">性能对比</h3>

      <div className="space-y-3">
        {performanceComparison && (
          <div className="p-3 bg-gray-700 rounded">
            <div className="text-sm font-medium">总挂载时间对比:</div>
            <div className="text-lg mt-1">{performanceComparison}</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-400 mb-1">Granule 首次挂载:</div>
            <div className="text-white font-mono">
              {formatTime(granuleMetrics?.firstMountTime || null)}
            </div>
          </div>
          <div>
            <div className="text-gray-400 mb-1">Native React 首次挂载:</div>
            <div className="text-white font-mono">
              {formatTime(nativeReactMetrics?.firstMountTime || null)}
            </div>
          </div>
        </div>

        <div className="p-3 bg-yellow-900/30 border border-yellow-700 rounded mt-4">
          <div className="text-yellow-300 text-sm font-medium mb-2">
            ⚠️ 性能差异说明
          </div>
          <div className="text-yellow-200 text-xs space-y-1">
            <div>• Native React: 1个 Root + N个组件</div>
            <div>• Granule: N个 Root + N个组件</div>
            <div>• Root 创建开销是主要性能差异来源</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const PerformanceMonitor = forwardRef<
  PerformanceMonitorAPI,
  PerformanceMonitorProps
>((_, ref) => {
  // 内部状态管理
  const [granuleMetrics, setGranuleMetrics] =
    useState<PerformanceMetrics | null>(null);
  const [nativeReactMetrics, setNativeReactMetrics] =
    useState<PerformanceMetrics | null>(null);

  // 暴露 API 方法
  useImperativeHandle(
    ref,
    () => ({
      updateGranuleMetrics: (metrics: PerformanceMetrics) => {
        setGranuleMetrics(metrics);
      },

      updateNativeReactMetrics: (metrics: PerformanceMetrics) => {
        setNativeReactMetrics(metrics);
      },

      resetGranuleMetrics: () => {
        setGranuleMetrics(null);
      },

      resetNativeReactMetrics: () => {
        setNativeReactMetrics(null);
      },

      resetMetrics: () => {
        setGranuleMetrics(null);
        setNativeReactMetrics(null);
      },
    }),
    [],
  );

  // 生成 MD Table 格式的性能数据
  const generateMarkdownTable = () => {
    const granule = granuleMetrics;
    const native = nativeReactMetrics;

    const formatTime = (time: number | null) =>
      time ? `${time.toFixed(2)}ms` : '-';
    const calculateComparison = (
      granuleTime: number | null,
      nativeTime: number | null,
    ) => {
      if (!granuleTime || !nativeTime) return '-';
      const ratio = granuleTime / nativeTime;
      const percentage = Math.abs((ratio - 1) * 100).toFixed(1);
      return ratio > 1
        ? `Granule 慢 ${percentage}%`
        : `Granule 快 ${percentage}%`;
    };

    const timestamp = new Date().toLocaleString('zh-CN');

    return `# 性能测试报告

## 测试时间
${timestamp}

## 性能对比数据

| 指标 | Granule | Native React | 对比结果 |
|------|---------|--------------|----------|
| 总项目数 | ${granule?.totalItems || 0} | ${native?.totalItems || 0} | - |
| 已挂载项目 | ${granule?.mountedItems || 0} | ${native?.mountedItems || 0} | - |
| 首次挂载时间 | ${formatTime(granule?.firstMountTime || null)} | ${formatTime(native?.firstMountTime || null)} | ${calculateComparison(granule?.firstMountTime || null, native?.firstMountTime || null)} |
| 总挂载时间 | ${formatTime(granule?.totalMountTime || null)} | ${formatTime(native?.totalMountTime || null)} | ${calculateComparison(granule?.totalMountTime || null, native?.totalMountTime || null)} |
| 平均挂载时间 | ${formatTime(granule?.averageMountTime || null)} | ${formatTime(native?.averageMountTime || null)} | ${calculateComparison(granule?.averageMountTime || null, native?.averageMountTime || null)} |

## 测试说明

- **Granule**: 使用 Granule 状态管理系统，脱围渲染架构
- **Native React**: 使用原生 React 状态管理，传统组件架构
- **对比结果**: 基于总挂载时间的性能对比分析

## 性能分析

${
  granule?.totalMountTime && native?.totalMountTime
    ? granule.totalMountTime > native.totalMountTime
      ? `Granule 的总挂载时间比 Native React 慢 ${((granule.totalMountTime / native.totalMountTime - 1) * 100).toFixed(1)}%，主要原因是 Granule 需要为每个 item 创建独立的 React Root，而 Native React 只需要一个 Root。这是脱围渲染架构的性能代价。`
      : `Granule 的总挂载时间比 Native React 快 ${((1 - granule.totalMountTime / native.totalMountTime) * 100).toFixed(1)}%，表现出色！`
    : '暂无完整性能数据进行分析。'
}
`;
  };

  // 下载性能数据
  const downloadPerformanceData = () => {
    const markdownContent = generateMarkdownTable();
    const blob = new Blob([markdownContent], {
      type: 'text/markdown;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `performance-report-${new Date().toISOString().slice(0, 16).replace(/[:-]/g, '')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="flex justify-end">
        <button
          onClick={downloadPerformanceData}
          disabled={!granuleMetrics && !nativeReactMetrics}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            !granuleMetrics && !nativeReactMetrics
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          <span>📥</span>
          下载性能报告
        </button>
      </div>

      {/* 性能数据卡片 - 横向分布 */}
      <div className="grid grid-cols-2 gap-6">
        <MetricCard
          title="Granule 性能"
          metrics={granuleMetrics}
          color="text-blue-400"
        />

        <MetricCard
          title="Native React 性能"
          metrics={nativeReactMetrics}
          color="text-green-400"
        />
      </div>

      {/* 对比分析 - 全宽显示 */}
      <ComparisonCard
        granuleMetrics={granuleMetrics}
        nativeReactMetrics={nativeReactMetrics}
      />
    </div>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';
