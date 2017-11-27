// @flow

import Deque from "denque";

export class Bucket {
    _frames: Deque;

    constructor() {
        this._frames = new Deque();
    }

    addFrames(frames: Frame[]) {
        frames.map(frame => this._frames.push(frame));
    }

    next2(): ?[Frame, Frame] {
        const next1 = this._frames.peekAt(0);
        const next2 = this._frames.peekAt(1);
        if (next1 === undefined || next2 === undefined) {
            return undefined;
        }

        return [next1, next2];
    }

    next3(): ?[Frame, Frame, Frame] {
        const next1 = this._frames.peekAt(0);
        const next2 = this._frames.peekAt(1);
        const next3 = this._frames.peekAt(2);
        if (next1 === undefined || next2 === undefined || next3 === undefined) {
            return undefined;
        }

        return [next1, next2, next3];
    }

    consumeOne(): ?Frame {
        return this._frames.shift();
    }
}

export class Frame {
    _payload: Vizmessage;
    _num: number;

    constructor(payload: Vizmessage, num: number) {
        this._payload = payload;
        this._num = num;
    }

    getPayload(): Vizmessage {
        return this._payload;
    }

    static fromVizmessage(msg: Vizmessage, index: number): Frame {
        return new Frame(msg, index);
    }
}
