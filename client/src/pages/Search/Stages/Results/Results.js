import React from 'react';
import classes from './Results.module.css';

import CircularProgress from '@material-ui/core/CircularProgress';

export default function Results(props) {

    if (props.loading) {
        return <div className='loader-box'>
            <CircularProgress />
            <div>
                <h1>socialsense is thinking</h1>
                <h3>Beep Beep Boop</h3>
            </div>
            
        </div>
    }
    return <div>
         
    </div>
}
