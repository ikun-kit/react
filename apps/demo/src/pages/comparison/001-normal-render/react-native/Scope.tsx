import { perf } from '@ikun-kit/react-granule';

import { useRef } from 'react';

import { ReactNativeScopeItem } from './ScopeItem';
import { ReactNativeItem } from './types';

interface ReactNativeScopeProps {
  data: ReactNativeItem[];
}

export function ReactNativeScope({ data }: ReactNativeScopeProps) {
  const mountedItems = useRef<Set<string>>(new Set());
  const isTimingStarted = useRef(false);

  const handleItemMount = (id: string) => {
    if (!isTimingStarted.current) {
      perf.point('ReactNativeScope Total');
      isTimingStarted.current = true;
    }

    if (!mountedItems.current.has(id)) {
      mountedItems.current.add(id);

      // 当所有项目都挂载完成时
      if (mountedItems.current.size >= data.length) {
        perf.span('ReactNativeScope Total', {
          totalItems: mountedItems.current.size,
        });
        console.log('All React Native items mounted');
      }
    }
  };

  return (
    <>
      {/* Items Container */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-750 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">项目列表</h2>
          <p className="text-sm text-gray-400 mt-1">管理你的 React 原生项目</p>
        </div>
        <div style={{ background: '#1f2937' }} className="p-6 min-h-32">
          {data.map(item => (
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
}
