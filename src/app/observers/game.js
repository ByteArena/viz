// @flow

import { observeStore } from "./index";

type GetGame = () => ?Game;

export function observeStoreUpdateFrameBatch(store: Object, getGame: GetGame) {
    observeStore({
        store,
        select: state => ({
            bucket: state.game.bucket,
            signature: state.game.bucket._signature,
        }),
        compare: (curstate, nextstate) => {
            if((!nextstate && curstate) || (nextstate && !curstate)) return false;
            return curstate.signature === nextstate.signature;
        },
        onChange: state => {
            console.log("bucket", state.bucket);
        },
    });
}

// export function observeStoreUpdateGameFrame(store: Object, getGame: GetGame) {
//     observeStore({
//         store,
//         select: ({ game }) => game.interpolationProcess,
//         onChange: interpolationProcess => {
//             const game = getGame();

//             if (game != null && interpolationProcess) {
//                 interpolationProcess
//                     .then(frame => {
//                         game.onFrame(frame);
//                     })
//                     .catch(err => console.error(err));
//             }
//         },
//     });
// }

export function observeStoreUpdateGameSettings(store: Object, getGame: GetGame) {
    observeStore({
        store,
        select: ({ settings }) => settings,
        compare: null,
        onChange: settings => {
            const game = getGame();

            if (game != null) {
                game.setZoom(settings.zoom);
                game.setCamera(settings.camera);
            }
        },
    });
}
