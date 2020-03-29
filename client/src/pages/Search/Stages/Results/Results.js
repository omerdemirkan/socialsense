import React from 'react';
import classes from './Results.module.css';

import CircularProgress from '@material-ui/core/CircularProgress';

export default function Results(props) {

    if (props.loading || props.hashtags.length === 0) {
        return <div className='loader-box'>
            <CircularProgress />
            <div>
                <h1>socialsense is thinking</h1>
                <h3>Beep Beep Boop</h3>
            </div>
            
        </div>
    }

    console.log(props.hashtags);
    
    return <div>
        <div className={classes.Main}>
            <img
            src={props.file.src}
            />
            <ul className={classes.HashtagList}>
                {props.hashtags.map((hashtag, index) => {
                    return <li>
                        @{Object.keys(hashtag)[0]}
                        <span>
                            Score: {Object.values(hashtag)[0].toFixed(3)}
                        </span>
                    </li>
                })}
            </ul>
            
        </div>
    </div>
}
