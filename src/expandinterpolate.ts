import { Frame } from './bucket';
import Vector2 from './vector2';
import './protocol/vizmessage';

const epsilon = 0.001;
const epsilonsq = epsilon * epsilon;

function agentInfoToProps(agentinfo: Vizagentmessage) {
    return {
        id: agentinfo.Id,
        velocity: Vector2.fromArray(agentinfo.Velocity),
        position: Vector2.fromArray(agentinfo.Position),
        orientation: agentinfo.Orientation,
    };
}

function projectileInfoToProps(projectileinfo: Vizprojectilemessage) {
    return {
        id: projectileinfo.Id,
        velocity: Vector2.fromArray(projectileinfo.Velocity),
        position: Vector2.fromArray(projectileinfo.Position),
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

    //
    // Agents
    //

    const thisFrameAgentHash = {};
    thisframe.Agents.map((agent, thisframeindex) => {
        thisFrameAgentHash[agent.Id] = agentInfoToProps(agent);
        thisFrameAgentHash[agent.Id].index = thisframeindex;
    });

    const agentDiffs = nextframe.Agents
    .map(agentInfoToProps)
    .map(nextprops => {
        if(!(nextprops.id in thisFrameAgentHash)) return;

        const thisprops = thisFrameAgentHash[nextprops.id];

        let difforientation = nextprops.orientation - thisprops.orientation;
        
        if(difforientation > Math.PI) {
            difforientation = difforientation - 2 * Math.PI;
        }

        if(difforientation < -Math.PI) {
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
    // Projectiles
    //

    const thisFrameProjHash = {};
    (thisframe.Projectiles||[]).map((proj, thisframeindex) => {
        thisFrameProjHash[proj.Id] = projectileInfoToProps(proj);
        thisFrameProjHash[proj.Id].index = thisframeindex;
    });

    const projectileDiffs = (nextframe.Projectiles||[])
    .map(projectileInfoToProps)
    .map(nextprops => {
        if(!(nextprops.id in thisFrameProjHash)) return;

        const thisprops = thisFrameProjHash[nextprops.id];

        return {
            id: nextprops.id,
            velocity: nextprops.velocity.clone().sub(thisprops.velocity),
            position: nextprops.position.clone().sub(thisprops.position),
        };
    })
    .filter(v => !!v);
    
    //
    // Synthesize frames
    //

    const fpt = targetfps / tps;
    const nbSynthesizedFrames = fpt - 1;

    const synthesizeFrame = function (framenum) {
        const interpolatedframe = thisframe;
        const timeratio = framenum / fpt;

        agentDiffs.map(agentdiff => {
            const index = thisFrameAgentHash[agentdiff.id].index;
            interpolatedframe.Agents[index].Position = thisFrameAgentHash[agentdiff.id].position.clone().add(
                agentdiff.position.clone().mult(timeratio)
            ).toArray();

            interpolatedframe.Agents[index].Orientation = thisFrameAgentHash[agentdiff.id].orientation + (agentdiff.orientation * timeratio);
        });

        projectileDiffs.map(projectilediff => {
            const index = thisFrameProjHash[projectilediff.id].index;
            interpolatedframe.Projectiles[index].Position = thisFrameProjHash[projectilediff.id].position.clone().add(
                projectilediff.position.clone().mult(timeratio)
            ).toArray();
        });

        sendFrame(interpolatedframe);

        if (framenum < fpt) {
            window.requestAnimationFrame(synthesizeFrame.bind(null, framenum+1));
        }
    };

    window.requestAnimationFrame(synthesizeFrame.bind(null, 0));
};
