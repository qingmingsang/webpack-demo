import './style.css';
import Library from './library';

function component() {
  var element = document.createElement('div');
  var btn = document.createElement('button');

  element.innerHTML = 'Hello webpack';

  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = Library.log;  // onclick event is bind to the original printMe function

  element.appendChild(btn);

  return element;
}

let element = component();
document.body.appendChild(element);

if (module.hot) {
  //当 library.js 内部发生变更时可以告诉 webpack 接受更新的模块
  //如果原本的dom上绑定了事件，需要重新绑定
  module.hot.accept('./library', function () {
    console.info('Accepting the updated library module!');
    document.body.removeChild(element);
    element = component(); // Re-render the "component" to update the click handler
    document.body.appendChild(element);
  })
}
//[HMR] Updated modules:
//[HMR]  - ./src/library.js

let btn1 = document.createElement('button');
btn1.innerHTML = 'request a';
let btn2 = document.createElement('button');
btn2.innerHTML = 'request b';
let btn3 = document.createElement('button');
btn3.innerHTML = 'request api';
document.body.appendChild(btn1);
document.body.appendChild(btn2);
document.body.appendChild(btn3);

btn1.addEventListener('click', () => {
  console.log('a')
  fetch('/api/a').then(function (response) {
    console.log(response)
    return response.text();
  }).then(function (data) {
    console.log(data);
  }).catch(function (e) {
    console.log(e);
  });
})
btn2.addEventListener('click', () => {
  console.log('b')
  fetch('/api/b').then(function (response) {
    console.log(response)
    return response.text();
  }).then(function (data) {
    console.log(data);
  }).catch(function (e) {
    console.log(e);
  });
})
btn3.addEventListener('click', () => {
  console.log('c')
  fetch('/api').then(function (response) {
    console.log(response)
    return response.text();
  }).then(function (data) {
    console.log(data);
  }).catch(function (e) {
    console.log(e);
  });
})