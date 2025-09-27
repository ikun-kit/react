import { RouteObject } from 'react-router-dom';

import { AdvancedDemo } from '../pages/advanced';
import { BasicDemo } from '../pages/basic';
import { ComparisonDemo } from '../pages/comparison';
import { GranulePage } from '../pages/comparison/001-normal-render/GranulePage';
import { NormalRenderLayout } from '../pages/comparison/001-normal-render/Layout';
import { OverviewPage } from '../pages/comparison/001-normal-render/OverviewPage';
import { ReactNativePage } from '../pages/comparison/001-normal-render/ReactNativePage';
import { HomePage } from '../pages/home';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/basic',
    element: <BasicDemo />,
  },
  {
    path: '/advanced',
    element: <AdvancedDemo />,
  },
  {
    path: '/comparison',
    element: <ComparisonDemo />,
    children: [
      {
        path: '001-normal-render',
        element: <NormalRenderLayout />,
        children: [
          {
            index: true,
            element: <OverviewPage />,
          },
          {
            path: 'react-native',
            element: <ReactNativePage />,
          },
          {
            path: 'granule',
            element: <GranulePage />,
          },
        ],
      },
    ],
  },
];
