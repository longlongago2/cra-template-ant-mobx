import { makeObservable, observable, action } from 'mobx';
import { MobxHelper } from '@/utils/mobx-helper';
import { apiGetAuthMenu, apiGetUserInfo } from '@/service';

// TODO: MobxHelper: 主要是解析后台数据的逻辑，您必须根据您的数据格式返回进行改造
// 默认返回结构：成功：{status:0, data:[]} 失败：{status:xxx, msg:'xxx'}
export class AuthStore extends MobxHelper {
  constructor(props) {
    super(props);
    makeObservable(this, {
      authMenu: observable,
      setAuthMenu: action.bound,
      userinfo: observable,
      setUserinfo: action.bound,
    });
  }

  userinfo = { loading: false, data: { username: 'longlongago', userid: 'xxxx' } };

  authMenu = { loading: false, data: [] };

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
        if (typeof cbSuccess === 'function') cbFailed(err);
      },
    });
    this.authMenu.loading = false;
  }

  async setUserinfo(params, cbSuccess) {
    this.userinfo.loading = true;
    const response = await apiGetUserInfo(params);
    this.commit({
      response,
      success(data) {
        const res = data.data || {};
        this.userinfo.data = res;
        if (typeof cbSuccess === 'function') cbSuccess(res);
      },
    });
    this.userinfo.loading = false;
  }
}

export const namespace = 'auth';
