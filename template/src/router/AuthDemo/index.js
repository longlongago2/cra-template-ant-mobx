import React from 'react';
import styles from './index.module.less';

export default function AuthDemo() {
  return (
    <div className={styles.authDemo}>
      更改 router/PrivateRoute.js 里的逻辑，换成接口请求亦然，
      <br />
      页面默认都是有权限的，当接口请求到无权限时才会更新权限状态，在此之前依然可以看到路由界面，
      <br />
      当接口返回无权限数据时才会跳转到无权限界面，因此会有一个跳转的过程是正常的，依赖接口返回的速度！
      <br />
      如果想模拟未登录的情况，请将 isAuthenticated 设为 false，未登录的情况下直接跳转登录页，不会再处理isPermitted
      <br />
      <code>
        {`
          {
            isAuthenticated: true, // 已登录
            isPermitted: false, // 无权限
          }
        `}
      </code>
    </div>
  );
}
