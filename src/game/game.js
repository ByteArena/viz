// @flow

import RemoteFollowCamera from "../camera/remotefollow";
import OrthoTopCamera from "../camera/orthotop";

// import DrawGridHelper from '../helper/drawGrid';
import DebugPointsHelper from "../helper/debugPoints";
import DebugSegmentsHelper from "../helper/debugSegments";

export default class Game {
  app: Object;

  camera: Object;
  gridDrawer: Object;
  debugPointDrawer: Object;
  debugSegmentsDrawer: Object;

  agentEntities: Object;
  projectileEntities: Object;

  projectileMaterial: any;

  zoom: number;

  constructor(app: Object) {
    this.app = app;
  }

  init() {
    this.setCamera("default");
    this.setZoom(50);

    // this.gridDrawer = new DrawGridHelper(0.62, 10, 10);
    // this.gridDrawer.init();

    // this.debugPointDrawer = new DebugPointsHelper(0.8);
    // this.debugPointDrawer.init();

    // this.debugSegmentsDrawer = new DebugSegmentsHelper(0.8);
    // this.debugSegmentsDrawer.init();

    this.agentEntities = {};
    this.projectileEntities = {};

    this.projectileMaterial = new pc.PhongMaterial();
    this.projectileMaterial.diffuse.set(1, 0.0, 0.0);
    this.projectileMaterial.update();
  }

  update() {
    //this.gridDrawer.update(this.app);
    const agent =
      Object.keys(this.agentEntities).length > 0
        ? this.agentEntities[Object.keys(this.agentEntities)[0]]
        : null;
    agent && this.camera.update(agent.getLocalPosition());
  }

  onFrame(frame: Vizmessage) {
    // this.debugPointDrawer.update(this.app, frame.DebugPoints);
    // this.debugSegmentsDrawer.update(this.app, frame.DebugSegments);

    const seenObjectIds = {};

    frame.Objects.map((msg: VizObjectMessage) => {
      if (msg.Type === "agent") {
        let agent;

        if (!(msg.Id in this.agentEntities)) {
          agent = new pc.Entity();
          agent.addComponent("model", {
            type: "cone"
          });
          agent.setLocalScale(0.01, 0.01, 0.01);
          agent.isStatic = false;
          agent.castShadowsLightmap = false;
          agent.castShadows = true;
          this.app.root.addChild(agent);
          this.agentEntities[msg.Id] = agent;
        } else {
          agent = this.agentEntities[msg.Id];
        }

        this._placeAgent(agent, msg);
      } else if (msg.Type === "projectile") {
        let projectile;

        if (!(msg.Id in this.projectileEntities)) {
          const color = new pc.Color(1, 0, 0, 1);

          projectile = new pc.Entity();
          projectile.addComponent("model", {
            type: "box"
          });
          projectile.setLocalScale(0.005, 0.005, 0.005);
          projectile.isStatic = false;
          projectile.castShadowsLightmap = false;
          projectile.castShadows = true;
          this.app.root.addChild(projectile);
          this.projectileEntities[msg.Id] = projectile;

          projectile.model.model.meshInstances[0].material = this.projectileMaterial;
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
        this.camera = new OrthoTopCamera(this.app.scene.root.children[0]);
        this.camera.init(this.zoom);

        break;
      }
      case "default":
      default: {
        this.camera = new RemoteFollowCamera(this.app.scene.root.children[0]);
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
    agent.setPosition(pos[0], 0.02, pos[1]);

    const orientation = info.Orientation;
    const orientationDegrees = orientation * (360 / (2 * Math.PI));
    agent.setEulerAngles(90, orientationDegrees, 0);
  }

  _placeProjectile(projectile: any, info: VizObjectMessage) {
    const pos = info.Position;
    projectile.setPosition(pos[0], 0.02, pos[1]);
  }
}
