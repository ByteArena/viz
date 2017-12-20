// @flow

import * as charCodes from "charcodes";
import actions from "./actions";

import { CAMERAID as CAMERA_TOP } from "../game/camera/orthotop";
import { CAMERAID as CAMERA_PERSPECTIVE } from "../game/camera/perspective";

const CAMERA_TOP_KEY = charCodes.lowercaseT;
const CAMERA_PERSPECTIVE_KEY = charCodes.lowercaseP;

const PIXEL_PER_LINE = 17;
const ZOOM_SCROLL_FACTOR = 20;

export function registerEvents(store: Object) {
  const dispatch = store.dispatch;

  document.addEventListener("keypress", (e: KeyboardEvent) => {

    if (e.charCode === CAMERA_TOP_KEY) {
      dispatch(actions.settings.updateCamera(CAMERA_TOP));
    } else if (e.charCode === CAMERA_PERSPECTIVE_KEY) {
      dispatch(actions.settings.updateCamera(CAMERA_PERSPECTIVE));
    }
  });

  document.addEventListener("wheel", (e: WheelEvent) => {
    let delta = 0;

    // The delta values are specified in pixels.
    if (e.deltaMode === 0x00) {
      delta = e.deltaY / ZOOM_SCROLL_FACTOR;
    }

    // The delta values are specified in lines.
    if (e.deltaMode === 0x01) {
      delta = e.deltaY * PIXEL_PER_LINE / ZOOM_SCROLL_FACTOR;
    }

    const next = parseInt(delta);
    return dispatch(actions.settings.addZoom(next));
  });
}
