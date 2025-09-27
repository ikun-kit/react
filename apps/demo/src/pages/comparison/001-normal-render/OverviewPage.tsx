import { testReactRootCreationOverhead } from './pipeline/root-creation-test';

export function OverviewPage() {
  const runRootCreationTest = () => {
    testReactRootCreationOverhead(1000);
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-white mb-4">渲染性能对比概览</h3>
      <p className="text-gray-400">
        这里将展示 React 原生状态管理与 Granule 在正常渲染场景下的性能对比。
      </p>

      <div className="mt-6 p-4 bg-gray-700 rounded-lg">
        <h4 className="text-md font-medium text-white mb-2">测试说明</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• 测试数据量：1000 个项目</li>
          <li>• 测试指标：从开始渲染到所有项目挂载完成的时间</li>
          <li>• React 原生：使用 useState + useContext 模式</li>
          <li>• Granule：使用 granule 状态管理系统</li>
        </ul>
      </div>

      <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
        <h4 className="text-md font-medium text-yellow-300 mb-2">
          ⚠️ 性能瓶颈分析
        </h4>
        <p className="text-sm text-yellow-200 mb-3">
          主要性能差异来自于 React Root 创建开销：
        </p>
        <ul className="text-sm text-yellow-200 space-y-1 mb-3">
          <li>
            • <strong>React 原生</strong>：1个 Root + 1000个组件
          </li>
          <li>
            • <strong>Granule</strong>：1000个 Root + 1000个组件
          </li>
        </ul>
        <button
          onClick={runRootCreationTest}
          className="px-3 py-1 text-xs bg-yellow-600 hover:bg-yellow-500 text-white rounded transition-colors"
        >
          运行 Root 创建开销测试
        </button>
        <p className="text-xs text-yellow-200 mt-2">
          ↑ 点击查看控制台输出，对比两种方案的性能差异
        </p>
      </div>
    </div>
  );
}
