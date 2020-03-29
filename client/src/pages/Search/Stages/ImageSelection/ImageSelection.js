import React from 'react';
import classes from './ImageSelection.module.css';

import CircularProgress from '@material-ui/core/CircularProgress';

export default function ImageSelection(props) {

    if (props.loading || !props.imagesAreRanked) {
        return <div className='loader-box'>
            <CircularProgress />
        </div>
    }


    let delay = 0;
    return <div className={classes.ImageSelection}>
        <h2 className='page-header'>Ranked from highest to lowest expected engagement</h2>
        <ul className={classes.ImagesList}>

            {props.files.map(file => {
                console.log(file)
                delay += .05;
                return <li 
                className='fade-in-on-load' 
                style={{animationDelay: delay + 's'}}>
                    <span>{file.name}</span>

                    <span
                    style={{float: 'right'}}
                    >
                        Score: {file.score}
                    </span>

                    <img 
                    src={file.src}/>

                    
                    <button
                    className='primary-button large full-width'
                    style={{margin: '0'}}
                    onClick={() => props.fetchHashtagsByFile(file)}
                    >Get Hashtags!</button>
                </li>

            })}

        </ul>
    </div>
}
