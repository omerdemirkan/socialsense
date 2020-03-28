import * as actionTypes from '../actions/actionTypes';

const initialState = {
    username: ''
}

export default function searchReducer(state = initialState, action) {
    switch(action.type) {
        case actionTypes.UPDATE_USERNAME:
            return {
                ...state,
                username: action.username
            }
        default: 
            return state;
    }
}