// https://medium.com/@necsoft/three-js-101-hello-world-part-1-443207b1ebe1

import comm from './comm';

const debugpoints = [];

const debugMaterial = new pc.PhongMaterial();
debugMaterial.shadingModel = pc.SPECULAR_BLINN;

export default async function main(app: any, wsurl: string, tps: number, cdnbaseurl: string) : Promise<any> {

    const agent = new window.pc.Entity();
    agent.addComponent("model", { type: "sphere" });
    agent.setPosition(2, 0.8, 2);
    agent.setLocalScale(0.1, 0.1, 0.1);
    agent.isStatic = false;
    agent.castShadowsLightmap = false;
    agent.castShadows = true;
    window.agent = agent;

    app.root.addChild(agent);

    comm(wsurl, tps, function(map) {
        //console.log("SETMAP", map, app);
    }, function(msg) {
        //console.log("VIZMSG", msg);

        debugpoints.map(pEntity => pEntity.destroy());
        debugpoints.length = 0;

        msg.DebugPoints.map(point => {
            const p = new window.pc.Entity();
            p.addComponent("model", { type: "sphere" });
            p.setPosition(point[0], 0.8, point[1]);
            p.setLocalScale(0.1, 0.1, 0.1);
            p.isStatic = true;
            p.castShadowsLightmap = false;
            p.castShadows = false;
            app.root.addChild(p);
            debugpoints.push(p);
        });

        const pos = msg.Objects[0].Position;
        agent.setPosition(pos[0], 0.2, pos[1]);
    });
}
