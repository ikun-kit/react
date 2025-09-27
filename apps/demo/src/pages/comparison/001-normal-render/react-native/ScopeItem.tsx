import { useMount } from 'react-use';

import { ReactNativeItemState } from './types';

export interface ReactNativeScopeItemProps {
  id: string;
  state: ReactNativeItemState;
  onMount: (id: string) => void;
}

export function ReactNativeScopeItem({
  id,
  state,
  onMount,
}: ReactNativeScopeItemProps) {
  useMount(() => {
    onMount(id);
  });

  return (
    <div className="p-4 bg-gray-700 rounded-md border border-gray-600 mb-3 hover:bg-gray-650 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h4 className="flex flex-col gap-1">
          <div className="flex gap-1">
            <span className="[width:40px] text-xs text-right text-gray-400">
              name:
            </span>
            <span className="text-xs text-white">{state.name}</span>
          </div>
          <div className="flex gap-1">
            <span className="[width:40px] text-xs text-right text-gray-400">
              id:
            </span>
            <span className="text-xs text-white">{id}</span>
          </div>
        </h4>
        <span className="text-sm text-gray-400 font-mono">{state.value}</span>
      </div>
    </div>
  );
}
