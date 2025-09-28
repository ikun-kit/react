import {
  type TGranuleScopeItem,
  perf,
  useGranuleScope,
} from '@ikun-kit/react-granule';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { GranuleScopeAPI, PerformanceMetrics } from '../types';
import { type GranuleItemState, GranuleScopeItem } from './ScopeItem';
import { ScopeUpwardPayloadMap } from './types';

function ItemContainer(props: { id: string }) {
  return <GranuleScopeItem {...props} />;
}

ItemContainer.createElement = (_: GranuleItemState) => {
  const element = window.document.createElement('div');
  return element;
};

interface GranuleScopeProps {
  data: Array<TGranuleScopeItem<string, GranuleItemState>>;
  onPerformanceUpdate?: (metrics: PerformanceMetrics) => void;
}

export const GranuleScope = forwardRef<GranuleScopeAPI, GranuleScopeProps>(
  ({ data, onPerformanceUpdate }, ref) => {
    // 组件开始渲染就立即计时
    perf.point('GranuleScope Total');
    perf.point('GranuleScope First Mount');

    const [scopeData, setScopeData] = useState(data);
    const { Provider, controller, upwardSubscriber } = useGranuleScope<
      string,
      GranuleItemState,
      ScopeUpwardPayloadMap
    >(scopeData);

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

    useEffect(() => {
      // 重置状态，避免热更新时累积旧数据
      mountedItems.current.clear();
      firstMountTime.current = null;

      const unsubscribeMount = upwardSubscriber.on('mounted', itemId => {
        if (mountedItems.current.size === 0) {
          const firstTime = perf.span('GranuleScope First Mount');
          firstMountTime.current = firstTime;
          performanceMetrics.current.firstMountTime = firstTime;
        }

        if (!mountedItems.current.has(itemId)) {
          mountedItems.current.add(itemId);
        }

        updatePerformanceMetrics();

        // 每2000个item记录进度
        if (mountedItems.current.size % 2000 === 0) {
          console.log(
            `🎯 [Mount Progress] ${mountedItems.current.size}/${scopeData.length} items mounted`,
          );
        }

        if (mountedItems.current.size >= controller.getState().length) {
          const totalTime = perf.span('GranuleScope Total', {
            totalItems: mountedItems.current.size,
          });
          // 使用 perf.span 返回的真实时长
          performanceMetrics.current.totalMountTime = totalTime;
          performanceMetrics.current.averageMountTime =
            totalTime / scopeData.length;
          console.log('All Granule items mounted');
        }
      });

      return () => {
        unsubscribeMount();
      };
    }, [scopeData, upwardSubscriber, controller, onPerformanceUpdate]);

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
      perf.point('GranuleScope Total');
      perf.point('GranuleScope First Mount');
      updatePerformanceMetrics();
    };

    // 暴露 API 方法
    useImperativeHandle(
      ref,
      () => ({
        resetData: () => {
          // 先清空
          const currentState = controller.getState();
          currentState.forEach(item => controller.delete(item.id));

          // 重新插入初始数据
          data.forEach(item => {
            controller.insert(item.id, item.state);
          });
          setScopeData([...controller.getState()]);
          resetPerformanceData();
        },

        getPerformanceMetrics: () => performanceMetrics.current,
      }),
      [controller, data],
    );

    return (
      <>
        {/* Items Container */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-750 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Granule 列表</h2>
            <p className="text-sm text-gray-400 mt-1">
              使用 Granule 状态管理系统 ({scopeData.length} 项)
            </p>
          </div>
          <Provider style={{ background: '#1f2937' }} className="p-6">
            {ItemContainer}
          </Provider>
        </div>
      </>
    );
  },
);

GranuleScope.displayName = 'GranuleScope';
