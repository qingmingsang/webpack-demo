function component() {
    const element = document.createElement('div');

    //element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.innerHTML = join(['Hello', 'webpack'], ' ');

    // 假设我们处于 `window` 上下文
    this.alert('Hmmm, this probably isn\'t a great idea...')
    return element;
}

document.body.appendChild(component());