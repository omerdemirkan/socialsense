import * as actionTypes from '../actions/actionTypes';

const initialState = {
    darkMode: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case actionTypes.TOGGLE_THEME:
            return {
                ...state,
                darkMode: !state.darkMode
            }
        default: 
            return state;
    }
}