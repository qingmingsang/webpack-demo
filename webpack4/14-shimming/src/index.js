import { file, parse } from './global.js';

function component() {
    const element = document.createElement('div');

    //element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.innerHTML = join(['Hello', 'webpack'], ' ');

    // 假设我们处于 `window` 上下文
    //this.alert('Hmmm, this probably isn\'t a great idea...');
    console.log(file)
    console.log(parse)
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