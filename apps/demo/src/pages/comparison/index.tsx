import { Outlet, useLocation } from 'react-router-dom';

import {
  BackNav,
  ContentCard,
  LinkCard,
  PageHeader,
  PageLayout,
} from '../../components';

export function ComparisonDemo() {
  const location = useLocation();
  const isIndexPage = location.pathname === '/comparison';

  if (!isIndexPage) {
    return <Outlet />;
  }

  return (
    <PageLayout>
      <PageHeader
        backNav={<BackNav to="/">返回首页</BackNav>}
        title="React 原生对比"
        subtitle="敬请期待：Granule 与 React 原生状态管理的性能和代码复杂度对比"
      />

      <ContentCard className="p-8 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="text-2xl font-bold text-white">=</div>
        </div>
        <h2 className="text-xl font-semibold text-white mb-6">选择对比示例</h2>

        <div className="grid gap-4 max-w-2xl mx-auto">
          <LinkCard
            to="001-normal-render"
            title="001 - 正常渲染对比"
            description="对比 React 原生 vs Granule 在正常渲染场景下的性能表现"
          />
          <LinkCard
            to="002-large-list"
            title="002 - 大列表渲染对比"
            description="对比在大量数据列表渲染时的性能差异 (即将推出)"
            disabled
          />
          <LinkCard
            to="003-complex-state"
            title="003 - 复杂状态管理对比"
            description="深层嵌套状态和复杂状态更新的性能对比 (即将推出)"
            disabled
          />
        </div>
      </ContentCard>
    </PageLayout>
  );
}
