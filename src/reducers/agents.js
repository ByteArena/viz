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
                    score: 0,
                },
            ];

        case "UPDATE_AGENT_SCORE": {
            let newState = [ ...state];

            newState.forEach((agent) => {
                if (agent.id === action.id) {
                    agent.score = action.value;
                }
            });

            return newState
        }

        case "CLEAR": {
            return initialState;
        }

        default:
            return state
    }
}

