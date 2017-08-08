import { Frame } from './bucket';
import Vector2 from './vector2';
import './protocol/vizmessage';

const epsilon = 0.001;
const epsilonsq = epsilon * epsilon;

function agentInfoToProps(agentinfo: Vizagentmessage) {
    return {
        velocity: Vector2.fromArray(agentinfo.Velocity),
        position: Vector2.fromArray(agentinfo.Position),
        orientation: agentinfo.Orientation,
    };
}

export default function (next3: [Frame, Frame, Frame], tps: number, targetfps: number, sendFrame: (message: Object) => void) {

    const tickdurationms = 1000 / tps;
    const framedurationms = 1000 / targetfps;

    ///////////////////////////////////////////////////////////////////////////
    // 2 points interpolation
    ///////////////////////////////////////////////////////////////////////////

    // interpolating:
    // * velocity
    // * orientation
    // * position

    const thisframe = next3[0].getPayload();
    const nextframe = next3[1].getPayload();

    const thisframeAgentsProps = thisframe.Agents.sort((a, b) => a.Id > b.Id ? 1 : -1).map((agentinfo: Vizagentmessage) => agentInfoToProps(agentinfo));
    const nextframeAgentsProps = nextframe.Agents.sort((a, b) => a.Id > b.Id ? 1 : -1).map((agentinfo: Vizagentmessage) => agentInfoToProps(agentinfo));

    const agentDiffs = nextframeAgentsProps.map((nextprops, index) => {
        const thisprops = thisframeAgentsProps[index];

        let difforientation = nextprops.orientation - thisprops.orientation;

        if(difforientation > Math.PI) {
            difforientation = difforientation - 2 * Math.PI;
        }

        if(difforientation < -Math.PI) {
            difforientation = difforientation + 2 * Math.PI;
        }

        return {
            velocity: nextprops.velocity.clone().sub(thisprops.velocity),
            position: nextprops.position.clone().sub(thisprops.position),
            orientation: difforientation,
        };
    });


    const fpt = targetfps / tps;
    const nbSynthesizedFrames = fpt - 1;

    const synthesizeFrame = function (framenum = 0) {
        const interpolatedframe = thisframe;
        const timeratio = framenum / fpt;

        agentDiffs.map((agentdiff, agentindex) => {
            interpolatedframe.Agents[agentindex].Position = thisframeAgentsProps[agentindex].position.clone().add(
                agentdiff.position.clone().mult(timeratio)
            ).toArray();

            interpolatedframe.Agents[agentindex].Orientation = thisframeAgentsProps[agentindex].orientation + (agentdiff.orientation * timeratio);
            //console.log(agentdiff.orientation);
        });

        sendFrame(interpolatedframe);

        if (framenum < fpt) {
            window.requestAnimationFrame(synthesizeFrame.bind(null, framenum+1));
        }
    };

    sendFrame(thisframe);
    window.requestAnimationFrame(synthesizeFrame.bind(null, 1));

    // TODO: achieve 3 points interpolation

};
