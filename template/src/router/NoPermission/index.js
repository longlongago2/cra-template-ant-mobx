import React from 'react';
import styles from './index.module.less';

export default function NoPermission() {
  return (
    <div className={styles.noPermission}>
      <span className={styles.tip}>哎呀，我居然没有权限~</span>
    </div>
  );
}
