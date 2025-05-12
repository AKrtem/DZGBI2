const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api", // Путь, с которого будет проксироваться
    createProxyMiddleware({
      target: "https://api-maps.yandex.ru", // Адрес Яндекс API
      changeOrigin: true,
      pathRewrite: {
        "^/api": "", // Убираем /api из пути
      },
    })
  );
};
