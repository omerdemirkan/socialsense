import React from 'react';
import './App.css';


// Router
import { Route, Switch } from 'react-router-dom';

// Pages
import About from './pages/About/About';
import Search from './pages/Search/Search';
import Home from './pages/Home/Home';

// Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

function App() {
  return <div className="App dark-mode">
    <Navbar/>
    <div className='page-wrapper fade-in-on-load'>

      <Switch>
        <Route path='/about' component={About}/>
        <Route path='/search' component={Search}/>
        <Route path='/' component={Home}/>
      </Switch>
      
    </div>
    
  <Footer/>
  </div>
}

export default App;
