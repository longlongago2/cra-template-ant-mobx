// 反向代理配置文件
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function proxy(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: '接口服务器地址',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
      cookieDomainRewrite: {
        '*': 'localhost',
      },
    }),
  );
};
