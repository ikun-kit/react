import {
  type TGranuleScopeItem,
  useGranuleScope,
} from '@ikun-kit/react-granule';

import { type BasicItemState, BasicScopeItem } from './BasicScopeItem';
import { ControlPanel } from './ControlPanel';

function ItemContainer(props: { id: string }) {
  return <BasicScopeItem {...props} />;
}

ItemContainer.createElement = (_: BasicItemState) => {
  const element = window.document.createElement('div');
  return element;
};

interface BasicScopeProps {
  data: Array<TGranuleScopeItem<string, BasicItemState>>;
  onReload: () => void;
}

export function BasicScope({ data, onReload }: BasicScopeProps) {
  const { Provider, controller, domRef, getItemRef } = useGranuleScope<
    string,
    BasicItemState
  >(data);

  return (
    <>
      <ControlPanel
        controller={controller}
        domRef={domRef}
        getItemRef={getItemRef}
        onReload={onReload}
      />

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
