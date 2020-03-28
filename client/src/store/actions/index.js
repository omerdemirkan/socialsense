import * as actionTypes from './actionTypes'

export {default as fetchRankingsAsync} from './fetchRankingsAsync';
export {default as fetchHashtagsAsync} from './fetchHashtagsAsync';

export function updateUsername(text) {
    return { type: actionTypes.UPDATE_USERNAME, text }
}

export function updateStage(stage) {
    return { type: actionTypes.UPDATE_STAGE, stage }
}

export function addFile(file) {
    return {type: actionTypes.ADD_FILE, file}
}

export function deleteFileById(id) {
    return { type: actionTypes.DELETE_FILE, id }
}
