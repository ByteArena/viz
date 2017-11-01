// https://medium.com/@necsoft/three-js-101-hello-world-part-1-443207b1ebe1

import comm from './comm';

export default async function main(app: any, wsurl: string, tps: number, cdnbaseurl: string) : Promise<any> {

    const agent = new window.pc.Entity();
    agent.addComponent("model", { type: "sphere" });
    agent.setPosition(2, 0.8, 2);
    agent.setLocalScale(0.1, 0.1, 0.1);
    agent.isStatic = false;
    agent.castShadowsLightmap = false;
    agent.castShadows = true;

    app.root.addChild(agent);

    comm(wsurl, tps, function(map) {
        //console.log("SETMAP", map, app);
    }, function(msg) {
        //console.log("VIZMSG", msg);
        const pos = msg.Objects[0].Position;
        agent.setPosition(pos[0], 0.8, pos[1]);
    });
}
