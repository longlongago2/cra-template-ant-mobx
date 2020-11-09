import { stringify } from 'qs';
import request from '../utils/request';

/**
 * @description 获取用户信息
 * @param {object} params
 * @param {string} [params.userid] 不填默认当前用户
 * @export
 * @return {*}
 */
export async function apiGetUserInfo(params) {
  const str = stringify(params);
  return request(`user/userinfo${str}`, {
    method: 'GET',
  });
}

/**
 * @description 获取当前用户菜单权限
 * @export
 * @param {object} params
 * @param {string} params.type [array, tree] 数组结构（平级），树结构（层级：默认）
 * @return {*}
 */
export async function apiGetAuthMenu(params) {
  const str = stringify(params);
  return request(`user/getuserroles${str}`, {
    method: 'GET',
  });
}
