import React from 'react';
import styles from './index.module.less';

export default function NoMatch() {
  return (
    <div className={styles.noMatch}>
      <span className={styles.tip}>哎呀，这个页面竟然不见了~</span>
    </div>
  );
}
