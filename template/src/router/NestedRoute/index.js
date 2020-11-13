import React from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.less';

export default function NestedRoute(props) {
  const { children } = props;
  const menu = [
    { name: 'nested1', path: '/nest/nested-route/nested1' },
    { name: 'nested2-noPermission', path: '/nest/nested-route/nested2' },
  ];
  return (
    <div className={styles.nestedRoute}>
      <div className={styles.menu}>
        <span className={styles.pre}>nestedRoute menu:</span>
        {menu.map((item) => (
          <Link key={item.path} to={item.path}>
            {item.name}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
