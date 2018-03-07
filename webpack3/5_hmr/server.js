const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('./webpack.config.js');
const options = {
  hot: true,
  host: 'localhost',
  port: 5000,
  proxy: {
    "/api": {
      target: "http://localhost:5001",
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    }
  }
};

WebpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new WebpackDevServer(compiler, options);

server.listen(5000, 'localhost', () => {
  console.log('dev server listening on port 5000');
});
