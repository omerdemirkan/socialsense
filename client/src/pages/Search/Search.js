import React from 'react';
import classes from './Search.module.css';

import axios from 'axios'

// Stages
import UsernameInput from './Stages/UsernameInput/UsernameInput';
import FilesSelection from './Stages/FilesSelection/FilesSelection';
import ImageSelection from './Stages/ImageSelection/ImageSelection';
import Results from './Stages/Results/Results';

// Redux
import { connect } from 'react-redux';
import { 
    updateUsername, 
    updateStage, 
    addFile,
    deleteFileById,
    fetchRankingsAsync,
    fetchHashtagsAsync,
    setHashtags,
    setProfileImageSrc
} from '../../store/actions/index';

function Search(props) {

    function fetchHashtagsByFile(file) {
        props.onFetchHashtags(props.username, file);
        props.onUpdateStage(4);
    }

    function fetchProfileImageSrc() {
        axios.get(`https://www.instagram.com/${props.username}/?__a=1`)
        .then(res => {
            const src = res.data.graphql.user.profile_pic_url;
            console.log(src);
            props.onSetProfileImageSrc(src)

        })

        // props.onSetProfileImageSrc('https://instagram.fhyd1-2.fna.fbcdn.net/v/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ht=instagram.fhyd1-2.fna.fbcdn.net&_nc_ohc=BPpspOIm5WgAX_DwIQk&oh=c3a6c429848f5ebea92110acd17c6472&oe=5EA8E30F&ig_cache_key=YW5vbnltb3VzX3Byb2ZpbGVfcGlj.2')
    }

    let stage = null;

    switch(props.stage) {
        case 1:
            stage = <UsernameInput
            username={props.username}
            updateUsername={props.onUpdateUsername}
            nextStage={() => {
                props.onUpdateStage(2)
                fetchProfileImageSrc();
            }}
            />
            break;
        case 2:
            stage = <FilesSelection
            addFile={props.onAddFile}
            files={props.files}
            deleteFileById={props.onDeleteFileById}
            fileCounter={props.fileCounter}
            nextStage={() => props.onUpdateStage(3)}
            fetchRankings={props.onFetchRankings}
            />
            break;

        case 3:
            stage = <ImageSelection
            imagesAreRanked={props.imagesAreRanked}
            loading={props.rankImagesLoading}
            files={props.files}
            fetchHashtagsByFile={fetchHashtagsByFile}
            />
            break;
        case 4:
            stage = <Results
            loading={props.hashtagsLoading}
            hashtags={props.hashtags}
            file={props.hashtagFile}
            setHashtags={props.onSetHashtags}
            profileImageSrc={props.profileImageSrc}
            handle={props.username}
            />
    }


    return <div>

        {stage}

        
    </div>
}

const mapStateToProps = state => {
    return {
        username: state.search.username,
        stage: state.search.stage,
        files: state.search.files,
        fileCounter: state.search.fileCounter,
        rankImagesLoading: state.search.rankImagesLoading,
        imagesAreRanked: state.search.imagesAreRanked,

        hashtagsLoading: state.hashtags.loading,
        hashtags: state.hashtags.hashtags,
        hashtagFile: state.hashtags.file,
        profileImageSrc: state.hashtags.profileImageSrc
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onUpdateUsername: text => dispatch(updateUsername(text)),
        onUpdateStage: stage => dispatch(updateStage(stage)),
        onAddFile: file => dispatch(addFile(file)),
        onDeleteFileById: id => dispatch(deleteFileById(id)),
        onFetchRankings: () => dispatch(fetchRankingsAsync()),
        onFetchHashtags: (username, file) => dispatch(fetchHashtagsAsync(username, file)),
        onSetHashtags: hashtags => {
            // console.log(hashtags)
            dispatch(setHashtags(hashtags))
        },
        onSetProfileImageSrc: src => {
            console.log(src);
            dispatch(setProfileImageSrc(src))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
