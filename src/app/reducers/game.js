// @flow

import deepcopy from "deepcopy";
import { Bucket } from "../../internal/bucket";
import expandAndInterpolateBatch from "../../internal/expandinterpolate";

var i = 0;

type onFrame = (Object) => void;

type State = {
    frame?: Object,
    interpolationProcess?: (onFrame) => void,
};

const initialState: State = {
    bucket: new Bucket(),
    interpolationProcess: undefined,
};

export function game(state: State = initialState, action: Object): State {
    switch (action.type) {
        case "ADD_FRAME": {
            const newState = deepcopy(state);
            newState.frame = action.frame;

            return newState;
        }

        case "ADD_FRAME_BUCKET": {
            const newState = deepcopy(state);
            newState.bucket.addFrames(action.frames);

            return newState;
        }

        case "PROCESS_INTERPOLATION": {
            delete state.interpolationProcess;

            const newState = deepcopy(state);
            const next3 = newState.bucket.next3();

            if (next3) {
                newState.bucket.consumeOne();

                newState.interpolationProcess = function runInterpolationProcess(cb: onFrame) {

                    // TODO(jerome): remove 60 (fps) and rely on rAF rate
                    // TODO(sven): tps here params
                    const tps = 5;
                    expandAndInterpolateBatch(next3, tps, 60, cb);
                };

                return newState;
            }

            return state;
        }


        default:
            return state;
    }
}
