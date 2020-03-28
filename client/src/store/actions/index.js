import * as actionTypes from './actionTypes'

export function updateUsername(text) {
    return { type: actionTypes.UPDATE_USERNAME, text }
}

export function updateStage(stage) {
    return { type: actionTypes.UPDATE_STAGE, stage }
}

export function addFile(file) {
    return {type: actionTypes.ADD_FILE, file}
}