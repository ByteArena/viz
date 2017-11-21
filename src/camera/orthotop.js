// @flow

import rangeMap from "../internal/rangemap";

export default class OrthoTopCamera implements Camera {
    _camera: any;

    constructor(camera: any) {
        this._camera = camera;
    }

    init(zoom: number) {
        this._camera.camera.projection = 1;
        this._camera.setEulerAngles(-90, 0, 0);
        this._camera.setPosition(0, 3, 0);
        this.setZoom(zoom);
    }

    uninit() {}

    setZoom(zoom: number): OrthoTopCamera {
        this._camera.camera.orthoHeight = rangeMap(
            zoom,
            100, // max zoom
            1, // min zoom
            0.2, // fov for max zoom
            6, // fov for min zoom
        );
        return this;
    }

    update(followpos: Point3) {
        this._camera.setPosition(followpos.x, 3, followpos.z);
    }
}
