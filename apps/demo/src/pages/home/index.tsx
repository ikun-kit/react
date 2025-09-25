import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Granule React Demo
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            探索强大的 React 状态管理解决方案，支持动态组件管理和优雅的状态同步
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <DemoCard
            title="基础功能"
            description="展示 Granule 的核心功能：状态管理、项目操作、事件系统"
            path="/basic"
            isReady
          />

          <DemoCard
            title="高级功能"
            description="探索批量操作、复杂状态管理、性能优化等高级特性"
            path="/advanced"
            isReady={false}
          />

          <DemoCard
            title="React 原生对比"
            description="对比 Granule 与 React 原生状态管理的性能和代码复杂度"
            path="/comparison"
            isReady
          />
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-gray-500 text-sm">
            <span>Powered by</span>
            <span className="font-semibold text-blue-400">Granule React</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DemoCardProps {
  title: string;
  description: string;
  path: string;
  isReady: boolean;
}

function DemoCard({ title, description, path, isReady }: DemoCardProps) {
  const cardContent = (
    <div
      className={clsx(
        'p-6 rounded-lg border transition-all duration-200',
        isReady
          ? 'bg-gray-800 border-gray-700 hover:border-blue-500 hover:bg-gray-750 cursor-pointer'
          : 'bg-gray-800/50 border-gray-600 cursor-not-allowed opacity-60',
      )}
    >
      <h3 className="text-lg font-semibold mb-3 text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        {description}
      </p>
      <div className="flex justify-between items-center">
        <span
          className={clsx(
            'px-2 py-1 rounded text-xs font-medium',
            isReady
              ? 'bg-green-900 text-green-300'
              : 'bg-yellow-900 text-yellow-300',
          )}
        >
          {isReady ? '可用' : '开发中'}
        </span>
        {isReady && <span className="text-blue-400 text-sm">查看演示 →</span>}
      </div>
    </div>
  );

  return isReady ? (
    <Link to={path} className="block">
      {cardContent}
    </Link>
  ) : (
    <div>{cardContent}</div>
  );
}
