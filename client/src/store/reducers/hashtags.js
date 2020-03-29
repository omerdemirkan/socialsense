import * as actionTypes from '../actions/actionTypes';

const initialState = {
    hashtags: [],
    file: null,
    loading: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case actionTypes.FETCH_HASHTAGS_START:
            return {
                ...state,
                loading: true
            }
        case actionTypes.FETCH_HASHTAGS_SUCCESS:
            return {
                file: action.file,
                loading: false,
                hashtags: action.hashtags
            }
        case actionTypes.SET_HASHTAGS:
            return {
                ...state,
                hashtags: action.hashtags
            }

        default:
            return state
    }
}

