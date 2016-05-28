//var React = require('react');
//var ReactDOM = require('react-dom');
//var style = require('./app.css');

import React from 'react';
import ReactDOM from 'react-dom';
import styles from './app.css';

class GlobalSelectors extends React.Component {

  render() {
    return (
      <div className={ styles.root }>
        <p className="text">Global Selectors</p>
      </div>
    );
  }

};

ReactDOM.render(
  <GlobalSelectors/>,
  document.getElementById('example')
);
