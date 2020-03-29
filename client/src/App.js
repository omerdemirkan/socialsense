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
import { connect } from 'react-redux';

function App(props) {
  return <div className={`App ${props.darkMode ? 'dark-mode' : null}`}>
    <Navbar/>
    <div 
    className='page-wrapper fade-in-on-load'
    style={{animationDelay: '2.4s', animationDuration: '.6s'}}>

      <Switch>
        <Route path='/about' component={About}/>
        <Route path='/search' component={Search}/>
        <Route path='/' component={Home}/>
      </Switch>
      
    </div>
    
  <Footer/>
  </div>
}

const mapStateToProps = state => {
  return {
    darkMode: state.theme.darkMode
  }
}

export default connect(mapStateToProps)(App);
