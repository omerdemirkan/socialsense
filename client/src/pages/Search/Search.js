import React from 'react';
import classes from './Search.module.css';

// Stages
import UsernameInput from './Stages/UsernameInput/UsernameInput';
import FilesSelection from './Stages/FilesSelection/FilesSelection';

// Redux
import { connect } from 'react-redux';
import { updateUsername } from '../../store/actions/index';

function Search(props) {
    return <div>
        <UsernameInput
        username={props.username}
        updateUsername={props.onUpdateUsername}/>
        <FilesSelection/>
    </div>
}

const mapStateToProps = state => {
    return {
        username: state.search.username
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onUpdateUsername: text => dispatch(updateUsername(text))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
