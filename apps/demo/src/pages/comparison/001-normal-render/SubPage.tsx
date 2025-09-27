import { useLocation } from 'react-router-dom';

import {
  BackNav,
  ContentCard,
  PageHeader,
  PageLayout,
  TabNav,
} from '../../../components';
import { GranuleScope } from './granule/Scope';
import { create001DefaultData } from './pipeline/default-data';

export const SubPageNormalRender = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const tabs = [
    { path: '/comparison/001-normal-render', label: '概览' },
    { path: '/comparison/001-normal-render/react-native', label: 'React 原生' },
    { path: '/comparison/001-normal-render/granule', label: 'Granule' },
  ];

  const renderContent = () => {
    if (pathname === '/comparison/001-normal-render') {
      return (
        <div>
          <h3 className="text-lg font-medium text-white mb-4">
            渲染性能对比概览
          </h3>
          <p className="text-gray-400">
            这里将展示 React 原生状态管理与 Granule 在正常渲染场景下的性能对比。
          </p>
        </div>
      );
    }

    if (pathname === '/comparison/001-normal-render/react-native') {
      return (
        <div>
          <h3 className="text-lg font-medium text-white mb-4">
            React 原生实现
          </h3>
          <p className="text-gray-400">
            使用 useState 和 useContext 的原生 React 实现示例。
          </p>
        </div>
      );
    }

    if (pathname === '/comparison/001-normal-render/granule') {
      return <GranuleScope data={create001DefaultData()} />;
    }

    return null;
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <PageHeader
          backNav={<BackNav to="/comparison">返回对比列表</BackNav>}
          title="正常渲染对比"
        />

        <ContentCard>
          <TabNav tabs={tabs} />
          {renderContent()}
        </ContentCard>
      </div>
    </PageLayout>
  );
};
