import React from 'react';
import classes from './Search.module.css';

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
    fetchHashtagsAsync
} from '../../store/actions/index';

function Search(props) {

    function fetchHashtagsByFile(file) {
        props.onFetchHashtags(props.username, file);
        props.onUpdateStage(4);
    }

    let stage = null;

    switch(props.stage) {
        case 1:
            stage = <UsernameInput
            username={props.username}
            updateUsername={props.onUpdateUsername}
            nextStage={() => props.onUpdateStage(2)}
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

        hashtagsLoading: state.hashtags.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onUpdateUsername: text => dispatch(updateUsername(text)),
        onUpdateStage: stage => dispatch(updateStage(stage)),
        onAddFile: file => dispatch(addFile(file)),
        onDeleteFileById: id => dispatch(deleteFileById(id)),
        onFetchRankings: () => dispatch(fetchRankingsAsync()),
        onFetchHashtags: (file, username) => dispatch(fetchHashtagsAsync(username, file))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
