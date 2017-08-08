import Deque from 'denque';

export class Bucket {
    private frames: Deque;

    constructor() {
        this.frames = new Deque();
    }

    public addFrames(frames: Frame[]) {
        frames.map(frame => this.frames.push(frame));
        // console.log(this.frames.length, "in bucket");
    }

    public next3(): [Frame, Frame, Frame] | undefined {
        const next1 = this.frames.peekAt(0);
        const next2 = this.frames.peekAt(1);
        const next3 = this.frames.peekAt(2);
        if (next1 === undefined || next2 === undefined || next3 === undefined) {
            return undefined;
        }

        return [next1, next2, next3];
    }

    public consumeOne() : Frame|undefined {
        return this.frames.shift();
    }
}

export class Frame {
    private payload: Vizmessage
    private num: number

    constructor(payload: Vizmessage, num: number) {
        this.payload = payload;
        this.num = num;
    }

    public getPayload(): Vizmessage {
        return this.payload;
    }

    public static fromVizmessage(msg: Vizmessage, index: number) : Frame {
        return new Frame(msg, index);
    }
}
