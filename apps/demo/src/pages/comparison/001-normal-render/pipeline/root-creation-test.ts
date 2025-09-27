// React Root 创建开销测试
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

export function testReactRootCreationOverhead(itemCount: number = 1000) {
  console.log(
    `🧪 Testing React Root creation overhead with ${itemCount} items`,
  );

  // 测试单个 Root + 多个组件的方案 (React Native 方案)
  console.time('Single Root + Multiple Components');
  const singleContainer = document.createElement('div');
  const singleRoot = createRoot(singleContainer);

  // 模拟渲染多个组件
  const components = Array.from({ length: itemCount }, (_, i) =>
    createElement('div', { key: i }, `Item ${i}`),
  );
  singleRoot.render(createElement('div', {}, ...components));
  console.timeEnd('Single Root + Multiple Components');

  // 测试多个 Root + 单个组件的方案 (Granule 方案)
  console.time('Multiple Roots + Single Components');
  const roots: any[] = [];

  for (let i = 0; i < itemCount; i++) {
    const container = document.createElement('div');
    const root = createRoot(container);
    roots.push(root);
    root.render(createElement('div', {}, `Item ${i}`));
  }
  console.timeEnd('Multiple Roots + Single Components');

  // 清理
  singleRoot.unmount();
  roots.forEach(root => root.unmount());

  console.log('🎯 Root creation test completed');
}
