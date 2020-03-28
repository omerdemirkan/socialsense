import React from 'react';
import classes from './ImageSelection.module.css';

import CircularProgress from '@material-ui/core/CircularProgress';

export default function ImageSelection(props) {

    if (props.loading || !props.imagesAreRanked) {
        return <div className='loader-box'>
            <CircularProgress />
        </div>
    }


    return <div className={classes.ImageSelection}>
        <ul className={classes.ImagesBox}>
            {props.files.map(file => {
                return <img src={file.src}/>
            })}
        </ul>
    </div>
}
