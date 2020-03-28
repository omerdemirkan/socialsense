import React from 'react';
import classes from './ImageSelection.module.css';

import CircularProgress from '@material-ui/core/CircularProgress';

export default function ImageSelection(props) {

    if (props.loading || !props.imagesAreRanked) {
        return <div className='loader-box'>
            <CircularProgress />
        </div>
    }


    let delay = .2;
    return <div className={classes.ImageSelection}>
        <h2 className='page-header'>Boojie</h2>
        <ul className={classes.ImagesList}>
            {props.files.map(file => {
                delay += .05;
                return <li 
                className='fade-in-on-load' 
                style={{animationDelay: delay + 's'}}>
                    <img 
                    src={file.src}/>
                </li>
            })}
        </ul>
    </div>
}
