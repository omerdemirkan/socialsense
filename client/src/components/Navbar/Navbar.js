import React from 'react';
import classes from './Navbar.module.css';

//Router
import { NavLink } from 'react-router-dom';

// Images
import logo from '../../images/logo.svg';

export default function Navbar() {
    return <div className={classes.Navbar}>
        <span className={classes.LogoText}>
            <NavLink to='/'>
                socialsense.<span className='accented-text'>ai</span>
            </NavLink>
        </span>

        <span className={classes.LogoIcon}>
            <NavLink to='/'>
                <img 
                src={logo}
                style={{transform: 'translateY(6px)'}}
                />
            </NavLink>
        </span>

        <ul className={classes.NavList}>
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
