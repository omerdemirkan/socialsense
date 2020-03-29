import React, { useState }  from 'react';
import classes from './Results.module.css';

import CircularProgress from '@material-ui/core/CircularProgress';

import Hashtag from '../../../../components/Hashtag/Hashtag';

export default function Results(props) {

    const [inspectedHashtag, setInspectedHashtag] = useState('');

    function deleteHashtag(hashtag) {
        const newHashtags = props.hashtags.filter(hashtagObject => {
            return Object.keys(hashtagObject)[0] !== hashtag
        })
        props.setHashtags(newHashtags)
    }

    if (props.loading || props.hashtags.length === 0) {
        return <div className='loader-box'>
            <CircularProgress />
            <div>
                <h1>socialsense is thinking</h1>
                <h3>Beep Beep Boop</h3>
            </div>
            
        </div>
    }
    
    return <div className=' fade-in-on-load'>
        <div className={classes.Main}>
            <img
            src={props.file.src}
            />
            <ul className={classes.HashtagList}>
                {props.hashtags.map((hashtag, index) => {
                    const text = Object.keys(hashtag)[0];
                    const score = Object.values(hashtag)[0];
                    return <li>
                        <Hashtag
                        text={text}
                        score={score}
                        inspected={text === inspectedHashtag}
                        onInspect={() => setInspectedHashtag(text)}
                        onCloseInspect={() => setInspectedHashtag('')}
                        delete={() => deleteHashtag(text)}/>
                    </li>
                })}
            </ul>
            
        </div>
    </div>
}
