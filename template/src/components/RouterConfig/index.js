/* eslint-disable no-console */
import React, { Suspense, memo, useEffect, useCallback, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Router, Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { createHashHistory } from 'history';
import { NativePrivate } from '@/router/PrivateRoute';

let removeRouteListener;

const history = createHashHistory();

const areEqual = (prevProps, nextProps) => prevProps.routes === nextProps.routes;

// Comp1
const RecursionRoute = memo((props) => {
  const { routes, beforeEach } = props;
  const match = useRouteMatch();
  const parentpath = match.path !== '/' ? match.path : '';
  return (
    <Switch>
      {routes.map((item, i) => {
        // config
        const { path, exact, redirect, component: Comp, layout, children, meta } = item;
        const nestpath = path !== '*' ? parentpath + path : path;
        const nestredirect = parentpath + redirect;
        // component
        const WrapperLayout = layout || Fragment;
        const WrapperPrivate = item.private ? NativePrivate : Fragment;
        // render
        const render = ({ location }) => {
          const next = (routeProps = {}) => {
            if (Object.prototype.toString.call(routeProps).indexOf('Object') < 0) {
              console.error(`[RouterConfig]: Failed prop type: Invalid prop \`routeProps\` of type \`${typeof routeProps}\` supplied to function \`next\`, expected \`object\`.`);
              return null;
            }
            if (redirect) {
              return <Redirect to={nestredirect} />;
            }

            const wrapperPrivateProps = item.private ? { location } : {};
            return (
              <WrapperLayout>
                {children ? (
                  <RecursionRoute routes={children} beforeEach={beforeEach} />
                ) : (
                  <WrapperPrivate {...wrapperPrivateProps}>
                    <Comp {...routeProps} />
                  </WrapperPrivate>
                )}
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
};

// Comp2
const RouterConfig = memo((props) => {
  const { routes, beforeEach, onRouteChange } = props;

  // memoized props: Avoid re-rendering
  const _onRouteChange = useCallback(onRouteChange, []);
  const _beforeEach = useCallback(beforeEach, []);

  // effect
  useEffect(() => {
    removeRouteListener = history.listen((location, action) => {
      if (typeof _onRouteChange === 'function') {
        _onRouteChange(location, action);
      }
    });
    return () => {
      removeRouteListener();
    };
  }, [_onRouteChange]);

  // render
  return (
    <Router history={history}>
      <Suspense fallback={<span>loading...</span>}>
        <RecursionRoute routes={routes} beforeEach={_beforeEach} />
      </Suspense>
    </Router>
  );
}, areEqual);

RouterConfig.propTypes = {
  routes: PropTypes.array.isRequired,
  beforeEach: PropTypes.func,
  onRouteChange: PropTypes.func,
};

export default RouterConfig;
