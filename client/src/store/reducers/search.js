import * as actionTypes from '../actions/actionTypes';

const initialState = {
    username: '',
    stage: 1,
    files: [],
    rankImagesLoading: false,
    fileCounter: 0,
    imagesAreRanked: false
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

            const newFile = {...action.file}
            newFile.id = state.fileCounter;
            return {
                ...state,
                files: [...state.files, newFile],
                fileCounter: state.fileCounter + 1
            }
        case actionTypes.DELETE_FILE:
            return {
                ...state,
                files: state.files.filter(file => file.id !== action.id)
            }
        case actionTypes.RANK_IMAGES_START:
            return {
                ...state,
                rankImagesLoading: true
            }
        case actionTypes.RANK_IMAGES_SUCCESS:
            console.log(action.rankings);
            const rankingIds = action.rankings.map(ranking => ranking.id);

            const newFiles = [...state.files].map(fileObject => {
                return {
                    ...fileObject,
                    score: action.rankings[rankingIds.indexOf(fileObject.id)].score
                }
            })

            newFiles.sort((a, b) => b.score - a.score)
            console.log(newFiles);

            return {
                ...state,
                files: newFiles,
                imagesAreRanked: true
            }
        default: 
            return state;
    }
}