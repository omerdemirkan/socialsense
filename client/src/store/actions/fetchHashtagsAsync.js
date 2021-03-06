import * as actionTypes from './actionTypes';
import axios from '../../axios';

export default function fetchHashtagsAsync(username, file) {
    return dispatch => {
        dispatch(fetchHashtagsStart())

        axios.post('/rank_hashtags', {
            id: file.id,
            username
        })
        .then(res => {
            dispatch(fetchHashtagsSuccess(file, res.data.hashtags, res.data.engagement))
        })
        .catch();
    }
}

function fetchHashtagsStart() {
    return {type: actionTypes.FETCH_HASHTAGS_START}
}

function fetchHashtagsSuccess(file, hashtags, engagement) {
    return {
        type: actionTypes.FETCH_HASHTAGS_SUCCESS, 
        file, 
        hashtags,
        engagement
    }

}