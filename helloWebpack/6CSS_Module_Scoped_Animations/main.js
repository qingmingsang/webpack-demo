//var React = require('react');
//var ReactDOM = require('react-dom');
//var style = require('./app.css');

import React from 'react';
import ReactDOM from 'react-dom';
import styles from './ScopedAnimations.css';

class ScopedAnimations extends React.Component {

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.ball} />
      </div>
    );
  }

};

ReactDOM.render(
  <ScopedAnimations/>,
  document.getElementById('example')
);
