import 'whatwg-fetch';
import fetchJsonp from 'fetch-jsonp';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function checkOK(response) {
  if (response.ok) {
    return response;
  }

  const error = new Error('fetch jsonp request failed！');
  error.response = response;
  throw error;
}

const fetchOpts = {
  credentials: 'include', // 允许跨域携带cookie
};

const fetchJsonOpts = {
  timeout: 10000, // 超时时间
};

const combineURLs = (baseURL, relativeURL) => (relativeURL
  ? `${baseURL.replace(/\/+$/, '')}/${relativeURL.replace(/^\/+/, '')}`
  : baseURL);

const isAbsoluteURL = (url) => /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string}  url       请求地址
 * @param  {object}  [options] 配置参数：继承fetch原生参数
 * @param  {boolean} options.jsonp 是否使用jsonp请求
 * @return {object}  {data, err}
 */
function request(url, options) {
  let URL;
  const BASE_URL = request.prototype.BASE_URL || '/';
  if (isAbsoluteURL(url)) {
    URL = url;
  } else {
    URL = combineURLs(BASE_URL, url);
  }
  if (options && options.jsonp) {
    const iOption = { ...options };
    delete iOption.jsonp;
    return fetchJsonp(URL, { ...fetchJsonOpts, ...iOption })
      .then(checkOK)
      .then(parseJSON)
      .then((data) => ({ data }))
      .catch((err) => ({ err }));
  }
  return fetch(URL, { ...fetchOpts, ...options })
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => ({ data }))
    .catch((err) => ({ err }));
}

export default request;
