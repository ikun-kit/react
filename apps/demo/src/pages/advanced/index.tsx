import { Link } from 'react-router-dom';

export function AdvancedDemo() {
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
            <h1 className="text-2xl font-bold text-white">高级功能演示</h1>
            <p className="text-gray-400 text-sm mt-1">
              敬请期待：批量操作、复杂状态管理、性能优化等高级特性
            </p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
          <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-2xl font-bold text-white">!</div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">开发中</h2>
          <p className="text-gray-400">
            这个页面正在开发中，将展示 Granule 的高级功能特性
          </p>
        </div>
      </div>
    </div>
  );
}
