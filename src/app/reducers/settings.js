// @flow

const MAX_ZOOM = 100;
const MIN_ZOOM = 0;

type State = {
    camera: string,
    cameratarget: ?string,
    zoom: number,
};

const initialState: State = {
    camera: "default",
    cameratarget: null,
    zoom: 50,
};

export function settings(
    state: State = initialState,
    action: Object,
): State {

    switch (action.type) {

        case "UPDATE_ZOOM":
            return Object.assign({}, state, {
                zoom: boundedZoom(action.value),
            });

        case "ADD_ZOOM":
            return Object.assign({}, state, {
                zoom: boundedZoom(action.value + state.zoom),
            });

        case "UPDATE_CAMERA":
            return Object.assign({}, state, {
                camera: action.value,
            });

        case "SET_CAMERA_TARGET":
            return Object.assign({}, state, {
                cameratarget: action.value,
            });

        case "RESTORE":
            return action.settings

        default:
            return state
    }
}

function boundedZoom(value: number): number {
    if (value >= MAX_ZOOM) {
        return MAX_ZOOM;
    }

    if (value < MIN_ZOOM) {
        return MIN_ZOOM;
    }

    return value;
}
