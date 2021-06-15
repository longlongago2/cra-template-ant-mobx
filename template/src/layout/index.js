import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Layout as AntLayout } from 'antd';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useStores } from '@/model';
import { namespace } from '@/model/auth';
import ErrorBoundary from '@/components/ErrorBoundary';
import styles from './index.module.less';

const { Header, Content, Sider } = AntLayout;

const cx = classNames.bind(styles);

function Layout(props) {
  const { children, nativeContent } = props;
  const { rootStore } = useStores();
  const { userInfo, setUserInfo, authMenu, setAuthMenu } = rootStore[namespace];

  useEffect(() => {
    // 获取用户信息
    setUserInfo();
    // 获取权限菜单
    setAuthMenu();
  }, [setUserInfo, setAuthMenu]);

  return (
    <ErrorBoundary>
      <AntLayout className={styles.layout}>
        <Sider className={styles.sider}>
          <div className={styles.logo}>logo</div>
          <ul className={styles.menu}>
            {authMenu.data.map((item) => (
              <li key={item.key}>
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </Sider>
        <AntLayout>
          <Header className={styles.header}>
            <div className={styles.userInfo}>
              <span>你好，</span>
              <span>{userInfo.data.username}</span>
            </div>
          </Header>
          <Content className={cx('content', { withInner: !nativeContent })}>
            {nativeContent ? children : <div className={styles.contentInner}>{children}</div>}
          </Content>
        </AntLayout>
      </AntLayout>
    </ErrorBoundary>
  );
}

Layout.propTypes = {
  children: PropTypes.element,
  nativeContent: PropTypes.bool, // 原生Content
};

export default observer(Layout);
