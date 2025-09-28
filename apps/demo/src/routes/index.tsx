import { RouteObject } from 'react-router-dom';

import { AdvancedDemo } from '../pages/advanced';
import { BasicDemo } from '../pages/basic';
import { ComparisonDemo } from '../pages/comparison';
import { NormalRenderComparison } from '../pages/comparison/001-normal-render';
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
        element: <NormalRenderComparison />,
      },
    ],
  },
];
