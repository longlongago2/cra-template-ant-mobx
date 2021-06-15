import { useCallback } from 'react';
import { Result, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import styles from './index.module.less';

export default function NoAuth() {
  const history = useHistory();

  const handleNavigate = useCallback(() => {
    history.push('/');
  }, [history]);

  return (
    <div className={styles.noAuth}>
      <Result
        status="403"
        title="403"
        subTitle="抱歉, 您没有此页面的访问权限。"
        extra={
          <Button type="primary" onClick={handleNavigate}>
            返回首页
          </Button>
        }
      />
    </div>
  );
}
