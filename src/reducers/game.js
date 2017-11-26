// @flow

type State = any;
const initialState: State = null;

export function game(
    state: State = initialState,
    action: Object,
): State {
    switch (action.type) {
        case "RESIZE":

            return {
                width: action.width,
                height: action.height,
                mode: action.mode,
            }

        default:
            return state
    }
}

