import { useGranuleScopeItem } from '@ikun-kit/react-granule';

import { useEffect } from 'react';

import { ScopeUpwardPayloadMap } from './types';

export interface GranuleItemState {
  name: string;
  value: number;
}

export interface GranuleScopeItemProps {
  id: string;
}

export function GranuleScopeItem(props: GranuleScopeItemProps) {
  const {
    state: localState,
    onMount,
    emit,
  } = useGranuleScopeItem<string, GranuleItemState, ScopeUpwardPayloadMap>(
    props.id,
  );

  useEffect(() => {
    const unsubscribeMount = onMount((data: GranuleItemState) => {
      emit('mounted', props.id);
      console.log('项目已挂载:', data);
    });

    return () => {
      unsubscribeMount();
    };
  }, [onMount]);

  return (
    <div className="p-4 bg-gray-700 rounded-md border border-gray-600 mb-3 hover:bg-gray-650 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h4 className="flex flex-col gap-1">
          <div className="flex gap-1">
            <span className="[width:40px] text-xs text-right text-gray-400">
              name:
            </span>
            <span className="text-xs text-white">{localState.name}</span>
          </div>
          <div className="flex gap-1">
            <span className="[width:40px] text-xs text-right text-gray-400">
              id:
            </span>
            <span className="text-xs text-white">{props.id}</span>
          </div>
        </h4>
        <span className="text-sm text-gray-400 font-mono">
          {localState.value}
        </span>
      </div>
    </div>
  );
}
