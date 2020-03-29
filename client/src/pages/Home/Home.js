import React from 'react'
import classes from './Home.module.css';

import ScrollUpOnMount from '../../components/ScrollUpOnMount/ScrollUpOnMount';

import { Link } from 'react-router-dom';

function Home() {
    return <div className={classes.Home}>
        <ScrollUpOnMount/>
        <div className = {classes.TextBox}>
            <h1>Discover your audience</h1>
        </div> 
        <div className={classes.CTAbox}>
            <h3 style={{display: 'inline'}}>Find the image and hashtags to reach the right people.</h3>
            <Link to='/search'>
                <button
                className='primary-button large'
                style={{width: '90vw', maxWidth: '240px', marginTop: '3vh'}}>Try It Out!</button>
            </Link>
        </div>
    </div> 
    
}

export default Home