import React, { Suspense, memo, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'react-router-dom';
import { createHashHistory, createBrowserHistory } from 'history'; // IMP: react-router-dom@5.x 与 history@5 不兼容：降级到历史版本 v.4.10.1
import RecursionRoute from './RecursionRoute';

function RouterConfig(props) {
  const {
    routes,
    beforeEach,
    type = 'hash',
    privateHandler,
    useAuthorityContext,
    onRouteChange,
  } = props;

  const history = useRef(null);

  if (!history.current) {
    if (type === 'hash') {
      history.current = createHashHistory();
    } else if (type === 'browser') {
      history.current = createBrowserHistory();
    }
  }

  const fallback = useMemo(
    () => (
      <div
        style={{
          textAlign: 'center',
          fontSize: 17,
          marginTop: 50,
          color: '#666',
          fontFamily: 'Arial',
        }}
      >
        loading...
      </div>
    ),
    []
  );

  // effect
  useEffect(() => {
    const removeRouteListener = history.current.listen((location, action) => {
      if (typeof onRouteChange === 'function') {
        onRouteChange(location, action);
      }
    });
    return () => {
      removeRouteListener();
    };
  }, [onRouteChange]);

  // render
  return (
    <Router history={history.current}>
      <Suspense fallback={fallback}>
        <RecursionRoute
          routes={routes}
          beforeEach={beforeEach}
          privateHandler={privateHandler}
          useAuthorityContext={useAuthorityContext}
        />
      </Suspense>
    </Router>
  );
}

RouterConfig.propTypes = {
  type: PropTypes.oneOf(['hash', 'browser']),
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      exact: PropTypes.bool,
      redirect: PropTypes.string,
      layout: PropTypes.oneOfType([
        PropTypes.elementType,
        PropTypes.shape({
          component: PropTypes.elementType,
          fallback: PropTypes.element,
          props: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
        }),
      ]),
      children: PropTypes.array,
      meta: PropTypes.any,
      component: PropTypes.elementType,
    })
  ).isRequired,
  beforeEach: PropTypes.func,
  privateHandler: PropTypes.object,
  useAuthorityContext: PropTypes.bool,
  onRouteChange: PropTypes.func,
};

export { AuthorityContext } from './PrivateRoute'; // 权限上下文

export default memo(RouterConfig);
