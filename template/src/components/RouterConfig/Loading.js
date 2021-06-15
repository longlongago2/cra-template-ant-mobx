import React from 'react';
import styles from './index.module.less';

export default function Loading() {
  return (
    <div className={styles.loading}>
      <div className={styles.inner}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
