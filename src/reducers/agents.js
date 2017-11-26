// @flow

type State = Array<Object>;

const initialState: State = [];

export function agents(
    state: State = initialState,
    action: Object,
): State {
    switch (action.type) {
        case "ADD_AGENT":

            return [
                ...state,
                {
                    id: action.id,
                    name: action.name,
                },
            ]
        default:
            return state
    }
}

