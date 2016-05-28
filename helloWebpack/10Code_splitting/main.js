require.ensure(['./a'], function(require) {//单独打包，打包出了一个1.bundle.js
  var content = require('./a');
  document.open();
  document.write('<h1>' + content + '</h1>');
  document.close();
});
