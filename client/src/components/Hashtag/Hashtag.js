import React from 'react';
import classes from './Hashtag.module.css';

export default function Hashtag({text, score, inspected, onInspect, onCloseInspect}) {
    return <div 
    className={classes.Hashtag + ' fade-in-on-load'} 
    style={!inspected ? {height: '20px', transition: 'height 0.2s ease'}: null}>
        <p className={classes.Text}>
            <span 
            style={inspected ? {color: 'var(--accent)'} : null}
            >@</span>
            {text}
        </p>

        <span className={classes.ToggleBox}
        onClick={!inspected ? onInspect : onCloseInspect}>
            <div 
            className={classes.ToggleSlab1}
            style={inspected ? {width: '26px'} : null}></div>
            <div 
            className={classes.ToggleSlab2}
            style={inspected ? {width: '26px'} : null}></div>
        </span>

        <hr/>

        <div className={classes.DataBox}>
            <span>Score: {score}</span>

            <button 
            className='primary-button'
            >Delete</button>
        </div>
    </div>
}
