/* eslint-disable no-unused-vars */
import React, { Suspense, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Layout as AntLayout, Skeleton } from 'antd';
import { Observer } from 'mobx-react';
import { useStores } from '@/model'; // use hooks model
import { namespace } from '@/model/auth'; // module namespace
import styles from './index.module.less';

const { Header, Content, Footer } = AntLayout;
// lazy 组件会有一段加载时间，通过Suspense可以自定义fallback骨架屏

export default function Layout(props) {
  // props
  const { children } = props;

  // model
  const { rootStore } = useStores();
  const { userinfo, setUserinfo } = rootStore[namespace];

  // effect
  useEffect(() => {
    // TODO: mobx请求接口数据 --示例代码无法请求，先注释
    // setUserinfo();
  }, []);

  return (
    <AntLayout className={styles.layout}>
      <Header className={styles.header}>
        <Link to="/nest/home" className={styles.link}>
          首页
        </Link>
        <Link to="/nest/about" className={styles.link}>
          关于
        </Link>
        <Link to="/nest/xxx" className={styles.link}>
          noMatch
        </Link>
        <Link to="/nest/auth-demo" className={styles.link}>
          noPermission
        </Link>
        <Observer>
          {() => <span className={styles.profile}>{userinfo.data.username}</span>}
        </Observer>
      </Header>
      <Content className={styles.content}>
        <div className={styles.contentInner}>
          <Suspense fallback={<Skeleton active />}>{children}</Suspense>
        </div>
      </Content>
      <Footer className={styles.footer}>Ant Design ©2018 Created by Ant UED</Footer>
    </AntLayout>
  );
}

Layout.propTypes = {
  children: PropTypes.object.isRequired,
};
