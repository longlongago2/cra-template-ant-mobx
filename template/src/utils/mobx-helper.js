/* eslint-disable no-console, class-methods-use-this, no-restricted-syntax */
import { makeObservable, action } from 'mobx';
import { message } from 'antd';

export class MobxHelper {
  constructor(store) {
    makeObservable(this, {
      commit: action.bound,
    });

    this.rootStore = store;

    this.getModuleStore = this._getModuleStore.bind(this);
  }

  _getModuleStore = (namespace) => {
    if (!namespace) return this.rootStore;
    if (typeof namespace !== 'string') {
      console.warn('[mobx-helper]: the parameter `namespace` of function `getModuleStore` must be of type string.');
      return null;
    }
    return this.rootStore[namespace];
  };

  commit({ response, success, error }) {
    const { data, err } = response;
    if (err) {
      if (typeof error === 'function') {
        error.call(this, err);
      }
      message.error(err.message);
      return;
    }
    if (data && Number(data.status) === 0) {
      if (typeof success === 'function') {
        success.call(this, data, this.rootStore);
      }
    } else {
      const errMsg = data.msg;
      const errCode = data.status;
      if (typeof error === 'function') {
        error.call(this, new Error(errMsg));
        return;
      }
      message.error(`${errMsg}（状态码：${errCode}）`);
    }
  }
}

/**
 * inject map store to props: support namespace
 *
 * @export
 * @param {string} [namespace]
 * @param {string} mapFields
 * @return {object}
 */
export function injectMap(...args) {
  let namespace;
  let mapFields;
  if (args && args.length >= 2) {
    [namespace, mapFields] = args;
  } else {
    mapFields = args[0] || {};
  }
  if (namespace && typeof namespace !== 'string') {
    console.warn(
      '[mobx-helper]: the parameter `namespace` of function `mapStoreToProps` must be of type string.',
    );
    return null;
  }
  if (mapFields && typeof mapFields !== 'object') {
    console.warn(
      '[mobx-helper]: the parameter `mapFields` of function `mapStoreToProps` must be of type object.',
    );
    return null;
  }
  return ({ store }) => {
    const fields = {};
    if (namespace) {
      for (const key in mapFields) {
        if (Object.prototype.hasOwnProperty.call(mapFields, key)) {
          fields[key] = mapFields[key](store.rootStore[namespace]);
        }
      }
    } else {
      for (const key in mapFields) {
        if (Object.prototype.hasOwnProperty.call(mapFields, key)) {
          fields[key] = mapFields[key](store.rootStore);
        }
      }
    }
    return fields;
  };
}
