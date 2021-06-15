import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.less';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { responseInterception } from './utils/mobx-helper';
import request from './utils/request';

request.BASE_URL = process.env.REACT_APP_BASE_URL;
request.after(responseInterception);

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
