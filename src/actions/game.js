// @flow

export function resize(mode: string, width: number, height: number) {
    return {
        type: "RESIZE",
        mode,
        width,
        height,
    }
}
export function addFrame(frame: Vizmessage) {
    return {
        type: "ADD_FRAME",
        frame,
    };
}
