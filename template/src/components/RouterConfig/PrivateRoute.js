/* eslint-disable no-console */
import React, { useState, useEffect, useCallback } from 'react';
import { Route, Redirect, useRouteMatch } from 'react-router-dom';

const __DEV__ = process.env.NODE_ENV === 'development';

// 默认验证权限
const defaultAuthority = {
  isAuthenticated: true, // 是否验证登录
  isPermitted: true, // 是否有权限
  // ...其他属性可自定义
};

// authority 信息上下文
export const AuthorityContext = React.createContext();

// Comp1: 私有Route组件-底层组件
export const NativePrivate = (props) => {
  const { location, match, children, privateHandler = {} } = props;

  const { effect, noAuthentication, noPermission } = privateHandler;

  const [authority, setAuthority] = useState(defaultAuthority);

  const runGenerator = (generator) => {
    const iterator = generator();
    let rejector;
    const promise = new Promise((resolve, reject) => {
      rejector = reject;
      function recursiveCore(res) {
        const ctx = this;
        const result = ctx.next(res);
        if (result.done) {
          resolve(result.value);
          return;
        }
        Promise.resolve(result.value).then((v) => recursiveCore.call(iterator, v));
      }
      try {
        recursiveCore.call(iterator, undefined);
      } catch (err) {
        reject(err);
      }
    });
    const runCancel = () => {
      try {
        const cancellationError = new Error('run generator cancel');
        rejector(cancellationError);
        iterator.return(cancellationError);
      } catch (err) {
        rejector(err);
      }
      return promise;
    };
    promise.cancel = () => {
      runCancel().catch((err) => {
        if (__DEV__) {
          console.warn(err.message);
        }
      });
    };
    return promise;
  };

  const execAuthority = useCallback(() => {
    if (Object.prototype.toString.call(effect).indexOf('GeneratorFunction') < 0) return null;
    function* gen() {
      yield* effect({
        location,
        put: setAuthority,
      });
    }
    const promise = runGenerator(gen);
    return promise;
  }, [effect, location]);

  useEffect(() => {
    const promise = execAuthority();
    return () => {
      // 取消防止异步函数在页面卸载后还会setAuthority
      if (promise) promise.cancel();
    };
  }, [execAuthority]);

  // 未登录
  if (!authority.isAuthenticated) {
    if (typeof noAuthentication === 'function') {
      return noAuthentication({ location, match, Redirect });
    }
    return null;
  }

  // 无权限
  if (!authority.isPermitted) {
    if (typeof noPermission === 'function') {
      return noPermission({ location, match, Redirect });
    }
    return null;
  }

  // 通过验证
  return <AuthorityContext.Provider value={authority}>{children}</AuthorityContext.Provider>;
};

// Comp2: 私有Route组件
export default function PrivateRoute({ children, privateHandler, ...restProps }) {
  const match = useRouteMatch();
  return (
    <Route
      {...restProps}
      render={({ location }) => (
        <NativePrivate location={location} match={match} privateHandler={privateHandler}>
          {children}
        </NativePrivate>
      )}
    />
  );
}
