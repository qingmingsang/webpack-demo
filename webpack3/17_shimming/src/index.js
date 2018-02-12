//import _ from 'lodash';
import { file, parse } from './globals.js';

function component() {
  var element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  //element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.innerHTML = join(['Hello', 'webpack'], ' ');

  // Assume we are in the context of `window`
  //this.alert('Hmmm, this probably isn\'t a great idea...')
  console.log(file)
  parse();
  return element;
}

document.body.appendChild(component());


fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => response.json())
  .then(json => {
    console.log('We retrieved some data! AND we\'re confident it will work on a variety of browser distributions.')
    console.log(json)
  })
  .catch(error => console.error('Something went wrong when fetching this data: ', error))