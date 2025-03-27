const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // 네이버 로그인 콜백 API 프록시
  app.use(
    "/api/auth/naver",
    createProxyMiddleware({
      target: "http://localhost:3001", // 백엔드 서버 주소
      changeOrigin: true,
    })
  );

  // 관광 API 프록시
  app.use(
    "/api/tour",
    createProxyMiddleware({
      target: "https://apis.data.go.kr",
      changeOrigin: true,
      pathRewrite: {
        "^/api/tour": "",
      },
    })
  );

  app.use(
    "/v2/maps",
    createProxyMiddleware({
      target: "https://dapi.kakao.com",
      changeOrigin: true,
    })
  );

  app.use(
    "/api/weather",
    createProxyMiddleware({
      target: "http://api.openweathermap.org",
      changeOrigin: true,
    })
  );
};
