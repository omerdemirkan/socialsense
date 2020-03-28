import React from 'react';
import classes from './FilesSelection.module.css';

export default function FilesSelection() {
    return <div>
        <h2 className='page-header'>
            What Pictures Are You Considering?
        </h2>

        <div className='form-box'>
            <input type='file'/>
        </div>
    </div>
}
