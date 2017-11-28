// @flow

import { observeStore } from "./index";

type GetGame = () => ?Game;


export function observeStoreUpdateGameFrame(store: Object, getGame: GetGame) {

    observeStore(store, ({game}) => game.interpolationProcess, (interpolationProcess) => {
        const game = getGame();

        if (game != null && interpolationProcess) {

            interpolationProcess((frame) => {
                game.onFrame(frame);
            })
        }
    });
}


// export function observeStoreUpdateGameFrame(store: Object, getGame: GetGame) {

//     observeStore(store, ({game}) => game, (gameState) => {
//         const game = getGame();

//         if (game != null) {
//             if (typeof gameState.frame !== "undefined") {
//                 game.onFrame(gameState.frame);
//             }
//         }
//     });
// }

export function observeStoreUpdateGameSettings(store: Object, getGame: GetGame) {

    observeStore(store, ({settings}) => settings, (settings) => {
        const game = getGame();

        if (game != null) {
            game.setZoom(settings.zoom);
            game.setCamera(settings.camera);
        }
    });
}
