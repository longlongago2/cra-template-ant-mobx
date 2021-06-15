import React, { Suspense, memo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { NativePrivate } from './PrivateRoute';

const __DEV__ = process.env.NODE_ENV === 'development';

const isObject = (target) => Object.prototype.toString.call(target).indexOf('Object') > -1;

const RecursionRoute = memo((props) => {
  const { routes = [], beforeEach, privateHandler, useAuthorityContext } = props;
  const match = useRouteMatch();
  const parentpath = match.path !== '/' ? match.path : '';
  return (
    <Switch>
      {routes.map((item, i) => {
        // Config
        const { path, exact, redirect, layout, children, meta, component: RouteComp } = item;
        const nestpath = path !== '*' ? parentpath + path : path;
        const isPrivate = !item.children && item.private; // 只有叶节点才可以设置私有
        let layoutComponent = layout;
        let layoutFallback;
        let layoutProps;
        if (isObject(layout)) {
          layoutComponent = layout.component;
          layoutFallback = layout.fallback;
          layoutProps = layout.props;
        }

        // Wrapper component
        const WrapperLayout = layoutComponent || Fragment;
        const WrapperSuspense = layoutFallback ? Suspense : Fragment;
        const WrapperPrivate = isPrivate ? NativePrivate : Fragment;

        // Render
        const render = ({ location }) => {
          const next = (routeProps = {}) => {
            if (redirect) {
              const nestredirect = parentpath + redirect;
              return <Redirect to={nestredirect} />;
            }

            if (!isObject(routeProps)) {
              if (__DEV__) {
                // eslint-disable-next-line no-console
                console.error(
                  `[RouterConfig]: Failed prop type: Invalid prop \`routeProps\` of type \`${typeof routeProps}\` supplied to function \`next\`, expected \`object\`.`
                );
              }
              return null;
            }

            // Wrapper props
            let wrapperLayoutProps = layoutProps || {};
            if (typeof layoutProps === 'function') {
              wrapperLayoutProps = layoutProps(location);
            }

            let wrapperSuspenseProps = {};
            if (layoutFallback) {
              wrapperSuspenseProps = { fallback: layoutFallback };
            }

            let wrapperPrivateProps = {};
            if (isPrivate) {
              wrapperPrivateProps = { location, match, privateHandler, useAuthorityContext };
            }

            const recursionRouteProps = { ...props, routes: children };

            return (
              <WrapperLayout {...wrapperLayoutProps}>
                <WrapperSuspense {...wrapperSuspenseProps}>
                  {children ? (
                    <RecursionRoute {...recursionRouteProps} />
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

        return <Route key={`iRoute-${i}-${nestpath}`} path={nestpath} exact={exact} render={render} />;
      })}
    </Switch>
  );
});

RecursionRoute.propTypes = {
  routes: PropTypes.array.isRequired,
  beforeEach: PropTypes.func,
  privateHandler: PropTypes.object,
  useAuthorityContext: PropTypes.bool,
};

export default RecursionRoute;
