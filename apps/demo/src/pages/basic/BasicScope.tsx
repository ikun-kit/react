import {
  type TGranuleScopeItem,
  useGranuleScope,
} from '@ikun-kit/react-granule';

import { useEffect, useState } from 'react';

import { type BasicItemState, BasicScopeItem } from './BasicScopeItem';
import { ControlPanel } from './ControlPanel';
import { BasicScopeUpwardPayloadMap } from './types';

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

// 事件日志条目类型
interface EventLogEntry {
  id: string;
  timestamp: number;
  itemId: string;
  eventName: string;
  payload: any;
  message: string;
}

export function BasicScope({ data, onReload }: BasicScopeProps) {
  const { Provider, controller, domRef, getItemRef, upwardSubscriber } =
    useGranuleScope<string, BasicItemState, BasicScopeUpwardPayloadMap>(data);

  const [eventLogs, setEventLogs] = useState<EventLogEntry[]>([]);

  // 添加事件日志
  const addEventLog = (
    itemId: string,
    eventName: string,
    payload: any,
    message: string,
  ) => {
    const newLog: EventLogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      itemId,
      eventName,
      payload,
      message,
    };
    setEventLogs(prev => [newLog, ...prev.slice(0, 9)]); // 只保留最新的10条
  };

  // 监听向上通信事件
  useEffect(() => {
    // 监听值变化事件
    const unsubscribeValueChanged = upwardSubscriber.on(
      'value-changed',
      (itemId, payload) => {
        const itemState = controller.getItem(itemId);
        addEventLog(
          itemId,
          'value-changed',
          payload,
          `${itemState?.state.name || itemId} 的值从 ${payload.oldValue} 变为 ${payload.newValue}`,
        );
      },
    );

    return () => {
      unsubscribeValueChanged();
    };
  }, [upwardSubscriber, controller]);

  return (
    <>
      <ControlPanel
        controller={controller}
        domRef={domRef}
        getItemRef={getItemRef}
        onReload={onReload}
      />

      {/* 主要内容区域：左右布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：项目列表 */}
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

        {/* 右侧：向上通信事件日志 */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-750 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">
              向上通信事件日志
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              实时显示子组件发送的向上通信事件
            </p>
          </div>
          <div className="p-6">
            {eventLogs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                暂无事件，试试点击项目中的 +1 / -1 按钮吧！
              </div>
            ) : (
              <div className="space-y-2">
                {eventLogs.map(log => (
                  <div
                    key={log.id}
                    className="bg-gray-700 rounded-md p-3 border border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400 text-sm font-mono">
                          {log.eventName}
                        </span>
                        <span className="text-gray-400 text-xs">
                          来自: {log.itemId}
                        </span>
                      </div>
                      <span className="text-gray-500 text-xs">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-white text-sm">{log.message}</p>
                    <details className="mt-2">
                      <summary className="text-gray-400 text-xs cursor-pointer hover:text-gray-300">
                        查看载荷数据
                      </summary>
                      <pre className="mt-1 text-xs bg-gray-800 p-2 rounded text-green-400 overflow-x-auto">
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
