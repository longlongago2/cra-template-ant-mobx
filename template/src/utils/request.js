// request config 请参考：https://github.com/axios/axios#request-config
import axios from 'axios';

class Request {
  constructor() {
    this.$axios = axios.create({
      baseURL: this.BASE_URL || '/',
      timeout: this.timeout || 1500,
    });
    this.process = this.process.bind(this);
    this.before = this.before.bind(this);
    this.after = this.after.bind(this);
  }

  set BASE_URL(v) {
    this.$axios.defaults.baseURL = v;
    return v;
  }

  set timeout(v) {
    this.$axios.defaults.timeout = v;
    return v;
  }

  before(callback) {
    this.$axios.interceptors.request.use(callback, (err) => Promise.reject(err));
  }

  after(callback) {
    this.$axios.interceptors.response.use(callback, (err) => Promise.reject(err));
  }

  process(config) {
    return this.$axios
      .request(config)
      .then(({ data }) => ({ data }))
      .catch((err) => ({ err }));
  }
}

const request = new Request();

export default request;
