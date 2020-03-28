import React from 'react';
import classes from './FilesSelection.module.css';

export default function FilesSelection(props) {

    function fileUpdatedHandler(event) {
        props.addFile(event.target.files[0])
    }

    return <div>
        <h2 className='page-header'>
            What Pictures Are You Considering?
        </h2>

        <div className='form-box'>
            <input type='file' onChange={fileUpdatedHandler}/>
        </div>
    </div>
}
