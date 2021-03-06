import React, { useRef, useState } from 'react';
import classes from './FilesSelection.module.css';

import ScrollUpOnMount from '../../../../components/ScrollUpOnMount/ScrollUpOnMount';

// axios
import axios from '../../../../axios';

// Material-UI
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';

export default function FilesSelection(props) {

    const [inspectedImage, setInspectedImage] = useState('')

    const inputRef = useRef();

    function rankButtonClickedHandler() {
        props.fetchRankings();
        props.nextStage()
    }

    function fileUpdatedHandler(event) {
        try {
            const file = event.target.files[0];

            if (file.size / Math.pow(2, 20) < 5) {
                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = function(e) {

                    axios.post('/add_image', {
                        id: props.fileCounter,
                        image: reader.result.split(',')[1]
                    })
                    .then(res => {
                        // console.log(res);
                    })
                    .catch(err => {
                        console.error(err);
                    });

                    props.addFile({
                        name: file.name,
                        id: props.fileCounter,
                        base64: reader.result.split(',')[1],
                        src: e.target.result
                    });

                }

            }

        } catch (err) {
            console.log(err)
        }
    }

    function fileDeletedHandler(file) {
        axios.post('/delete_image', {
            id: file.id
        })
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.error(err);
        });

        props.deleteFileById(file.id)
    }

    // console.log(props.files);

    return <div className='fade-in-on-load'>
        <ScrollUpOnMount/>  
        <h2 className='page-header'>
            What Pics Are You Considering?
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
            className='secondary-button large full-width'>Add File</button>

            <ul className={classes.FileNameList}>
                {props.files.map(file => {

                    const isInspected = file.name === inspectedImage;

                    const toggle = () => setInspectedImage(isInspected ? '' : file.name)

                    return <li
                    style={!isInspected ? {height: '40px', transition: 'height 0.3s ease'} : null}
                    key={file.name}
                    className='fade-in-on-load'>
                        <span onClick={toggle}>{file.name}</span>
                        <ClearRoundedIcon onClick={() => fileDeletedHandler(file)}/>
                        
                        <img 
                        src={file.src}
                        style={{width: '100%', marginTop: '20px'}}/>
                    </li>
                })}
            </ul>

            {props.files.length > 0 ?
                <button
                className='primary-button large full-width fade-in-on-load'
                onClick={rankButtonClickedHandler}>Submit</button>
            : null}
        </div>
        
    </div>
}
