import axios from '../../axios';
import * as actionTypes from './actionTypes';

export default function fetchRankingsAsync() {
    return dispatch => {
        console.log('fetching rankings')
        dispatch(rankImagesStart())

        axios.get('/rank_images')
        .then(res => {
            dispatch(rankImagesSuccess(res.data.scores))
        })
        .catch();
    }
    // https://localhost:5000/rank_images
}

function rankImagesStart() {
    return { type: actionTypes.RANK_IMAGES_START }
}

function rankImagesSuccess(rankings) {
    return { type: actionTypes.RANK_IMAGES_SUCCESS, rankings }
}