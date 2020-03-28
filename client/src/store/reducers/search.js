import * as actionTypes from '../actions/actionTypes';

const initialState = {
    username: '',
    stage: 1,
    files: []
}

export default function searchReducer(state = initialState, action) {
    switch(action.type) {
        case actionTypes.UPDATE_USERNAME:
            return {
                ...state,
                username: action.text
            }
        case actionTypes.UPDATE_STAGE:
            return {
                ...state,
                stage: action.stage
            }
        case actionTypes.ADD_FILE:
            return {
                ...state,
                files: [...state.files, action.file]
            }
        default: 
            return state;
    }
}