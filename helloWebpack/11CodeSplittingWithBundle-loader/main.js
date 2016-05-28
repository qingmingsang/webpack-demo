var load = require('bundle-loader!./a.js');//也是单独打包

//import load from 'bundle-loader!./a.js';//false

load(function(file) {
  document.open();
  document.write('<h1>' + file + '</h1>');
  document.close();
});
