import { Vector2, Vector3 } from 'babylonjs';

import OrthoViewAbstract from './OrthoViewAbstract';
import * as constants from '../constants';

export default class OrthoViewTop extends OrthoViewAbstract {

    getFocusIsoPoint() {
        const { camera } = this;
        const camerax = (camera.orthoRight + camera.orthoLeft) / 2;
        const cameray = (camera.orthoTop + camera.orthoBottom) / 2;
        return new Vector2(camerax, cameray);
    }

    activate() {
        this.camera.position = new Vector3(0, constants.CAMERA_ALTITUDE, 0);
        this.camera.setTarget(Vector3.Zero());
    }
}