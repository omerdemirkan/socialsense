import axios from '../../axios';
import * as actionTypes from './actionTypes';

export default function fetchRankingsAsync(image, id) {
    return dispatch => {
        dispatch(rankImagesStart())

        axios.get('/rank_images')
        .then(res => {
            rankImagesSuccess(res.data)
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