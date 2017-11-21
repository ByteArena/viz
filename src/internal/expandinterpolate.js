// @flow

import { Frame } from "./bucket";
import { Vector2 } from "bytearena-sdk-vector2";

function objectInfoToProps(objectinfo: VizObjectMessage) {
    return {
        id: objectinfo.Id,
        velocity: Vector2.fromArray(objectinfo.Velocity),
        position: Vector2.fromArray(objectinfo.Position),
        orientation: objectinfo.Orientation,
    };
}

export default function(
    next3: [Frame, Frame, Frame],
    tps: number,
    targetfps: number,
    sendFrame: (message: Object) => void,
) {
    //targetfps = tps;

    ///////////////////////////////////////////////////////////////////////////
    // 2 points interpolation
    ///////////////////////////////////////////////////////////////////////////

    // interpolating:
    // * velocity
    // * orientation
    // * position

    const thisframe = next3[0].getPayload();
    const nextframe = next3[1].getPayload();

    //
    // Agents
    //

    const thisFrameObjectHash = {};
    thisframe.Objects.map((agent, thisframeindex) => {
        thisFrameObjectHash[agent.Id] = objectInfoToProps(agent);
        thisFrameObjectHash[agent.Id].index = thisframeindex;
    });

    const objectDiffs = nextframe.Objects
        .map(objectInfoToProps)
        .map(nextprops => {
            if (!(nextprops.id in thisFrameObjectHash)) return;

            const thisprops = thisFrameObjectHash[nextprops.id];

            let difforientation = nextprops.orientation - thisprops.orientation;

            if (difforientation > Math.PI) {
                difforientation = difforientation - 2 * Math.PI;
            }

            if (difforientation < -Math.PI) {
                difforientation = difforientation + 2 * Math.PI;
            }

            return {
                id: nextprops.id,
                velocity: nextprops.velocity.clone().sub(thisprops.velocity),
                position: nextprops.position.clone().sub(thisprops.position),
                orientation: difforientation,
            };
        })
        .filter(v => !!v);

    //
    // Synthesize frames
    //

    const fpt = targetfps / tps;
    //const nbSynthesizedFrames = fpt - 1;

    window.requestAnimationFrame(
        synthesizeFrame.bind(
            null,
            0,
            thisframe,
            fpt,
            objectDiffs,
            thisFrameObjectHash,
            sendFrame,
        ),
    );
}

const synthesizeFrame = function(
    framenum,
    thisframe,
    fpt,
    objectDiffs,
    thisFrameObjectHash,
    sendFrame,
) {
    const interpolatedframe = thisframe;
    const timeratio = framenum / fpt;

    objectDiffs.map(agentdiff => {
        if (!agentdiff) return;

        const index = thisFrameObjectHash[agentdiff.id].index;
        interpolatedframe.Objects[index].Position = thisFrameObjectHash[
            agentdiff.id
        ].position
            .clone()
            .add(agentdiff.position.clone().mult(timeratio))
            .toArray();

        interpolatedframe.Objects[index].Orientation =
            thisFrameObjectHash[agentdiff.id].orientation +
            agentdiff.orientation * timeratio;
    });

    sendFrame(interpolatedframe);

    if (framenum < fpt) {
        window.requestAnimationFrame(
            synthesizeFrame.bind(
                null,
                framenum + 1,
                thisframe,
                fpt,
                objectDiffs,
                thisFrameObjectHash,
                sendFrame,
            ),
        );
    }
};
