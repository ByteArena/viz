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
        type: "ADD_FRAME_BUCKET",
        frames,
    };
}

export function animationFrame() {
    return { type: "ANIMATION_FRAME" };
}

export function addFrame(frame: Vizmessage) {
    return {
        type: "ADD_FRAME",
        frame,
    };
}

