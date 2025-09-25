import {
  TGranuleScopeController,
  TGranuleScopeItemImperative,
  TGranuleScopeItemRef,
} from '@ikun-kit/react-granule';

import { clsx } from 'clsx';
import { useState } from 'react';

import { BasicItemImperativeAPI, BasicItemState } from './BasicScopeItem';

interface ControlPanelProps {
  controller: TGranuleScopeController<string, BasicItemState>;
  domRef: React.RefObject<HTMLDivElement>;
  getItemRef: <
    T extends TGranuleScopeItemImperative = TGranuleScopeItemImperative,
  >(
    id: string,
  ) => TGranuleScopeItemRef<T> | null;
  onReload: () => void;
}

export function ControlPanel({
  controller,
  domRef,
  getItemRef,
  onReload,
}: ControlPanelProps) {
  const [moveIds, setMoveIds] = useState('');
  const [moveTarget, setMoveTarget] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');

  const handleMove = () => {
    if (!moveIds.trim()) return;

    // 解析输入的 IDs (支持逗号或空格分隔)
    const ids = moveIds.split(/[,\s]+/).filter(id => id.trim());
    const target = moveTarget.trim() || undefined;

    if (ids.length > 0) {
      console.log('移动项目:', ids, '到:', target || '末尾');
      controller.move(ids, target);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h2 className="text-base font-semibold text-white mb-3">操作面板</h2>

      {/* 使用 Grid 布局，每行两块 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* 基础操作块 */}
        <div className="bg-gray-700/60 rounded-md p-3">
          <h3 className="text-sm font-medium text-gray-300 mb-2">基础操作</h3>
          <div className="flex gap-2 flex-wrap">
            <ActionButton
              onClick={() => {
                const id = Date.now().toString();
                controller.insert(id, {
                  name: '新项目 ' + id.slice(-4),
                  value: Math.floor(Math.random() * 100),
                });
              }}
              variant="primary"
              size="sm"
            >
              添加项目
            </ActionButton>

            <ActionButton onClick={onReload} variant="neutral" size="sm">
              重新加载
            </ActionButton>
          </div>
        </div>

        {/* 样式操作块 */}
        <div className="bg-gray-700/60 rounded-md p-3">
          <h3 className="text-sm font-medium text-gray-300 mb-2">样式操作</h3>
          <div className="flex gap-2 flex-wrap">
            <ActionButton
              onClick={() => {
                // 生成随机 HSL 颜色
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
              size="sm"
            >
              更换随机背景色
            </ActionButton>
          </div>
        </div>

        {/* 移动操作块 - 拆分成两块 */}
        {/* 输入式移动 */}
        <div className="bg-gray-700/60 rounded-md p-3">
          <h3 className="text-sm font-medium text-gray-300 mb-2">输入式移动</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                移动项目ID (逗号分隔)
              </label>
              <input
                type="text"
                value={moveIds}
                onChange={e => setMoveIds(e.target.value)}
                placeholder="001,002"
                className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                目标位置 (可选)
              </label>
              <input
                type="text"
                value={moveTarget}
                onChange={e => setMoveTarget(e.target.value)}
                placeholder="003 (留空移到末尾)"
                className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <ActionButton
              onClick={handleMove}
              variant="secondary"
              size="sm"
              className="w-full"
            >
              执行移动
            </ActionButton>
          </div>
        </div>

        {/* 快速移动 */}
        <div className="bg-gray-700/60 rounded-md p-3">
          <h3 className="text-sm font-medium text-gray-300 mb-2">快速移动</h3>
          <div className="space-y-2">
            <ActionButton
              onClick={() => {
                const allItems = controller.getState();
                if (allItems.length >= 2) {
                  const firstItem = allItems[0];
                  controller.move([firstItem.id]);
                }
              }}
              variant="secondary"
              size="sm"
              className="w-full"
            >
              首项移到末尾
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
              size="sm"
              className="w-full"
            >
              末项移到首位
            </ActionButton>
          </div>
        </div>

        {/* Imperative API 测试块 - 拆分成两块 */}
        {/* API 状态获取 */}
        <div className="bg-gray-700/60 rounded-md p-3">
          <h3 className="text-sm font-medium text-gray-300 mb-2">
            API 状态获取
          </h3>
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                选择项目
              </label>
              <select
                value={selectedItemId}
                onChange={e => setSelectedItemId(e.target.value)}
                className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">选择一个项目...</option>
                {controller.getState().map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.state.name || `项目 ${item.id}`}
                  </option>
                ))}
              </select>
            </div>
            <ActionButton
              onClick={() => {
                if (!selectedItemId) {
                  console.info('请先选择一个项目');
                  return;
                }

                const itemRef =
                  getItemRef<BasicItemImperativeAPI>(selectedItemId);
                if (itemRef?.imperative) {
                  const state = itemRef.imperative.getCurrentState();
                  const info = itemRef.imperative.getItemInfo();

                  console.log('获取到的 state:', state);
                  console.log('获取到的 info:', info);

                  console.info(
                    `项目信息:\nID: ${info.id}\n名称: ${state.name}\n值: ${state.value}\n时间戳: ${new Date(info.timestamp).toLocaleTimeString()}`,
                  );
                } else {
                  console.info('项目未找到或未注册 imperative API');
                }
              }}
              variant="accent"
              size="sm"
              className="w-full"
            >
              获取项目状态
            </ActionButton>
          </div>
        </div>

        {/* DOM 操作测试 */}
        <div className="bg-gray-700/60 rounded-md p-3">
          <h3 className="text-sm font-medium text-gray-300 mb-2">
            DOM 操作测试
          </h3>
          <div className="space-y-2">
            <ActionButton
              onClick={() => {
                if (!selectedItemId) {
                  console.info('请先选择一个项目');
                  return;
                }

                const itemRef = getItemRef(selectedItemId);
                if (itemRef?.domRef?.current) {
                  const element = itemRef.domRef.current;
                  element.style.transform = 'scale(1.05)';
                  element.style.transition = 'transform 0.3s ease';
                  element.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';

                  setTimeout(() => {
                    element.style.transform = '';
                    element.style.boxShadow = '';
                  }, 1000);
                } else {
                  console.info('项目 DOM 元素未找到');
                }
              }}
              variant="secondary"
              size="sm"
              className="w-full"
            >
              高亮选中项目
            </ActionButton>

            <ActionButton
              onClick={() => {
                if (!selectedItemId) {
                  console.info('请先选择一个项目');
                  return;
                }

                const itemRef = getItemRef(selectedItemId);
                if (itemRef?.domRef?.current) {
                  itemRef.domRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  });
                } else {
                  console.info('项目 DOM 元素未找到');
                }
              }}
              variant="secondary"
              size="sm"
              className="w-full"
            >
              滚动到项目
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ActionButtonProps {
  onClick: () => void;
  variant: 'primary' | 'secondary' | 'accent' | 'warning' | 'neutral';
  className?: string;
  size?: 'sm' | 'normal';
  children: React.ReactNode;
}

function ActionButton({
  onClick,
  variant,
  className,
  size = 'normal',
  children,
}: ActionButtonProps) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    accent: 'bg-purple-600 hover:bg-purple-700 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white',
    neutral: 'bg-gray-500 hover:bg-gray-600 text-white',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    normal: 'px-3 py-2 text-sm',
  };

  return (
    <button
      className={clsx(
        'rounded-md font-medium transition-colors duration-200',
        variants[variant],
        sizes[size],
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
