import './style.css';
import pikaqiu from './q.jpg';

function component() {
    var element = document.createElement('div');

    element.innerHTML = `<p>Hello webpack</p><img src=${pikaqiu} />`;

    return element;
}

document.body.appendChild(component());