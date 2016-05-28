import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router';
import './app.css';

class App extends React.Component{
  render() {
    return (
      <div>
        <header>
          <ul>
            <li><Link to="/app">Dashboard</Link></li>
            <li><Link to="/inbox">Inbox</Link></li>
            <li><Link to="/calendar">Calendar</Link></li>
          </ul>
          Logged in as Jane
        </header>
        {this.props.children}
      </div>
    );
  }
};


class Dashboard extends React.Component{
  render() {
    return (
      <div>
        <p>Dashboard</p>
      </div>
    )
  }
};

class Inbox extends React.Component{
  render() {
    return (
      <div>
        <p>Inbox</p>
      </div>
    )
  }
};

class Calendar extends React.Component{
  render() {
    return (
      <div>
        <p>Calendar</p>
      </div>
    )
  }
};

ReactDOM.render(
	(
	  <Router history={browserHistory}>
	    <Route path="/" component={App}>
	      <IndexRoute component={Dashboard}/>
	      <Route path="app" component={Dashboard}/>
	      <Route path="inbox" component={Inbox}/>
	      <Route path="calendar" component={Calendar}/>
	      <Route path="*" component={Dashboard}/>
	    </Route>
	  </Router>
	), 
	document.querySelector('#app')
);
