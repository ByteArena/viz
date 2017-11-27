// @flow

export default class DebugPointsHelper {
    _debugpoints: Array<Object>;
    _altitude: number;

    constructor(altitude: number) {
        this._altitude = altitude;
    }

    init() {
        this._debugpoints = [];
    }

    update(app: any, points: Vec2Array[]) {
        this._debugpoints.map(pEntity => pEntity.destroy());
        this._debugpoints.length = 0;

        points.map(point => {
            const p = new pc.Entity();
            p.addComponent("model", { type: "box" });
            p.setPosition(point[0], this._altitude, point[1]);
            p.setLocalScale(0.005, 0.005, 0.005);
            p.isStatic = true;
            p.castShadowsLightmap = false;
            p.castShadows = false;
            app.root.addChild(p);
            this._debugpoints.push(p);
        });
    }
}
