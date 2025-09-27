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
  const { Provider, controller, upwardSubscriber } = useGranuleScope<
    string,
    GranuleItemState,
    ScopeUpwardPayloadMap
  >(data);

  console.time('ScopeRoot');

  const mountedItems = useRef<string[]>([]);

  useEffect(() => {
    const unsubscribeMount = upwardSubscriber.on('mounted', itemId => {
      if (!mountedItems.current.includes(itemId)) {
        mountedItems.current.push(itemId);
      }
      if (mountedItems.current.length >= controller.getState().length) {
        console.timeEnd('ScopeRoot');
        // TODO: 标记完成所有节点挂载
        console.log('All items mounted');
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
