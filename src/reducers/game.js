// @flow

import { Bucket } from "../internal/bucket";
import expandAndInterpolateBatch from "../internal/expandinterpolate";

type State = {
    width?: number,
    height?: number,
    mode?: string,
    bucket: Object,
    interpolationProcess?: Promise<Object>,
};

const initialState: State = {
    bucket: new Bucket(),
    interpolationProcess: undefined,
};

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

        case "ADD_FRAME_BUCKET": {
            const newState = Object.assign({}, state);

            newState.bucket.addFrames(action.frames);

            return newState;
        }

        case "ANIMATION_FRAME": {
            const newState = Object.assign({}, state, {
                interpolationProcess: undefined,
            });

            const next3 = newState.bucket.next3();

            if (next3) {
                newState.bucket.consumeOne();

                newState.interpolationProcess = new Promise((resolve: (Object) => void) => {

                    // TODO(jerome): remove 60 (fps) and rely on rAF rate
                    // TODO(sven): tps here params
                    const tps = 20;
                    expandAndInterpolateBatch(next3, tps, 60, (frame) => {
                        resolve(frame);
                    });
                });
            }

            return newState;
        }

        default:
            return state
    }
}

