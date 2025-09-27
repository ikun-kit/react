import { Outlet } from 'react-router-dom';

import {
  BackNav,
  ContentCard,
  PageHeader,
  PageLayout,
  TabNav,
} from '../../../components';

export function NormalRenderLayout() {
  const tabs = [
    { path: '/comparison/001-normal-render', label: '概览' },
    { path: '/comparison/001-normal-render/react-native', label: 'React 原生' },
    { path: '/comparison/001-normal-render/granule', label: 'Granule' },
  ];

  return (
    <PageLayout>
      <div className="space-y-6">
        <PageHeader
          backNav={<BackNav to="/comparison">返回对比列表</BackNav>}
          title="正常渲染对比"
        />

        <ContentCard>
          <TabNav tabs={tabs} />
          <Outlet />
        </ContentCard>
      </div>
    </PageLayout>
  );
}
