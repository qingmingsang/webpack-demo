import _ from 'underscore';
console.log('The print.js module has loaded! See the network tab in dev tools...');

export default () => {
  let a = ['Hello', 'print2'];
  _.each(a, (v) => {
    console.log(v)
  })
  //console.log('ok2')
}

export let xx = 'xxx';
