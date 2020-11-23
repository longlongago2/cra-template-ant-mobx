/* eslint-disable no-console */
import React, { Suspense, memo, useEffect, Fragment, useRef } from 'react';
import PropTypes from 'prop-types';
import { Router, Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { createHashHistory, createBrowserHistory } from 'history';
import { NativePrivate } from './PrivateRoute';

const areEqual = (prevProps, nextProps) => prevProps.routes === nextProps.routes;

// Nest Route
const RecursionRoute = memo((props) => {
  const { routes, beforeEach, privateHandler } = props;
  const match = useRouteMatch();
  const parentpath = match.path !== '/' ? match.path : '';
  return (
    <Switch>
      {routes.map((item, i) => {
        // Config
        const { path, exact, redirect, layout, children, meta, component: RouteComp } = item;
        const nestpath = path !== '*' ? parentpath + path : path;
        const nestredirect = parentpath + redirect;

        // Wrapper component
        const isPrivate = item.private && !item.children; // 只有叶子节点才可以设置私有
        let layoutComponent = layout;
        let layoutFallback;
        if (Object.prototype.toString.call(layout).indexOf('Object') > -1) {
          layoutComponent = layout.component;
          layoutFallback = layout.fallback;
        }
        const WrapperLayout = layoutComponent || Fragment;
        const WrapperSuspense = layoutFallback ? Suspense : Fragment;
        const WrapperPrivate = isPrivate ? NativePrivate : Fragment;

        // Render
        const render = ({ location }) => {
          const next = (routeProps = {}) => {
            if (Object.prototype.toString.call(routeProps).indexOf('Object') < 0) {
              console.error(
                `[RouterConfig]: Failed prop type: Invalid prop \`routeProps\` of type \`${typeof routeProps}\` supplied to function \`next\`, expected \`object\`.`,
              );
              return null;
            }

            if (redirect) {
              return <Redirect to={nestredirect} />;
            }

            const wrapperSuspenseProps = layoutFallback ? { fallback: layoutFallback } : {};
            const wrapperPrivateProps = isPrivate ? { location, match, privateHandler } : {};
            return (
              <WrapperLayout>
                <WrapperSuspense {...wrapperSuspenseProps}>
                  {children ? (
                    <RecursionRoute
                      routes={children}
                      beforeEach={beforeEach}
                      privateHandler={privateHandler}
                    />
                  ) : (
                    <WrapperPrivate {...wrapperPrivateProps}>
                      <RouteComp {...routeProps} />
                    </WrapperPrivate>
                  )}
                </WrapperSuspense>
              </WrapperLayout>
            );
          };

          if (typeof beforeEach === 'function' && !children) {
            return beforeEach({ ...location, meta }, next);
          }

          return next();
        };

        return (
          <Route key={`iRoute-${i}-${nestpath}`} path={nestpath} exact={exact} render={render} />
        );
      })}
    </Switch>
  );
}, areEqual);

RecursionRoute.propTypes = {
  routes: PropTypes.array.isRequired,
  beforeEach: PropTypes.func,
  privateHandler: PropTypes.object,
};

// Route
const RouterConfig = memo((props) => {
  const { routes, beforeEach, type = 'hash', privateHandler, onRouteChange } = props;

  const history = useRef();
  if (type === 'hash') {
    history.current = createHashHistory();
  } else if (type === 'browser') {
    history.current = createBrowserHistory();
  }

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
      <Suspense
        fallback={
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
        }
      >
        <RecursionRoute routes={routes} beforeEach={beforeEach} privateHandler={privateHandler} />
      </Suspense>
    </Router>
  );
}, areEqual);

RouterConfig.propTypes = {
  type: PropTypes.oneOf(['hash', 'browser']),
  routes: PropTypes.array.isRequired,
  beforeEach: PropTypes.func,
  privateHandler: PropTypes.object,
  onRouteChange: PropTypes.func,
};

export { AuthorityContext } from './PrivateRoute';

export default RouterConfig;
