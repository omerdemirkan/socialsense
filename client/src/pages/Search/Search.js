import React from 'react';
import classes from './Search.module.css';

// Stages
import UsernameInput from './Stages/UsernameInput/UsernameInput';
import FilesSelection from './Stages/FilesSelection/FilesSelection';

// Redux
import { connect } from 'react-redux';
import { 
    updateUsername, 
    updateStage, 
    addFile,
    deleteFileByName
} from '../../store/actions/index';

function Search(props) {


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
            deleteFileByName={props.onDeleteFileByName}
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
        files: state.search.files
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onUpdateUsername: text => dispatch(updateUsername(text)),
        onUpdateStage: stage => dispatch(updateStage(stage)),
        onAddFile: file => dispatch(addFile(file)),
        onDeleteFileByName: fileName => dispatch(deleteFileByName(fileName))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
