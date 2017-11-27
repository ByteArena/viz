// @flow
import actions from "../actions";

export function restoreState(dispatch: StoreDispatch) {
    if ("localStorage" in window) {
        try {
            const json = localStorage.getItem("settings");

            if (json != null) {
                const settings = JSON.parse(json);
                dispatch(actions.settings.restore(settings))
            }
        } catch (e) {
            // Ignore
        }
    }
}

export function persistSettings(settings: Object) {
    const json = JSON.stringify(settings);

    if ("localStorage" in window) {
        try {
            localStorage.setItem("settings", json);
        } catch (e) {
            // Ignore
        }
    }
}
