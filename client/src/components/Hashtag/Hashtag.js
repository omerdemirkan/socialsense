import React from 'react';
import classes from './Hashtag.module.css';

export default function Hashtag(props) {
    return <div 
    className={classes.Hashtag + ' fade-in-on-load'} 
    style={!props.inspected ? {height: '20px', transition: 'height 0.2s ease', animationDelay: props.delay}: {animationDelay: props.delay}}>
        <p 
        className={classes.Text}
        onClick={!props.inspected ? props.onInspect : props.onCloseInspect}>
            <a 
            href={`https://www.instagram.com/explore/tags/${props.text}/`}
            target='_blank'>
                <span 
                style={props.inspected ? {color: 'var(--accent)'} : null}
                >#</span>

                {props.text}

                <div className={props.inspected ? classes.LinkNotifier : classes.Invisible} style={{color: 'var(--primary)'}}>
                    See What's Popular For <span
                    style={{color: 'var(--accent)'}}>#{props.text}</span>
                </div>
            </a>
            
        </p>

        <span className={classes.ToggleBox}
        onClick={!props.inspected ? props.onInspect : props.onCloseInspect}>
            <div 
            className={classes.ToggleSlab1}
            style={props.inspected ? {width: '26px'} : null}></div>
            <div 
            className={classes.ToggleSlab2}
            style={props.inspected ? {width: '26px'} : null}></div>
        </span>

        <hr/>

        <div className={classes.DataBox}> 
            <span>Predicted Engagement Increase: <span className='accented-text'>{(props.score * 100).toFixed(2)}%</span></span>

            <button 
            className='primary-button'
            onClick={props.delete}>Delete</button>
        </div>
    </div>
}
