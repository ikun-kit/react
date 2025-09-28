export interface ControlPanelProps {
  onRenderGranule: () => void;
  onRenderNativeReact: () => void;
  onReset: () => void;
  showGranule: boolean;
  showNativeReact: boolean;
}

export function ControlPanel({
  onRenderGranule,
  onRenderNativeReact,
  onReset,
  showGranule,
  showNativeReact,
}: ControlPanelProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-6">渲染控制</h2>

      <div className="space-y-4">
        <p className="text-gray-400 text-sm">
          点击按钮分别渲染对应的列表示例，观察渲染性能差异
        </p>

        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={onRenderGranule}
            disabled={showGranule}
            className={`px-6 py-4 text-white rounded-lg text-base font-medium transition-colors flex items-center justify-center gap-2 ${
              showGranule
                ? 'bg-blue-800 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            <span>📝</span>
            {showGranule ? '已渲染 Granule' : '渲染 Granule 列表'}
          </button>

          <button
            onClick={onRenderNativeReact}
            disabled={showNativeReact}
            className={`px-6 py-4 text-white rounded-lg text-base font-medium transition-colors flex items-center justify-center gap-2 ${
              showNativeReact
                ? 'bg-green-800 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            <span>⚛️</span>
            {showNativeReact ? '已渲染 React' : '渲染 Native React 列表'}
          </button>

          <button
            onClick={onReset}
            disabled={!showGranule && !showNativeReact}
            className={`px-6 py-4 text-white rounded-lg text-base font-medium transition-colors flex items-center justify-center gap-2 ${
              !showGranule && !showNativeReact
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500'
            }`}
          >
            <span>🔄</span>
            重置测试
          </button>
        </div>

        <div className="mt-6 p-3 bg-gray-700 rounded-lg">
          <p className="text-gray-300 text-xs">
            💡 点击渲染按钮测试性能，使用重置按钮清空结果重新测试
          </p>
        </div>
      </div>
    </div>
  );
}
