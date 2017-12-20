// @flow

export function addFrameBatch(frames: Array<Vizmessage>) {
    return {
        type: "ADD_FRAME_BUCKET",
        frames,
    };
}

export function animationFrame() {
    return { type: "ANIMATION_FRAME" };
}

export function clear() {
    return { type: "CLEAR" };
}

export function addFrame(frame: Vizmessage) {
    return {
        type: "ADD_FRAME",
        frame,
    };
}

export function eventBatch(events: Array<VizEvent>) {
    return {
        type: "EVENT_BATCH",
        events: events,
    };
}

export function eventTimeouted(eventid: string) {
    return {
        type: "EVENT_TIMEOUTED",
        eventid: eventid,
    };
}