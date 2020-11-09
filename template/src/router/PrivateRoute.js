import React, { useState, useEffect, memo } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { stringify } from 'qs';
import PropTypes from 'prop-types';
import pkg from '@/../package.json';

const publicPath = pkg.homepage;

const areEqual = (prevProps, nextProps) => prevProps.location === nextProps.location;

// 默认验证权限
const defaultAuthority = {
  isAuthenticated: true, // 是否验证登录
  isPermitted: true, // 是否有权限
};

// TODO: 按钮权限上下文
export const ButtonAuthority = React.createContext();

// 私有路由底层组件
export const NativePrivate = memo(({ location, children }) => {
  const [authority, setAuthority] = useState(defaultAuthority);

  useEffect(() => {
    const { pathname } = location;
    // 模拟请求接口 todo...
    const testTimer = setTimeout(() => {
      /* TODO: 根据 pathname 和 用户id 获取登录状态和权限信息并 setAuthority
       * authority 信息可扩展：例如可以加按钮权限数据，然后通过Context上下文给children传下去
       * 例如：{ isAuthenticated: true, isPermitted: true, buttons: [{ key: 'xxx', name: '编辑' }] }
       * 然后通过 components/PrivateButton 组件包裹私有按钮
       */
      if (pathname === '/nest/auth-demo') {
        // TODO: 模拟已登录无权限，也可以模拟未登录isAuthenticated:false
        setAuthority({
          isAuthenticated: true, // 已登录
          isPermitted: false, // 无权限
        });
        return;
      }
      setAuthority({
        isAuthenticated: true,
        isPermitted: true,
      });
    }, 280);
    return () => {
      clearTimeout(testTimer);
    };
  }, [location]);

  // 未登录
  if (!authority.isAuthenticated) {
    window.location.href = `${publicPath}#/login?${stringify(location)}`;
    return null;
  }

  // 无权限
  if (!authority.isPermitted) {
    return <Redirect to="/nest/no-permission" />;
  }

  // 通过验证
  return children;

  // TODO: 如果有需要可以通过Context往下传递数据
  // return (
  //   <ButtonAuthority.Provider value={authority.buttons}>{children}</ButtonAuthority.Provider>
  // );
}, areEqual);

NativePrivate.propTypes = {
  children: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default function PrivateRoute({ children, ...restProps }) {
  return (
    <Route
      {...restProps}
      render={({ location }) => <NativePrivate location={location}>{children}</NativePrivate>}
    />
  );
}

PrivateRoute.propTypes = {
  children: PropTypes.object.isRequired,
};
