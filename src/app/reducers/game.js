// @flow

import { Bucket } from "../../internal/bucket";

type State = {
    width?: number,
    height?: number,
    mode?: string,
    bucket: Object,
};

const initialState: State = {
    bucket: new Bucket(600), // circular buffer of 600 frames
};

export function game(state: State = initialState, action: Object): State {
    switch (action.type) {
        case "RESIZE":
            return Object.assign({}, state, {
                width: action.width,
                height: action.height,
                mode: action.mode,
            });

        case "ADD_FRAME_BATCH": {
            const newState = Object.assign({}, state);
            newState.bucket.addFrames(action.frames);
            return newState;
        }

        // case "ANIMATION_FRAME": {
        //     const newState = Object.assign({}, state, {
        //         interpolationProcess: undefined,
        //     });

        //     const next2 = newState.bucket.next2();

        //     if (next2) {
        //         newState.bucket.consumeOne();

        //         newState.interpolationProcess = new Promise(
        //             (resolve: Object => void) => {
        //                 // TODO(jerome): remove 60 (fps) and rely on rAF rate
        //                 const targetFPS = 60;

        //                 // TODO(sven): tps here params
        //                 const tps = 20;
        //                 expandAndInterpolateBatch(next2, tps, targetFPS, frame =>
        //                     resolve(frame),
        //                 );
        //             },
        //         );
        //     }

        //     return newState;
        // }

        default:
            return state;
    }
}
