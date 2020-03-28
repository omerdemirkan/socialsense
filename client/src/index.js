import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';

// Router
import { BrowserRouter as Router } from 'react-router-dom'

// Redux
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import searchReducer from './store/reducers/search';
import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  search: searchReducer
});

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));


// Material UI

const materialTheme = createMuiTheme({
    palette: {
        primary: {
            500: '#CC00FF'
        }
    }
});
const app = <Provider store={store}>
  <Router>
    <React.StrictMode>
      <ThemeProvider theme={materialTheme}>
        <App />
      </ThemeProvider>
      
    </React.StrictMode>
  </Router>
</Provider>


ReactDOM.render(
  app,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
