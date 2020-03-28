import React from 'react';
import classes from './ImageSelection.module.css';

import CircularProgress from '@material-ui/core/CircularProgress';

export default function ImageSelection(props) {
    return <div>
        {props.loading ?
        <div className='loader-box'>
            <CircularProgress />
        </div>
        
        : null}
    </div>
}
