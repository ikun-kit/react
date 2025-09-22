import { type TGranuleScopeItem } from '@ikun-kit/react-granule';

import { useState } from 'react';
import { Link } from 'react-router-dom';

import { BasicScope } from './BasicScope';
import { type BasicItemState } from './BasicScopeItem';

const createInitializeData = (): Array<
  TGranuleScopeItem<string, BasicItemState>
> => [
  { id: '001', state: { name: 'Alice', value: 42 } },
  { id: '002', state: { name: 'Bob', value: 73 } },
  { id: '003', state: { name: 'Charlie', value: 18 } },
];

export function BasicDemo() {
  const [data, setData] = useState(createInitializeData());

  const reload = () => {
    setData([...createInitializeData()]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to="/"
              className="text-blue-400 hover:text-blue-300 text-sm mb-2 block"
            >
              ← 返回首页
            </Link>
            <h1 className="text-2xl font-bold text-white">基础功能演示</h1>
            <p className="text-gray-400 text-sm mt-1">
              演示 Granule 的核心状态管理和项目操作功能
            </p>
          </div>
        </div>

        <BasicScope data={data} onReload={reload} />
      </div>
    </div>
  );
}
