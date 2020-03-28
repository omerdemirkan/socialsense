import * as actionTypes from './actionTypes';
import axios from '../../axios';

export default function fetchHashtagsAsync(file) {
    return dispatch => {
        dispatch(fetchHashtagsStart())

        axios.post('/rank_hashtags')
        .then(res => {
            console.log(res.data);
            dispatch(fetchHashtagsSuccess(file, res.data.hashtags))
        })
        .catch();
    }
}

function fetchHashtagsStart() {
    return {type: actionTypes.FETCH_HASHTAGS_START}
}

function fetchHashtagsSuccess(file, hashtags) {
    return {type: actionTypes.FETCH_HASHTAGS_SUCCESS, file, hashtags}

}