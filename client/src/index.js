import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Router
import { BrowserRouter as Router } from 'react-router-dom'

const app = <Router>
  <React.StrictMode>
    <App />
  </React.StrictMode>
</Router>

ReactDOM.render(
  app,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
