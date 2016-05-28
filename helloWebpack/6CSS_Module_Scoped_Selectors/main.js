//var React = require('react');
//var ReactDOM = require('react-dom');
//var style = require('./app.css');

import React from 'react';
import ReactDOM from 'react-dom';
import styles from './app.css';

class ScopedSelectors extends React.Component {

  render() {
    return (
    	//防止与其他同CSS类名冲突，会生成乱码一样的类名
      <div className={ styles.root }>
        <p className={ styles.text }>Scoped Selectors</p>
      </div>
    );
  }

};
ReactDOM.render(
  <ScopedSelectors/>,
  document.getElementById('example')
);
