// @flow

export function resize(mode: string, width: number, height: number) {
    return {
        type: "RESIZE",
        mode,
        width,
        height,
    }
}

export function addFrameBatch(frames: Array<Vizmessage>) {
    return {
        type: "ADD_FRAME_BATCH",
        frames,
    };
}
