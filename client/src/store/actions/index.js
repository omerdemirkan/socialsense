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

export function setHashtags(hashtags) {
    return {type: actionTypes.SET_HASHTAGS, hashtags}
}

export function setProfileImageSrc(src) {
    return {type: actionTypes.SET_PROFILE_IMAGE_SRC, src}
}

export function toggleTheme() {
    return {type: actionTypes.TOGGLE_THEME}
}
