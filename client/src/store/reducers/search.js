import * as actionTypes from '../actions/actionTypes';

const initialState = {
    username: '',
    stage: 1,
    files: [],
    searchImagesLoading: false,
    fileCounter: 0
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
                files: [...state.files, action.file],
                fileCounter: state.fileCounter + 1
            }
        case actionTypes.DELETE_FILE:
            return {
                ...state,
                files: state.files.filter(file => file.name !== action.fileName)
            }
        case actionTypes.SEARCH_IMAGES_START:
            return {
                ...state,
                searchImagesLoading: true
            }
        default: 
            return state;
    }
}