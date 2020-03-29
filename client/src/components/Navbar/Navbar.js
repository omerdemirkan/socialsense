import React, {useState, useEffect } from 'react';
import classes from './Navbar.module.css';

//Router
import { NavLink } from 'react-router-dom';

// Images
import logo from '../../images/logo.svg';


export default function Navbar() {
    
    const [minimize, setMinimize] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setMinimize(true)
        }, 2000);
    });
    
    return <div className={classes.Navbar + ' fade-in-on-load'} style={minimize ? {height: '100px'}: null}>
        <span 
        className={classes.LogoText}
        style={minimize ? {opacity: 1}: null}>
            <NavLink to='/'>
                socialsense.<span className='accented-text'>ai</span>
            </NavLink>
        </span>

        <span className={classes.LogoIcon}>
            <NavLink to='/'>
                <img 
                src={logo}
                style={minimize ? {height: '70px', transition: 'height 0.2s ease'}: null}
                />
            </NavLink>
        </span>

        <ul 
        className={classes.NavList}
        style={minimize ? {opacity: 1}: null}>
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
