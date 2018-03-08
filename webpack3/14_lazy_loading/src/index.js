import _ from 'lodash';

function component() {
  var element = document.createElement('div');
  var button = document.createElement('button');
  var br = document.createElement('br');

  button.innerHTML = 'Click me and look at the console!';
  element.innerHTML = _.join(['Hello', 'webpack1'], ' ');
  element.appendChild(br);
  element.appendChild(button);

  // Note that because a network request is involved, some indication
  // of loading would need to be shown in a production-level site/app.
  button.onclick = e => import(/* webpackChunkName: "print1" */ './print')
    .then(module => {
      //注意当调用 ES6 模块的 import() 方法（引入模块）时，
      //必须指向模块的 .default 值，
      //因为它才是 promise 被处理后返回的实际的 module 对象。 
      console.log(module)//{__esModule: true, default: ƒ}
      var print = module.default;

      print();
    });
  let button2 = document.createElement('button');
  button2.innerHTML = 'click';
  button2.onclick = e => import(/* webpackChunkName: "print2" */ './print2')
    .then(module => {
      //注意当调用 ES6 模块的 import() 方法（引入模块）时，
      //必须指向模块的 .default 值，
      //因为它才是 promise 被处理后返回的实际的 module 对象。 
      console.log(module)//{__esModule: true, default: ƒ}
      var print = module.default;
      print();
    });
  element.appendChild(br);
  element.appendChild(button2);
  return element;
}

document.body.appendChild(component());
