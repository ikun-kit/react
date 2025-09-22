import { Link } from 'react-router-dom';

export function ComparisonDemo() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to="/"
              className="text-blue-400 hover:text-blue-300 text-sm mb-2 block"
            >
              ← 返回首页
            </Link>
            <h1 className="text-2xl font-bold text-white">React 原生对比</h1>
            <p className="text-gray-400 text-sm mt-1">
              敬请期待：Granule 与 React 原生状态管理的性能和代码复杂度对比
            </p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-2xl font-bold text-white">=</div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">开发中</h2>
          <p className="text-gray-400">
            这个页面正在开发中，将对比 Granule 与 React 原生方案的差异
          </p>
        </div>
      </div>
    </div>
  );
}
