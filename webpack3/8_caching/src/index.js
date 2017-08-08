import './style.css';
import pikaqiu from './q.jpg';
import Library from './library';

function component() {
    var element = document.createElement('div');

    element.innerHTML = `<p>Hello webpack 2222</p><div><img src=${pikaqiu} /></div>`;
    Library.log();
    return element;
}
document.body.appendChild(component());