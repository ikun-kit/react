import { useRef, useState } from 'react';

import {
  BackNav,
  ContentCard,
  PageHeader,
  PageLayout,
} from '../../../components';
import { ControlPanel } from './components/ControlPanel';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { GranuleScope } from './granule/Scope';
import { create001DefaultData } from './pipeline/default-data';
import { ReactNativeScope } from './react-native/Scope';
import {
  GranuleScopeAPI,
  PerformanceMetrics,
  PerformanceMonitorAPI,
  ReactNativeScopeAPI,
} from './types';

export function NormalRenderComparison() {
  // 获取初始数据
  const initialData = create001DefaultData();

  // 转换数据格式给 ReactNative 使用
  const nativeReactData = initialData.map(item => ({
    id: item.id,
    state: item.state,
  }));

  // 组件引用
  const granuleRef = useRef<GranuleScopeAPI>(null);
  const nativeReactRef = useRef<ReactNativeScopeAPI>(null);
  const performanceMonitorRef = useRef<PerformanceMonitorAPI>(null);

  // 渲染控制状态
  const [showGranule, setShowGranule] = useState(false);
  const [showNativeReact, setShowNativeReact] = useState(false);

  // 性能数据更新回调函数
  const handleGranulePerformanceUpdate = (metrics: PerformanceMetrics) => {
    performanceMonitorRef.current?.updateGranuleMetrics(metrics);
  };

  const handleNativeReactPerformanceUpdate = (metrics: PerformanceMetrics) => {
    performanceMonitorRef.current?.updateNativeReactMetrics(metrics);
  };

  // 控制渲染的方法
  const handleRenderGranule = () => {
    setShowGranule(true);
    // 只重置 Granule 性能数据，保留 Native React 数据
    performanceMonitorRef.current?.resetGranuleMetrics();
  };

  const handleRenderNativeReact = () => {
    setShowNativeReact(true);
    // 只重置 Native React 性能数据，保留 Granule 数据
    performanceMonitorRef.current?.resetNativeReactMetrics();
  };

  const handleReset = () => {
    setShowGranule(false);
    setShowNativeReact(false);
    // 重置所有性能数据
    performanceMonitorRef.current?.resetMetrics();
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <PageHeader
          backNav={<BackNav to="/comparison">返回对比列表</BackNav>}
          title="正常渲染性能对比"
          subtitle="Granule vs Native React 渲染性能实时对比"
        />

        <ContentCard className="p-6">
          {/* 纵向布局容器 */}
          <div className="space-y-6">
            {/* 渲染控制面板 - 全宽 */}
            <div>
              <ControlPanel
                onRenderGranule={handleRenderGranule}
                onRenderNativeReact={handleRenderNativeReact}
                onReset={handleReset}
                showGranule={showGranule}
                showNativeReact={showNativeReact}
              />
            </div>

            {/* 性能监控 - 全宽 */}
            <div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-6">
                  性能监控
                </h2>
                <PerformanceMonitor ref={performanceMonitorRef} />
              </div>
            </div>

            {/* 列表示例对比 - 左右分布 */}
            <div className="grid grid-cols-2 gap-6">
              {/* 左下: Granule 渲染示例 */}
              <div>
                {showGranule ? (
                  <GranuleScope
                    ref={granuleRef}
                    data={initialData}
                    onPerformanceUpdate={handleGranulePerformanceUpdate}
                  />
                ) : (
                  <div className="bg-gray-800 rounded-lg border-2 border-dashed border-gray-600">
                    <div className="px-6 py-4 bg-gray-750 border-b border-gray-700">
                      <h2 className="text-lg font-semibold text-white">
                        Granule 列表
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">等待渲染...</p>
                    </div>
                    <div className="p-12 text-center">
                      <div className="text-gray-500 text-lg mb-2">📝</div>
                      <p className="text-gray-400 text-sm">
                        点击上方按钮开始渲染 Granule 列表
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 右下: Native React 渲染示例 */}
              <div>
                {showNativeReact ? (
                  <ReactNativeScope
                    ref={nativeReactRef}
                    data={nativeReactData}
                    onPerformanceUpdate={handleNativeReactPerformanceUpdate}
                  />
                ) : (
                  <div className="bg-gray-800 rounded-lg border-2 border-dashed border-gray-600">
                    <div className="px-6 py-4 bg-gray-750 border-b border-gray-700">
                      <h2 className="text-lg font-semibold text-white">
                        Native React 列表
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">等待渲染...</p>
                    </div>
                    <div className="p-12 text-center">
                      <div className="text-gray-500 text-lg mb-2">⚛️</div>
                      <p className="text-gray-400 text-sm">
                        点击上方按钮开始渲染 Native React 列表
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ContentCard>
      </div>
    </PageLayout>
  );
}
