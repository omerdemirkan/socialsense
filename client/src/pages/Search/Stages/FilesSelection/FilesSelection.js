import React, { useRef } from 'react';
import classes from './FilesSelection.module.css';

export default function FilesSelection(props) {

    const inputRef = useRef();

    function fileUpdatedHandler(event) {
        try {
            const file = event.target.files[0];
        
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function() {
                props.addFile({
                    name: file.name,
                    base64: reader.result
                });
            }
        } catch (err) {
            console.log(err)
        }
    }

    console.log(props.files);

    return <div className='fade-in-on-load'>
        <h2 className='page-header'>
            What Pictures Are You Considering?
        </h2>

        <div className='form-box'>

            <input 
            type='file' 
            onChange={fileUpdatedHandler}
            ref={inputRef}
            style={{display: 'none'}}
            />

            <button
            onClick={() => inputRef.current.click()}
            className='secondary-button large full-width'>Choose File</button>

            <ul className={classes.FileNameList}>
                {props.files.map(file => {
                    return <li
                    key={file.name}>
                        {file.name}
                        <button onClick={() => props.deleteFileByName(file.name)}>
                            DELETE
                        </button>
                    </li>
                })}
            </ul>
        </div>
        
    </div>
}
