// @flow

import rangeMap from "../../internal/rangemap";

export default class RemoteFollowCamera implements Camera {
    _camera: any;

    constructor(camera: any) {
        this._camera = camera;
    }

    init(zoom: number) {
        //this.camera.setLocalPosition(-5, 3, -6);
        this._camera.camera.projection = 0;
        this._camera.setEulerAngles(0, 0, 0);
        this._camera.setLocalPosition(0, 0, 0);
        this._camera.setPosition(0, 0, 0);
        this._camera.translateLocal(-5, 3, -6);
        this._camera.lookAt(0, 0, 0);

        this.setZoom(zoom);
    }

    uninit() {}

    setZoom(zoom: number): RemoteFollowCamera {
        this._camera.camera.fov = rangeMap(
            zoom,
            100, // max zoom
            1, // min zoom
            3, // fov for max zoom
            60, // fov for min zoom
        );
        return this;
    }

    update(followpos: Point3) {
        this._camera.lookAt(followpos);
    }

    worldToScreen(pos: pc.Vec3): pc.Vec3 {
        return this._camera.camera.worldToScreen(pos);
    }
}
