// @flow

import RemoteFollowCamera from "../camera/remotefollow";
import OrthoTopCamera from "../camera/orthotop";
import actions from "../actions";

import DrawGridHelper from "../helper/drawGrid";
//import DebugPointsHelper from "../helper/debugPoints";
import DebugSegmentsHelper from "../helper/debugSegments";

export default class Game {
    app: Object;
    dispatch: StoreDispatch;

    camera: Object;
    gridDrawer: Object;
    debugPointDrawer: Object;
    debugSegmentsDrawer: Object;

    agentEntities: Object;
    projectileEntities: Object;

    agentMaterial: any;

    zoom: number;

    debug: boolean;
    agentaltitude: number;

    constructor(app: Object, dispatch: StoreDispatch) {
        this.app = app;
        this.debug = false;
        this.agentaltitude = 0.04;
        this.dispatch = dispatch;
    }

    init() {
        this.debug = document.location.href.split("debug=").length > 1;

        this.setCamera("default");
        this.setZoom(50);

        if (this.debug) {
            this.debugSegmentsDrawer = new DebugSegmentsHelper(0.1);
            this.debugSegmentsDrawer.init();

            this.gridDrawer = new DrawGridHelper(0.001, 10, 10);
            this.gridDrawer.init();
        }

        this.agentEntities = {};
        this.projectileEntities = {};

        this.agentMaterial = new pc.PhongMaterial();
        this.agentMaterial.diffuse.set(1, 0.0, 0.0);
        this.agentMaterial.update();
    }

    update() {
        if (this.debug) {
            this.gridDrawer.update(this.app);
        }

        const agent =
            Object.keys(this.agentEntities).length > 0
                ? this.agentEntities[Object.keys(this.agentEntities)[0]]
                : null;
        agent && this.camera.update(agent.getLocalPosition());
    }

    onFrame(frame: Vizmessage) {
        if (this.debug) {
            // this.debugPointDrawer.update(this.app, frame.DebugPoints);
            this.debugSegmentsDrawer.update(this.app, frame.DebugSegments);
        }

        const seenObjectIds = {};

        frame.Objects.map((msg: VizObjectMessage) => {
            if (msg.Type === "agent") {
                let agent;

                if (!(msg.Id in this.agentEntities)) {
                    agent = new pc.Entity();
                    agent.addComponent("model", {
                        type: "cone",
                    });
                    agent.setLocalScale(0.015, 0.015, 0.015);
                    agent.isStatic = false;
                    agent.castShadowsLightmap = false;
                    agent.castShadows = true;
                    this.app.root.addChild(agent);
                    this.agentEntities[msg.Id] = agent;
                    //agent.model.model.meshInstances[0].material = this.agentMaterial;
                } else {
                    agent = this.agentEntities[msg.Id];
                }

                if (msg.Score) {
                    this.dispatch(actions.agent.updateAgentScore(msg.Score.Value, msg.Id));
                }

                this._placeAgent(agent, msg);
            } else if (msg.Type === "projectile") {
                let projectile;

                if (!(msg.Id in this.projectileEntities)) {
                    projectile = new pc.Entity();
                    projectile.addComponent("model", {
                        type: "box",
                    });
                    projectile.setLocalScale(0.01, 0.01, 0.01);
                    projectile.isStatic = false;
                    projectile.castShadowsLightmap = false;
                    projectile.castShadows = true;
                    this.app.root.addChild(projectile);
                    this.projectileEntities[msg.Id] = projectile;
                } else {
                    projectile = this.projectileEntities[msg.Id];
                }

                this._placeProjectile(projectile, msg);
            }

            seenObjectIds[msg.Id] = true;
        });

        Object.keys(this.agentEntities).map(entityid => {
            if (!seenObjectIds[entityid]) {
                this.agentEntities[entityid].destroy();
                delete this.agentEntities[entityid];
            }
        });

        Object.keys(this.projectileEntities).map(entityid => {
            if (!seenObjectIds[entityid]) {
                this.projectileEntities[entityid].destroy();
                delete this.projectileEntities[entityid];
            }
        });
    }

    getApp(): any {
        return this.app;
    }

    setCamera(camera: string): Game {
        if (this.camera) this.camera.uninit();

        switch (camera) {
            case "orthotop": {
                this.camera = new OrthoTopCamera(
                    this.app.scene.root.children[0],
                );
                this.camera.init(this.zoom);

                break;
            }
            case "default":
            default: {
                this.camera = new RemoteFollowCamera(
                    this.app.scene.root.children[0],
                );
                this.camera.init(this.zoom);

                break;
            }
        }

        return this;
    }

    setZoom(zoom: number): Game {
        this.zoom = zoom;
        this.camera.setZoom(zoom);
        return this;
    }

    getZoom(): number {
        return this.zoom;
    }

    _placeAgent(agent: any, info: VizObjectMessage) {
        const pos = info.Position;
        agent.setPosition(pos[0], this.agentaltitude, pos[1]);

        const orientation = info.Orientation;
        const orientationDegrees = orientation * (360 / (2 * Math.PI));
        agent.setEulerAngles(90, orientationDegrees, 0);
    }

    _placeProjectile(projectile: any, info: VizObjectMessage) {
        const pos = info.Position;
        projectile.setPosition(pos[0], this.agentaltitude, pos[1]);
    }
}
