import React, { lazy } from 'react';
import RouteConfig from '@/components/RouterConfig';
import Layout from '@/layout';
import NoMatch from './NoMatch';
import NoPermission from './NoPermission';

const routes = [
  {
    path: '/',
    redirect: '/nest',
    exact: true,
  },
  {
    path: '/nest',
    layout: Layout,
    children: [
      {
        path: '/',
        redirect: '/home',
        exact: true,
      },
      {
        path: '/home',
        component: lazy(() => import('./Home')),
        private: true, // 私有路由，会经过 PrivateRoute.js 中的拦截并判断逻辑
        meta: {
          title: 'home', // 附加信息，可随意定义内部属性
        },
      },
      {
        path: '/about',
        component: lazy(() => import('./About')),
        private: true,
        meta: {
          title: 'about',
        },
      },
      {
        path: '/auth-demo',
        component: lazy(() => import('./AuthDemo')),
        private: true,
      },
      {
        path: '/no-permission',
        component: NoPermission,
      },
      {
        path: '*',
        component: NoMatch,
      },
    ],
  },
  {
    path: '/login',
    component: lazy(() => import('./Login')),
    meta: {
      title: 'login',
    },
  },
  {
    path: '*',
    component: NoMatch,
  },
];

export default function Router() {
  const handleEach = (location, next) => {
    const { meta = {} } = location;
    document.title = `react-app${meta.title ? ` - ${meta.title}` : ''}`;
    return next();
    // TODO: return next(meta); // 可以将 meta 信息作为 props 传到 route component里接收
  };

  return <RouteConfig routes={routes} beforeEach={handleEach} />;
}
