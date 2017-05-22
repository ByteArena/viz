import { Vector2, Vector3 } from 'babylonjs';

import OrthoViewAbstract from './OrthoViewAbstract';
import * as constants from '../constants';

export default class OrthoViewIsometric extends OrthoViewAbstract {

    getFocusIsoPoint() {
        const { camera } = this;
        const camerax = (camera.orthoRight + camera.orthoLeft) / 2;
        const cameray = (camera.orthoTop + camera.orthoBottom) / 2;

        // http://clintbellanger.net/articles/isometric_math/
        const cameraxDivTILE_WIDTH_HALF = camerax / constants.SQRT2_HALF;
        const camerayDivTILE_HEIGHT_HALF = cameray / constants.SQRT2_FOURTH;
        let mapx = (cameraxDivTILE_WIDTH_HALF + camerayDivTILE_HEIGHT_HALF) / 2;
        let mapy = (camerayDivTILE_HEIGHT_HALF - cameraxDivTILE_WIDTH_HALF) / 2;

        if(mapx === -0) mapx = 0;
        if(mapy === -0) mapy = 0;

        return new Vector2(mapx, mapy);
    }

    activate() {
        this.camera.position = new Vector3(-constants.CAMERA_ALTITUDE * constants.ISORATIO, constants.CAMERA_ALTITUDE, -constants.CAMERA_ALTITUDE * constants.ISORATIO);
        this.camera.setTarget(Vector3.Zero());
    }
}
