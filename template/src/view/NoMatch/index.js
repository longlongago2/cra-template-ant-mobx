import { useCallback } from 'react';
import { Result, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import styles from './index.module.less';

export default function NoMatch() {
  const history = useHistory();

  const handleNavigate = useCallback(() => {
    history.push('/');
  }, [history]);

  return (
    <div className={styles.noMatch}>
      <Result
        status="404"
        title="404"
        subTitle="抱歉, 您正在访问的页面不存在。"
        extra={
          <Button type="primary" onClick={handleNavigate}>
            返回首页
          </Button>
        }
      />
    </div>
  );
}
