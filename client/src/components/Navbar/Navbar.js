import React, {useState, useEffect, useRef } from 'react';
import classes from './Navbar.module.css';

//Router
import { NavLink } from 'react-router-dom';

// Images
import logo from '../../images/logo.svg';
import logo2 from '../../images/logo-2.svg';


export default function Navbar() {
    
    const [splashScreenClosed, setSplashScreenClosed] = useState(false);

    const [minimizeHeader, setMinimizeHeader] = useState(false);

    const headerRef = useRef();
    headerRef.current = minimizeHeader;

    useEffect(() => {
        const handleScroll = () => {
          const show = window.scrollY > 50
          if (headerRef.current !== show) {
            setMinimizeHeader(show)
          }
        }
        document.addEventListener('scroll', handleScroll)
        return () => {
          document.removeEventListener('scroll', handleScroll)
        }
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setSplashScreenClosed(true)
        }, 2000);
    }, []);
    
    return <div className={classes.Navbar + ' fade-in-on-load'} 
    style={splashScreenClosed ? 
        
        minimizeHeader ? 

            {height: '80px', backgroundColor: 'var(--background-alt)'} 

        : {height: '100px'}
    : 
        null
    }>
        
        <span 
        className={classes.LogoText}
        style={splashScreenClosed ? 
         minimizeHeader ? {opacity: 1, top: '22px'}
         : {opacity: 1}
        : null}>
            <NavLink to='/'>
                socialsense.<span className='accented-text'>ai</span>
            </NavLink>
        </span>

        <span className={classes.LogoIcon}>
            <NavLink to='/'>
                <img 
                src={logo2}
                style={splashScreenClosed ? {height: '70px', transition: 'height 0.2s ease'}: null}
                />
            </NavLink>
        </span>

        <ul 
        className={classes.NavList}
        style={
            splashScreenClosed ? 
                minimizeHeader ? {opacity: 1, top: '15px'}
                : {opacity: 1}
            : null}
        >
            <li>
                <NavLink to='/' 
                activeClassName={classes.ActiveLink}
                exact
                >Home</NavLink>
            </li>
            <li>
                <NavLink to='/search'
                activeClassName={classes.ActiveLink}
                >Search</NavLink>
            </li>
            <li>
                <NavLink to='/about'
                activeClassName={classes.ActiveLink}
                >About</NavLink>
            </li>
        </ul>
    </div>
}
