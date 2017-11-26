// @flow

type State = {
    width: ?number,
    height: ?number,
    mode: ?string,
    frame: ?Vizmessage,
};

const initialState: State = {};

export function game(
    state: State = initialState,
    action: Object,
): State {
    switch (action.type) {
        case "RESIZE":

            return Object.assign({}, state, {
                width: action.width,
                height: action.height,
                mode: action.mode,
            });

        case "ADD_FRAME":
            return Object.assign({}, state, {
                frame: action.frame,
            });

        default:
            return state
    }
}

