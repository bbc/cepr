import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Actions from './actions';
import CreateProject from './create-project';
import Container from './ui-container';

import * as serviceWorker from './serviceWorker';

const element = <h1>CEPR POC</h1>;
//ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<Actions/>, document.getElementById('actions'));
// ReactDOM.render(<CreateProject/>, document.getElementById('createprojects'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
