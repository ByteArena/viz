// @flow

import { observeStore } from "./index";
import { persistSettings } from "../storage/settings";

export function observeStorePersistSettings(store: Object) {
    observeStore(store, ({settings}) => settings, (settings) => {
        persistSettings(settings);
    });
}
