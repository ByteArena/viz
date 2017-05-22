import { Vector2, Vector3 } from 'babylonjs';

import OrthoViewAbstract from './OrthoViewAbstract';
import * as constants from '../constants';

export default class OrthoViewFront extends OrthoViewAbstract {

    getFocusIsoPoint() {
        const { camera } = this; 
        const camerax = (camera.orthoRight + camera.orthoLeft) / 2;
        const cameray = (camera.orthoTop + camera.orthoBottom) / constants.SQRT2;
        return new Vector2(camerax, cameray);
    }

    activate() {
        this.camera.position = new Vector3(-0.000000000000001, constants.CAMERA_ALTITUDE, -constants.CAMERA_ALTITUDE);
        this.camera.setTarget(Vector3.Zero());
    }
}
