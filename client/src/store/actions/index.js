import * as actionTypes from './actionTypes'

export {default as addImageAsync} from './fetchRankingsAsync';

export function updateUsername(text) {
    return { type: actionTypes.UPDATE_USERNAME, text }
}

export function updateStage(stage) {
    return { type: actionTypes.UPDATE_STAGE, stage }
}

export function addFile(file) {
    return {type: actionTypes.ADD_FILE, file}
}

export function deleteFileByName(fileName) {
    return { type: actionTypes.DELETE_FILE, fileName }
}
