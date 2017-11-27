// @flow

import { observeStore } from "./index";

type GetGame = () => ?Game;

export function observeStoreUpdateGameFrame(store: Object, getGame: GetGame) {

    observeStore(store, ({game}) => game.frame, (frame) => {
        const game = getGame();

        if (game != null) {
            if (typeof frame !== "undefined") {
                game.onFrame(frame);
            }
        }
    });
}

export function observeStoreUpdateGameSettings(store: Object, getGame: GetGame) {

    observeStore(store, ({settings}) => settings, (settings) => {
        const game = getGame();

        if (game != null) {
            game.setZoom(settings.zoom);
            game.setCamera(settings.camera);
        }
    });
}
