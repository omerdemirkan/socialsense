import React from 'react';
import classes from './Navbar.module.css';

//Router
import { NavLink } from 'react-router-dom';

export default function Navbar() {
    return <div className={classes.Navbar}>
        <span className={classes.Logo}>
            <NavLink to='/'>
                Logo
            </NavLink>
        </span>

        <ul className={classes.NavList}>
            <li>
                <NavLink to='/'>Home</NavLink>
            </li>
            <li>
                <NavLink to='/search'>Search</NavLink>
            </li>
            <li>
                <NavLink to='/about'>About</NavLink>
            </li>
        </ul>
    </div>
}
