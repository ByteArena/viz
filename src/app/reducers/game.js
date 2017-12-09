// @flow

type State = {
    frame?: Object,
};

const initialState: State = {};

export function game(state: State = initialState, action: Object): State {
    switch (action.type) {
        case "ADD_FRAME": {
            return Object.assign({}, state, {
                frame: action.frame,
            });
        }

        case "CLEAR": {
            return Object.assign({}, state, {
                frame: undefined,
            });
        }

        default:
            return state;
    }
}
