import React from 'react';
import classes from './Hashtag.module.css';

export default function Hashtag({text, score}) {
    return <div className={classes.Hashtag}>
        <p className={classes.Text}>
            <span>@</span>{text}
        </p>
            <br/>
        <div className={classes.DataBox}>
            <span>Score: {score}</span>

            <button 
            className='primary-button'
            style={{float: 'right'}}
            >Add To Clipboard</button>
        </div>
    </div>
}
