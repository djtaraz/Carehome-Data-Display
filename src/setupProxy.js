const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/api/skills_assessment',
    createProxyMiddleware({
      target: 'https://skills-assessment.herokuapp.com',
      changeOrigin: true,
    })
  );
};