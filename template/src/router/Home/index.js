import React from 'react';
import PrivateButton from '@/components/PrivateButton';
import styles from './index.module.less';

export default function Home() {
  return (
    <div className={styles.home}>
      Home
      <div className={styles.demo}>
        <div className={styles.demoTitle}>权限按钮集合</div>
        <div className={styles.demoContent}>
          <PrivateButton buttonKey="fake-1">
            <button>权限按钮一</button>
          </PrivateButton>
          <PrivateButton buttonKey="fake-2">
            <button>权限按钮二</button>
          </PrivateButton>
          <PrivateButton buttonKey="fake-3">
            <button>权限按钮三</button>
          </PrivateButton>
        </div>
      </div>
    </div>
  );
}
