import './style.css';
import Library from './library';

function component() {
    var element = document.createElement('section');
    element.innerHTML = `另一个文件`;
    Library.log();
    return element;
}

document.body.appendChild(component());