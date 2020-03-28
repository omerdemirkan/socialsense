import React from 'react';
import classes from './UsernameInput.module.css';

// Material UI
import Input from '@material-ui/core/Input';

export default function UsernameInput(props) {
    return <div className='fade-in-on-load'>

        <h2 className='page-header'>
            What Is Your Instagram Handle?
        </h2>

        <div className='form-box'>
            <div className={classes.InputWrapper}>
                <Input type='text'
                value={props.username}
                onChange={e => props.updateUsername(e.target.value)}
                className={classes.Input}
                autoFocus/>
                <span className={classes.AtSymbol}>@</span>
            </div>
            
            <button 
            className='primary-button large full-width' 
            onClick={props.nextStage}>
                Submit
            </button>
        </div>
    </div>
    
}
