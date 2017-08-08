import './style.css';
import y from '$biu';

function component() {
    var element = document.createElement('section');

    element.innerHTML = `另一个文件`;

    return element;
}

document.body.appendChild(component());
y('section').css({'background':'blue'});