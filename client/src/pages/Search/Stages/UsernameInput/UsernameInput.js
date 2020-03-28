import React from 'react';
import classes from './UsernameInput.module.css';

export default function UsernameInput(props) {
    return <div>

        <h2 className='page-header'>
            What Is Your Instagram Handle?
        </h2>
        
        <div className='form-box'>
            <input type='text'
            value={props.username}
            onChange={e => props.updateUsername(e.target.value)}/>
            <button>Submit</button>
        </div>
    </div>
}
