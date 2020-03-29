import React from 'react';
import classes from './Hashtag.module.css';

export default function Hashtag({text, score, inspected, onInspect}) {
    return <div 
    className={classes.Hashtag + ' fade-in-on-load'} 
    onClick={onInspect}
    style={!inspected ? {height: '20px'}: null}>
        <p className={classes.Text}>
            <span>@</span>{text}
        </p>
            <hr/>
        <div className={classes.DataBox}>
            <span>Score: {score}</span>

            <button 
            className='primary-button'
            >Delete</button>
        </div>
    </div>
}
