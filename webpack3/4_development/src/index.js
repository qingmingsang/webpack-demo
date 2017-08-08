import './style.css';
import pikaqiu from './q.jpg';
import Library from './library';

function component() {
    var element = document.createElement('div');

    element.innerHTML = `<p>Hello webpack 3333</p><img src=${pikaqiu} />`;
    Library.log();
    return element;
}

document.body.appendChild(component());