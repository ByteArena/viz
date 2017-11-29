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
                    isAlive: true,
                },
            ];

        case "UPDATE_AGENT_SCORE": {
            let updated = false;
            let newState = [ ...state];

            newState.forEach((agent) => {
                if (agent.id === action.id && agent.score !== action.value) {
                    updated = true;
                    agent.score = action.value;
                }
            });

            if (updated === true) {
                return newState;
            } else {
                return state;
            }
        }

        case "UPDATE_AGENT_IS_ALIVE": {
            let updated = false;
            let newState = [ ...state];

            newState.forEach((agent) => {
                if (agent.id === action.id && agent.isAlive !== action.value) {
                    updated = true;
                    agent.isAlive = action.value;
                }
            });

            if (updated === true) {
                return newState;
            } else {
                return state;
            }
        }

        case "CLEAR": {
            return initialState;
        }

        default:
            return state
    }
}

