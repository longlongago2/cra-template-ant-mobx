/* eslint-disable react/prop-types */
import { useMemo, useCallback, lazy } from 'react';
import { Skeleton } from 'antd';
import { stringify } from 'qs';
import Layout from '@/layout';
import RouterConfig from '@/components/RouterConfig';
import NoMatch from './NoMatch';

const website = process.env.REACT_APP_WEBSITE_NAME;

export default function View() {
  function* handler({ location, put }) {
    const { loggedIn, permission, buttons } = yield new Promise((resolve) => {
      // TODO: 模拟接口返回数据，切换为您的接口请求
      setTimeout(() => {
        const { pathname } = location;
        // 模拟无访问权限路由
        if (pathname === '/nest/setting') {
          resolve({ loggedIn: true, permission: false });
          return;
        }
        // 模拟正常路由，附带路由下按钮权限信息
        resolve({
          loggedIn: true,
          permission: true,
          buttons: [
            { name: '权限按钮一', key: 'fake-1' },
            { name: '权限按钮二', key: 'fake-2' },
          ],
        });
      }, 850);
    });
    /**
     * 私有路由信息会通过 AuthorityContext 上下文传下去，请看 @/components/PrivateButton
     * loggedIn: 是否登录（必需）
     * permission：是否有权限（必需）
     * buttons: 按钮权限集合（自定义属性）
     */
    yield put({ loggedIn, permission, buttons });
  }

  const handleEffect = useCallback(handler, []);

  const routes = useMemo(
    () => [
      {
        path: '/',
        redirect: '/nest',
        exact: true,
      },
      {
        path: '/nest',
        layout: {
          component: Layout, // Container
          fallback: <Skeleton active round />, // Suspense lazy loading indicator
          // props: ({ pathname }) => ({ nativeContent: pathname === '/nest/home' }), // e.g. use native Content
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
            meta: {
              title: '首页',
            },
          },
          {
            path: '/setting',
            component: lazy(() => import('./Setting')),
            private: true, // 私有路由：通过 privateHandler 处理
            meta: {
              title: '设置',
            },
          },
          {
            path: '/no-auth',
            component: lazy(() => import('./NoAuth')),
            meta: {
              title: '页面无权限',
            },
          },
          {
            path: '*',
            component: NoMatch,
            meta: {
              title: '页面未找到',
            },
          },
        ],
      },
      {
        path: '*',
        component: NoMatch,
        meta: {
          title: '页面未找到',
        },
      },
    ],
    []
  );

  const privateHandler = useMemo(
    () => ({
      effect: handleEffect,
      // 未登录渲染组件 params: {location, match, Redirect}
      noLoggedIn: ({ location, Redirect }) => (
        <Redirect to={{ pathname: '/login', search: `?${stringify(location)}` }} />
      ),
      // 无权限渲染组件 params: {location, match, Redirect}
      noPermission: ({ Redirect, match }) => {
        const { path } = match;
        return <Redirect to={`${path}/no-auth`} />;
      },
    }),
    [handleEffect]
  );

  const handleEach = useCallback((location, next) => {
    const { meta = {} } = location;
    document.title = `${website}${meta.title ? ` - ${meta.title}` : ''}`;
    return next();
  }, []);

  return <RouterConfig routes={routes} beforeEach={handleEach} privateHandler={privateHandler} />;
}
