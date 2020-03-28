import React from 'react';
import classes from './UsernameInput.module.css';

export default function UsernameInput() {
    return <div>

        <h2 className='page-header'>
            What Is Your Instagram Handle?
        </h2>

        <div className='form-box'>
            <input type='text'/>
            <button>Submit</button>
        </div>
    </div>
}
