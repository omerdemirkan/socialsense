import React, { useState }  from 'react';
import classes from './Results.module.css';

import ScrollUpOnMount from '../../../../components/ScrollUpOnMount/ScrollUpOnMount';

import CircularProgress from '@material-ui/core/CircularProgress';
import loadingGif from '../../../../images/gifs/loading.gif'
import {CopyToClipboard} from 'react-copy-to-clipboard';

import Hashtag from '../../../../components/Hashtag/Hashtag';

// Material UI
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default function Results(props) {

    const [inspectedHashtag, setInspectedHashtag] = useState('');
    const [copyToClipboardModal, setCopyToClipboardModal] = useState(false);

    function deleteHashtag(hashtag) {
        const newHashtags = props.hashtags.filter(hashtagObject => {
            return Object.keys(hashtagObject)[0] !== hashtag
        })
        props.setHashtags(newHashtags)
    }

    if (props.loading || props.hashtags.length === 0) {
        return <div className='loader-box'>
            <img 
            src={loadingGif}
            style={{width: '150px'}}/>
            {/* <CircularProgress /> */}
            <div>
                <h1>socialsense.ai is thinking</h1>
                <h3>Beep Beep Boop</h3>
            </div>
            
        </div>
    }

    let delay = 0.2;
    
    return <div className=' fade-in-on-load'>
        <ScrollUpOnMount/>

        <div className={classes.Main}>
            
            <img 
            src={props.profileImageSrc}
            className={classes.ProfilePic}/>

            <span className={classes.Handle}>
                @<span className='accented-text'>{props.handle}</span>
            </span>

            <div className={classes.DotsBox}>
                <div></div>
                <div></div>
                <div></div>
            </div>

            <img
            src={props.file.src}
            className={classes.Image}
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
            
            <CopyToClipboard text={
                '#' + 
                props.hashtags.map(
                hashtag => Object.keys(hashtag)[0])
                .join(' #')
            }
            onCopy={() => setCopyToClipboardModal(true)}>

                <button className='primary-button large full-width'>Copy To Clipboard</button>
            </CopyToClipboard>

        </div>

        <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={copyToClipboardModal}
        autoHideDuration={3000}
        onClose={() => setCopyToClipboardModal(false)}
        message="Copied To Clipboard"
        action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => setCopyToClipboardModal(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
        }
        />

    </div>
}
