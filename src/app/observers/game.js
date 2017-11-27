// @flow

import { observeStore } from "./index";

type GetGame = () => ?Game;

export function observeStoreUpdateGameFrame(store: Object, getGame: GetGame) {

    observeStore(store, ({game}) => game.interpolationProcess, (interpolationProcess) => {
        const game = getGame();

        if (game != null && interpolationProcess) {

            interpolationProcess
                .then(frame => {
                    game.onFrame(frame);
                })
                .catch(err => console.error(err))
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
