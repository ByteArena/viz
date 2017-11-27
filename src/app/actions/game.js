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
    console.log(frames);
    return {
        type: "ADD_FRAME_BUCKET",
        frames,
    };
}

export function animationFrame() {
    return { type: "ANIMATION_FRAME" };
}
