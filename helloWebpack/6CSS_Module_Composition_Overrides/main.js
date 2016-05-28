//var React = require('react');
//var ReactDOM = require('react-dom');
//var style = require('./app.css');

import React from 'react';
import ReactDOM from 'react-dom';
import styles from './CompositionOverrides.css';

class CompositionOverrides extends React.Component {

  render() {
    return (
      <div className={styles.root}>
        <p className={styles.text}>Class Composition with Overrides</p>
      </div>
    );
  }

};

ReactDOM.render(
  <CompositionOverrides/>,
  document.getElementById('example')
);
