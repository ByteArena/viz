// @flow
import * as charCodes from "charcodes";
import actions from "./actions";

import { CAMERAID as CAMERA_TOP } from "../game/camera/orthotop";
import { CAMERAID as CAMERA_PERSPECTIVE } from "../game/camera/perspective";

const CAMERA_TOP_KEY = charCodes.lowercaseT;
const CAMERA_PERSPECTIVE_KEY = charCodes.lowercaseP;

const ZOOM_SCROLL_FACTOR = 20;

export function registerEvents(store: Object) {
    const dispatch = store.dispatch;

    document.addEventListener("keypress", (e: KeyboardEvent) => {
        if (e.keyCode === CAMERA_TOP_KEY) {
            dispatch(actions.settings.updateCamera(CAMERA_TOP));
        } else if (e.keyCode === CAMERA_PERSPECTIVE_KEY) {
            dispatch(actions.settings.updateCamera(CAMERA_PERSPECTIVE));
        }
    });

    document.addEventListener("wheel", (e: WheelEvent) => {
        const next = parseInt(e.deltaY / ZOOM_SCROLL_FACTOR);
        return dispatch(actions.settings.addZoom(next));
    });
}
