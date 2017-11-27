// @flow

type State = boolean;

const initialState: State = false;

export function status(
    state: State = initialState,
    action: Object,
): State {
    switch (action.type) {
        case "UPDATE_STATUS":
            return action.status;
        default:
            return state
    }
}

