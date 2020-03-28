import * as actionTypes from './actionTypes'

export function updateUsername(text) {
    return { type: actionTypes.UPDATE_USERNAME, text }
}