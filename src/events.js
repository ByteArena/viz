// @flow
import * as charCodes from "charcodes";

import actions from "./actions";

const TOP_CAM_KEY = charCodes.lowercaseT;
const DEFAULT_CAM_KEY = charCodes.lowercaseD;

const DEFAULT_CAM = "default";
const TOP_CAM = "orthotop";

const ZOOM_SCROLL_FACTOR = 20;

export function registrerEvents(store: Object) {
    const dispatch = store.dispatch;

    document.addEventListener("keypress", (e: KeyboardEvent) => {
        if (e.keyCode === TOP_CAM_KEY) {
            dispatch(actions.settings.updateCamera(TOP_CAM));
        } else if (e.keyCode === DEFAULT_CAM_KEY) {
            dispatch(actions.settings.updateCamera(DEFAULT_CAM));
        }
    });

    document.addEventListener("wheel", (e: WheelEvent) => {
        const next = parseInt(e.deltaY / ZOOM_SCROLL_FACTOR);
        return dispatch(actions.settings.addZoom(next));
    });
}
