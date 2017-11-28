// @flow

export function addFrameBatch(frames: Array<Vizmessage>) {
    return {
        type: "ADD_FRAME_BUCKET",
        frames,
    };
}

export function processInterpolation() {
    return { type: "PROCESS_INTERPOLATION" };
}

export function addFrame(frame: Vizmessage) {
    return {
        type: "ADD_FRAME",
        frame,
    };
}

