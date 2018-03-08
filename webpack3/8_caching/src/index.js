import _ from 'lodash';
import Print from './print';

function component() {
  var element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack4'], ' ');
  element.onclick = Print.bind(null, 'Hello webpack1');

  return element;
}

document.body.appendChild(component());