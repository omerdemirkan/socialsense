import React from 'react';
import './App.css';

// Router
import { Route, Switch } from 'react-router-dom';

// Pages
import About from './pages/About/About';
import Search from './pages/Search/Search';
import Home from './pages/Home/Home';

function App() {
  return <div className="App">
      <Switch>
        <Route path='/about' component={About}/>
        <Route path='/search' component={Search}/>
        <Route path='/' component={Home}/>
      </Switch>
  </div>
}

export default App;
