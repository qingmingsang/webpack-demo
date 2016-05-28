//var React = require('react');
//var ReactDOM = require('react-dom');
//var style = require('./app.css');

import React from 'react';
import ReactDOM from 'react-dom';
import styles from './StyleVariantA.css';

class StyleVariantA extends React.Component {

  render() {
    return (
      <div className={styles.root}>
        <p className={styles.text}>Style Variant A</p>
      </div>
    );
  }

};

ReactDOM.render(
  <StyleVariantA/>,
  document.getElementById('example')
);
