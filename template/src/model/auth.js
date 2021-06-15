import { makeObservable, observable, action } from 'mobx';
import { MobxHelper } from '@/utils/mobx-helper';
import { apiGetAuthMenu, apiGetUserInfo } from '@/service';

// NOTE: mock 数据
const defaultUserInfo = {
  username: 'admin',
  userId: 'xxxx-xxxx-xxxx-xxxx',
};
const defaultAuthMenu = [
  { key: 'home', name: '首页', path: '/' },
  { key: 'setting', name: '设置', path: '/nest/setting' },
  { key: 'test', name: 'test404', path: '/nest/test' },
];

export class AuthStore extends MobxHelper {
  constructor(props) {
    super(props);
    makeObservable(this, {
      authMenu: observable,
      setAuthMenu: action.bound,
      userInfo: observable,
      setUserInfo: action.bound,
    });
  }

  userInfo = { loading: false, data: defaultUserInfo };

  authMenu = { loading: false, data: defaultAuthMenu };

  async setAuthMenu(params, cbSuccess, cbFailed) {
    this.authMenu.loading = true;
    const response = await apiGetAuthMenu(params);
    this.commit({
      response,
      success(data) {
        const res = data.data || [];
        this.authMenu.data = res;
        if (typeof cbSuccess === 'function') cbSuccess(res);
      },
      error(err) {
        if (typeof cbFailed === 'function') cbFailed(err);
      },
      complete() {
        this.authMenu.loading = false;
      },
    });
  }

  async setUserInfo(params, cbSuccess) {
    this.userInfo.loading = true;
    const response = await apiGetUserInfo(params);
    this.commit({
      response,
      success(data) {
        const res = data.data || {};
        this.userInfo.data = res;
        if (typeof cbSuccess === 'function') cbSuccess(res);
      },
      complete() {
        this.userInfo.loading = false;
      },
    });
  }
}

export const namespace = 'auth';
