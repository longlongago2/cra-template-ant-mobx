import React, { useState, useEffect, useCallback, memo } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Loading from './Loading';

const __DEV__ = process.env.NODE_ENV === 'development';

// authority 信息上下文
export const AuthorityContext = React.createContext();

// private Route 私有路由底层组件
export const NativePrivate = memo((props) => {
  const { location, match, children, privateHandler = {}, useAuthorityContext = false } = props;

  const { effect, noLoggedIn, noPermission } = privateHandler;

  const [authority, setAuthority] = useState({});

  const [loading, setLoading] = useState(true);

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
          // eslint-disable-next-line no-console
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
      setLoading(false);
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

  // loading
  if (loading) return <Loading />;

  // 未登录
  if (!authority.loggedIn) {
    if (typeof noLoggedIn === 'function') {
      return noLoggedIn({ location, match, Redirect });
    }
    return null;
  }

  // 无权限
  if (!authority.permission) {
    if (typeof noPermission === 'function') {
      return noPermission({ location, match, Redirect });
    }
    return null;
  }

  // 通过验证
  if (useAuthorityContext) {
    return <AuthorityContext.Provider value={authority}>{children}</AuthorityContext.Provider>;
  }

  return children;
});

NativePrivate.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  children: PropTypes.element,
  privateHandler: PropTypes.object,
  useAuthorityContext: PropTypes.bool,
};
