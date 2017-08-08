import './style.css';
import pikaqiu from './q.jpg';
import Library from './library';
import x from 'qq';

function component() {
    var element = document.createElement('div');

    element.innerHTML = `<p>Hello webpack 2222</p><div><img src=${pikaqiu} /></div>`;
    if (module.hot) {
        module.hot.accept('./library', function() {
            console.info('Accepting the updated library module!');
            Library.log();
        })
    }
    return element;
}
document.body.appendChild(component());
x('p').css({'background':'red'});