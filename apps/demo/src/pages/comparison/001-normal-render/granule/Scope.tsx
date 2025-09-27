import {
  type TGranuleScopeItem,
  useGranuleScope,
} from '@ikun-kit/react-granule';

import { useEffect, useRef } from 'react';

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
}

export function GranuleScope({ data }: GranuleScopeProps) {
  const startTimeRef = useRef<number>(performance.now());

  const { Provider, controller, upwardSubscriber } = useGranuleScope<
    string,
    GranuleItemState,
    ScopeUpwardPayloadMap
  >(data);

  const mountedItems = useRef<string[]>([]);

  useEffect(() => {
    let firstMountTime: number;
    let lastProgressLog = performance.now();

    const unsubscribeMount = upwardSubscriber.on('mounted', itemId => {
      const mountTime = performance.now();

      if (mountedItems.current.length === 0) {
        firstMountTime = mountTime;
        console.log(
          `🎯 [First Item Mount] ${(mountTime - startTimeRef.current).toFixed(2)}ms after start`,
        );
      }

      if (!mountedItems.current.includes(itemId)) {
        mountedItems.current.push(itemId);
      }

      // 每1000个item记录进度
      if (mountedItems.current.length % 2000 === 0) {
        const progressTime = mountTime - lastProgressLog;
        console.log(
          `🎯 [Mount Progress] ${mountedItems.current.length}/${data.length} items, Last 2000: ${progressTime.toFixed(2)}ms`,
        );
        lastProgressLog = mountTime;
      }

      if (mountedItems.current.length >= controller.getState().length) {
        const totalDuration = performance.now() - startTimeRef.current;
        const renderingPhase = mountTime - firstMountTime;
        console.log(
          `🎯 [GranuleScope] Duration: ${totalDuration.toFixed(2)}ms (Rendering Phase: ${renderingPhase.toFixed(2)}ms)`,
        );
        console.log('All Granule items mounted');
      }
    });

    return () => {
      unsubscribeMount();
    };
  });

  // TODO: 缺少向下暴露通信接口

  return (
    <>
      {/* Items Container */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-750 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">项目列表</h2>
          <p className="text-sm text-gray-400 mt-1">
            管理你的 granule scope 项目
          </p>
        </div>
        <Provider style={{ background: '#1f2937' }} className="p-6 min-h-32">
          {ItemContainer}
        </Provider>
      </div>
    </>
  );
}
