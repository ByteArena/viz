// @flow

type State = {
    frame?: Object,
    events: Array<VizEvent>,
};

const initialState: State = {
    events: [],
};

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

        case "EVENT_BATCH": {

            return Object.assign({}, state, {
                events: [
                    ...action.events,
                    ...state.events,
                ].slice(0, 10),
            });
        }

        case "EVENT_TIMEOUTED": {
            return Object.assign({}, state, {
                events: state.events.filter(ev => ev.Id != action.eventid),
            });
        }

        default:
            return state;
    }
}
