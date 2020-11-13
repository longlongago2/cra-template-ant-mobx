import React, { lazy } from 'react';
import { Skeleton } from 'antd';
import { stringify } from 'qs';
import RouteConfig from '@/components/RouterConfig';
import Layout from '@/layout';
import NestedRoute from './NestedRoute';
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
    // layout: Layout, // 如下：同时支持添加lazy的资源加载fallback组件, 注意：layout不能lazy加载
    layout: {
      component: Layout,
      fallback: <Skeleton active round />,
    },
    children: [
      {
        path: '/',
        redirect: '/home',
        exact: true,
      },
      {
        path: '/home',
        component: lazy(() => import('./Home')),
        private: true, // 私有路由，会经过 privateHandler 中的逻辑
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
        path: '/nested-route',
        layout: {
          component: NestedRoute,
          fallback: <span>加载中...</span>,
        },
        children: [
          {
            path: '/',
            redirect: '/nested1',
            exact: true,
          },
          {
            path: '/nested1',
            component: lazy(() => import('./NestedRoute/Nested1')),
            private: true,
            meta: {
              title: 'nested1',
            },
          },
          {
            path: '/nested2',
            component: lazy(() => import('./NestedRoute/Nested2')),
            private: true,
            meta: {
              title: 'nested2',
            },
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

  const handleRouteChange = (location, action) => {
    // eslint-disable-next-line no-console
    console.log(location, action);
  };

  /**
   * @description 私有路由副作用处理程序：支持请求接口后再提交结果，全程使用generator函数，因此可取消，防止路由组件卸载后才提交结果
   * @param {*} { location, put }
   */
  function* handleEffect({ location, put }) {
    const { isAuthenticated, isPermitted, buttons } = yield new Promise((resolve) => {
      // TODO: 模拟接口返回数据，切换为您的接口请求
      setTimeout(() => {
        const { pathname } = location;
        // 模拟无访问权限路由
        if (pathname === '/nest/auth-demo' || pathname === '/nest/nested-route/nested2') {
          resolve({ isAuthenticated: true, isPermitted: false });
          return;
        }
        // 模拟正常路由，附带路由下按钮权限信息
        resolve({
          isAuthenticated: true,
          isPermitted: true,
          buttons: [
            { name: '权限按钮一', key: 'fake-1' },
            { name: '权限按钮二', key: 'fake-2' },
          ],
        });
      }, 550);
    });
    /**
     * 私有路由信息会通过 AuthorityContext 上下文传下去，请看 @/components/PrivateButton
     * isAuthenticated: 是否登录（必需）
     * isPermitted：是否有权限（必需）
     * buttons: 按钮权限集合（自定义属性）
     */
    yield put({ isAuthenticated, isPermitted, buttons });
  }

  return (
    <RouteConfig
      routes={routes}
      beforeEach={handleEach}
      privateHandler={{
        effect: handleEffect,
        // 未登录渲染组件：此处跳转，也可不跳转，自定义展示组件
        // params: {location, match, Redirect}
        noAuthentication: ({ location, Redirect }) => (
          <Redirect to={{ pathname: '/login', search: `?${stringify(location)}` }} />
        ),
        // 无权限渲染组件：同上跳转
        noPermission: ({ Redirect, match }) => {
          const { path } = match;
          return <Redirect to={`${path}/no-permission`} />;
        },
      }}
      onRouteChange={handleRouteChange}
    />
  );
}
