import { useRef, useState } from 'react';

import {
  BackNav,
  ContentCard,
  PageHeader,
  PageLayout,
} from '../../../components';
import { ControlPanel } from './components/ControlPanel';
import {
  GranuleExample,
  GranuleExampleAPI,
  PerformanceMetrics as GranuleMetrics,
} from './components/GranuleExample';
import {
  PerformanceMetrics as NativeMetrics,
  NativeReactExample,
  NativeReactExampleAPI,
} from './components/NativeReactExample';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { create001DefaultData } from './pipeline/default-data';

export function NormalRenderComparison() {
  // 获取初始数据
  const initialData = create001DefaultData();

  // 转换数据格式给 NativeReact 使用
  const nativeReactData = initialData.map(item => ({
    id: item.id,
    state: item.state,
  }));

  // 组件引用
  const granuleRef = useRef<GranuleExampleAPI>(null);
  const nativeReactRef = useRef<NativeReactExampleAPI>(null);

  // 性能数据状态
  const [granuleMetrics, setGranuleMetrics] = useState<GranuleMetrics | null>(
    null,
  );
  const [nativeReactMetrics, setNativeReactMetrics] =
    useState<NativeMetrics | null>(null);

  return (
    <PageLayout>
      <div className="space-y-6">
        <PageHeader
          backNav={<BackNav to="/comparison">返回对比列表</BackNav>}
          title="正常渲染性能对比"
          subtitle="Granule vs Native React 渲染性能实时对比"
        />

        <ContentCard className="p-6">
          {/* 四块布局容器 */}
          <div className="grid grid-cols-2 gap-6 h-[calc(100vh-280px)]">
            {/* 左上: 控制操作面板 */}
            <div className="flex flex-col">
              <ControlPanel
                granuleRef={granuleRef}
                nativeReactRef={nativeReactRef}
              />
            </div>

            {/* 右上: 性能监控信息 */}
            <div className="flex flex-col">
              <div className="bg-gray-800 rounded-lg p-6 h-full overflow-auto">
                <h2 className="text-lg font-semibold text-white mb-6">
                  性能监控
                </h2>
                <PerformanceMonitor
                  granuleMetrics={granuleMetrics}
                  nativeReactMetrics={nativeReactMetrics}
                />
              </div>
            </div>

            {/* 左下: Granule 渲染示例 */}
            <div className="flex flex-col">
              <GranuleExample
                ref={granuleRef}
                initialData={initialData}
                onPerformanceUpdate={setGranuleMetrics}
              />
            </div>

            {/* 右下: Native React 渲染示例 */}
            <div className="flex flex-col">
              <NativeReactExample
                ref={nativeReactRef}
                initialData={nativeReactData}
                onPerformanceUpdate={setNativeReactMetrics}
              />
            </div>
          </div>
        </ContentCard>

        {/* 说明信息 */}
        <ContentCard className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">使用说明</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-300">操作控制</h4>
                <ul className="text-gray-400 space-y-1">
                  <li>• 使用左上角的控制面板进行各种操作</li>
                  <li>• 支持插入、删除、更新、批量操作等</li>
                  <li>• 性能测试会清空后重新渲染指定数量的项目</li>
                  <li>• 所有操作会同时应用于两个示例</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-300">性能对比</h4>
                <ul className="text-gray-400 space-y-1">
                  <li>• 右上角实时显示两种方案的性能指标</li>
                  <li>• 包含首次挂载时间、总挂载时间等关键指标</li>
                  <li>• 红色表示 Granule 较慢，绿色表示较快</li>
                  <li>• 性能差异主要来自 React Root 创建开销</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
              <h4 className="text-md font-medium text-yellow-300 mb-2">
                ⚠️ 关于性能差异
              </h4>
              <p className="text-sm text-yellow-200">
                Granule 为每个列表项目创建独立的 React
                Root，这会带来额外的初始化开销。
                但这种设计换来了更好的隔离性、可控性和灵活的 DOM 操作能力。
                在实际应用中，这种性能差异通常是可以接受的，特别是考虑到 Granule
                提供的功能优势。
              </p>
            </div>
          </div>
        </ContentCard>
      </div>
    </PageLayout>
  );
}
