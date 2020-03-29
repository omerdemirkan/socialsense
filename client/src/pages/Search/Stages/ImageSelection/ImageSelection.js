import React from 'react';
import classes from './ImageSelection.module.css';

import ScrollUpOnMount from '../../../../components/ScrollUpOnMount/ScrollUpOnMount';

import CircularProgress from '@material-ui/core/CircularProgress';
import loadingGif from '../../../../images/gifs/loading.gif';

export default function ImageSelection(props) {

    if (props.loading || !props.imagesAreRanked) {
        return <div className='loader-box'>
            <img 
            src={loadingGif}
            style={{width: '150px'}}/>
            {/* <CircularProgress /> */}
        </div>
    }

    let delay = 0;
    return <div className={classes.ImageSelection + ' fade-in-on-load'}>

        <ScrollUpOnMount/>

        <div style={{margin: 'auto', width: '90vw', maxWidth: '450px'}}>
            <h2 className='page-header'>Here are those pics ranked from highest to lowest expected engagement</h2>
            <h3 
            className='fade-in-on-load'
            style={{textAlign: 'center', animationDelay: '.5s', animationDuration: '1s'}}>Psst! ↓ This is the Best One!</h3>
        </div>

        <ul className={classes.ImagesList}>

            {props.files.map(file => {
                delay += .05;
                return <li 
                className='fade-in-on-load' 
                style={{animationDelay: delay + 's'}}>
                    <span style={{margin: '0 10px'}}>{file.name}</span>

                    <span
                    style={{float: 'right', margin: '0 10px'}}
                    >
                        Popularity Score: {file.score.toFixed(3)}
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
