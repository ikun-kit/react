import {
  TGranuleScopeItemImperative,
  useGranuleScopeItem,
} from '@ikun-kit/react-granule';

import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { useMount, useUnmount } from 'react-use';

import type { BasicScopeUpwardPayloadMap } from './types';

export interface BasicItemState {
  name: string;
  value: number;
}

/**
 * BasicScopeItem 的 imperative API 接口
 */
export interface BasicItemImperativeAPI extends TGranuleScopeItemImperative {
  getCurrentState(): BasicItemState;
  getItemInfo(): {
    id: string;
    state: BasicItemState;
    timestamp: number;
  };
}

export interface BasicScopeItemProps {
  id: string;
}

export function BasicScopeItem(props: BasicScopeItemProps) {
  const item = useGranuleScopeItem<
    string,
    BasicItemState,
    BasicScopeUpwardPayloadMap
  >(props.id);
  const [localState, setLocalState] = useState(
    item?.state || { name: '', value: 0 },
  );

  useEffect(() => {
    if (item) {
      setLocalState(item.state);
    }
  }, [item]);

  // 暴露 imperative API，提供获取当前 state 的能力
  useEffect(() => {
    if (!item) return;

    const api: BasicItemImperativeAPI = {
      getCurrentState: (): BasicItemState => localState,
      getItemInfo: () => ({
        id: props.id,
        state: localState,
        timestamp: Date.now(),
      }),
    };

    item.registerImperative(api);
  }, [item, localState, props.id]);

  useMount(() => {
    console.log(`Item 已挂载, id: ${props.id}`);
  });

  useUnmount(() => {
    console.log(`Item 已卸载, id: ${props.id}`);
  });

  useEffect(() => {
    console.log(`Item 渲染, id: ${props.id}`);

    const unsubscribeUpdate = item.onUpdate((newState: BasicItemState) => {
      console.log('Item 已更新:', newState);
      setLocalState(newState);
    });

    return () => {
      unsubscribeUpdate();
    };
  }, [item]);

  if (!item) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-700 rounded-md">
        <span className="text-red-400 text-sm">项目未找到</span>
      </div>
    );
  }

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

      <div className="space-y-3">
        {/* Name Input */}
        <div>
          <input
            value={localState.name}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="输入项目名称"
            onChange={e => {
              item.update({
                ...localState,
                name: e.target.value,
              });
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <ActionButton
            onClick={() => {
              const newValue = localState.value + 1;
              item.update({
                ...localState,
                value: newValue,
              });

              // 发射向上事件：值发生变化
              item.emit('value-changed', {
                itemId: props.id,
                itemName: localState.name,
                oldValue: localState.value,
                newValue: newValue,
              });
            }}
            variant="success"
            size="sm"
          >
            +1
          </ActionButton>

          <ActionButton
            onClick={() => {
              const newValue = Math.max(0, localState.value - 1);
              item.update({
                ...localState,
                value: newValue,
              });

              // 发射向上事件：值发生变化
              item.emit('value-changed', {
                itemId: props.id,
                itemName: localState.name,
                oldValue: localState.value,
                newValue: newValue,
              });
            }}
            variant="danger"
            size="sm"
          >
            -1
          </ActionButton>

          <ActionButton
            onClick={() => {
              const newId = Date.now().toString();
              item.insert(
                newId,
                {
                  name: '插入项目 ' + newId.slice(-4),
                  value: Math.floor(Math.random() * 50),
                },
                props.id,
              );
            }}
            variant="secondary"
            size="sm"
          >
            前插
          </ActionButton>

          <ActionButton
            onClick={() => {
              item.move();
            }}
            variant="info"
            size="sm"
          >
            移到末尾
          </ActionButton>

          <ActionButton
            onClick={() => {
              const allItems = item.getState();
              const firstItem = allItems[0];
              if (firstItem && firstItem.id !== props.id) {
                item.move(firstItem.id);
              }
            }}
            variant="info"
            size="sm"
          >
            移到首位
          </ActionButton>

          <ActionButton
            onClick={() => item.delete()}
            variant="danger"
            size="sm"
          >
            删除
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

interface ActionButtonProps {
  onClick: () => void;
  variant: 'success' | 'danger' | 'secondary' | 'info';
  size: 'sm';
  children: React.ReactNode;
}

function ActionButton({ onClick, variant, size, children }: ActionButtonProps) {
  const variants = {
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
  };

  return (
    <button
      className={clsx(
        'rounded font-medium transition-colors duration-200',
        variants[variant],
        sizes[size],
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
