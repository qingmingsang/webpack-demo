import React from 'react';
import ReactDOM from 'react-dom';

import './style.css';
import pikaqiu from './q.jpg';
import Library from './library';

if (module.hot) {
    module.hot.accept('./library', function() {
        console.info('Accepting the updated library module!');
        Library.log();
    })
}

ReactDOM.render(
    <h1>Hello, World6!</h1>,
    document.getElementById('root')
);