import axios from '../../axios';
import * as actionTypes from './actionTypes';

export default function fetchRankingsAsync(image, id) {
    return dispatch => {
        dispatch(searchImagesStart())

        axios.post('https://localhost:5000/add_image', {
            id,
            image
        })
        .then()
        .catch();
    }
    // https://localhost:5000/rank_images
}

function searchImagesStart() {
    return { type: actionTypes.SEARCH_IMAGES_START }
}

function searchImagesSuccess() {
    return { type: actionTypes.SEARCH_IMAGES_SUCCESS }
}