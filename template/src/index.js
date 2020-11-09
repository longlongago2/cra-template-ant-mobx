import React from 'react';
import ReactDOM from 'react-dom';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import { configure } from 'mobx';
import request from '@/utils/request';
import * as serviceWorker from './serviceWorker';
import App from './App';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.less';
import './index.css';

request.prototype.BASE_URL = process.env.REACT_APP_BASE_URL;

configure({
  enforceActions: 'observed', // 必须通过 action 更改 observable 状态，禁止直接更改
});

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
