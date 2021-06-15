/* eslint-disable no-unused-expressions, no-console */
import { makeObservable, action } from 'mobx';

export class MobxHelper {
  constructor(store) {
    makeObservable(this, {
      commit: action.bound,
    });
    this.rootStore = store;
  }

  select = (namespace) => {
    if (!namespace) return this.rootStore;
    if (typeof namespace !== 'string') {
      process.env.NODE_ENV &&
        console.warn(
          '[mobx-helper]: the parameter `namespace` of function `select` must be of type string.'
        );
      return null;
    }
    return this.rootStore[namespace];
  };

  commit({ response, success, error, complete }) {
    const { data, err } = response;
    if (data && typeof success === 'function') {
      success.call(this, data, this.rootStore);
    }
    if (err && typeof error === 'function') {
      error.call(this, err);
    }
    if (typeof complete === 'function') {
      complete.call(this);
    }
  }
}

/**
 * @description 数据返回拦截逻辑
 * @export
 * @param {*} response axios 返回值
 * @return {*}
 */
export function responseInterception(response) {
  const { data } = response;
  if (data && Number(data.status) === 0) {
    return response;
  }
  const { msg = '接口返回值未达到预期', status = -1 } = data;
  return Promise.reject(new Error(`${msg}（状态码：${status}）`));
}
