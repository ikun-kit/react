import {
  type TGranuleScopeItem,
  useGranuleScope,
} from '@ikun-kit/react-granule';

import { clsx } from 'clsx';
import { useState } from 'react';

import { type BasicItemState, BasicScopeItem } from './BasicScopeItem';

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
  const { Provider, controller, domRef } = useGranuleScope<
    string,
    BasicItemState
  >(data);

  return (
    <>
      {/* Control Panel */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">操作面板</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ActionButton
            onClick={() => {
              const id = Date.now().toString();
              controller.insert(id, {
                name: '新项目 ' + id.slice(-4),
                value: Math.floor(Math.random() * 100),
              });
            }}
            variant="primary"
          >
            添加项目
          </ActionButton>

          <ActionButton
            onClick={() => {
              const allItems = controller.getState();
              if (allItems.length >= 2) {
                const firstItem = allItems[0];
                controller.move([firstItem.id]);
              }
            }}
            variant="secondary"
          >
            移动首项到末尾
          </ActionButton>

          <ActionButton
            onClick={() => {
              const allItems = controller.getState();
              if (allItems.length >= 2) {
                const lastItem = allItems[allItems.length - 1];
                const firstItem = allItems[0];
                controller.move([lastItem.id], firstItem.id);
              }
            }}
            variant="secondary"
          >
            移动末项到首位
          </ActionButton>

          <ActionButton
            onClick={() => {
              // 生成随机 HSL 颜色，确保有足够的饱和度和合适的亮度
              const hue = Math.floor(Math.random() * 360);
              const saturation = Math.floor(Math.random() * 40) + 30; // 30-70%
              const lightness = Math.floor(Math.random() * 20) + 20; // 20-40%
              const randomColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

              console.log(`new bg: ${randomColor}`);

              if (domRef.current) {
                domRef.current.style.background = randomColor;
              }
            }}
            variant="accent"
          >
            更换背景
          </ActionButton>

          <ActionButton
            onClick={() => {
              const allItems = controller.getState();
              if (allItems.length >= 3) {
                const firstThreeIds = allItems.slice(0, 3).map(item => item.id);
                console.log('批量移动前三个项目到末尾:', firstThreeIds);
                controller.move(firstThreeIds);
              }
            }}
            variant="warning"
            className="md:col-span-2"
          >
            批量移动前3项到末尾
          </ActionButton>

          <ActionButton
            onClick={() => {
              const allItems = controller.getState();
              if (allItems.length >= 2) {
                const lastTwoIds = allItems.slice(-2).map(item => item.id);
                const firstId = allItems[0]?.id;
                if (firstId) {
                  console.log(
                    '批量移动后两项到开头:',
                    lastTwoIds,
                    'before:',
                    firstId,
                  );
                  controller.move(lastTwoIds, firstId);
                }
              }
            }}
            variant="warning"
            className="md:col-span-2"
          >
            批量移动后2项到开头
          </ActionButton>

          <ActionButton onClick={onReload} variant="neutral">
            重新加载
          </ActionButton>
        </div>
      </div>

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

interface ActionButtonProps {
  onClick: () => void;
  variant: 'primary' | 'secondary' | 'accent' | 'warning' | 'neutral';
  className?: string;
  children: React.ReactNode;
}

function ActionButton({
  onClick,
  variant,
  className,
  children,
}: ActionButtonProps) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    accent: 'bg-purple-600 hover:bg-purple-700 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white',
    neutral: 'bg-gray-500 hover:bg-gray-600 text-white',
  };

  return (
    <button
      className={clsx(
        'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
        variants[variant],
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
