
// function getComponent() {
//   return import(/* webpackChunkName: "lodash" */ 'lodash').then(_ => {
//     var element = document.createElement('div');

//     element.innerHTML = _.join(['Hello', 'webpack'], ' ');

//     return element;

//   }).catch(error => 'An error occurred while loading the component');
// }

//如果支持 async await还能这么写
async function getComponent() {
  var element = document.createElement('div');
  const _ = await import(/* webpackChunkName: "lodash" */ 'lodash');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;//Promise {[[PromiseStatus]]: "pending", [[PromiseValue]]: undefined}
}

getComponent().then(component => {
  document.body.appendChild(component);
})
