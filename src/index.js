// @flow

import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from 'redux'
import { Provider as ReduxProvider } from 'react-redux'

import * as gameSettingsStorage from "./storage/settings";
import comm from "./internal/comm";
import reducer from "./reducers"
import Game from "./game/game";
import { App } from "./app";
import actions from "./actions";
import { registrerEvents } from "./events"
import { observeStoreUpdateGameFrame, observeStoreUpdateGameSettings } from "./observers/game"

const hasPlaycanvas = typeof window._startpc !== "undefined";
const canvasRef = document.createElement("div");
const toolbarHeight = 60;

let game;

function initpc(dispatch: StoreDispatch) {

    let app: any;

    function onAppCreated(data) {
        app = data;
    }

    const onAppConfigured = app => {

        const resize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight - toolbarHeight; // 60px: height of the toolbar
            app.setCanvasFillMode(pc.FILLMODE_NONE, width, height);
            app.setCanvasResolution(pc.RESOLUTION_FIXED, width, height);
            app.graphicsDevice.updateClientRect();
        };

        window.addEventListener("resize", resize);
        resize();
    };

    function onSceneLoaded(/* scene */) {
        if (!app) return;

        app.graphicsDevice.updateClientRect();

        const settings = window.BAVizSettings;

        game = new Game(app, dispatch);
        game.init();

        app.update = game.update.bind(game);

        gameSettingsStorage.restoreState(dispatch);

        // Dispatch RAF
        window.setInterval(function() {
            dispatch(actions.game.annimationFrame())
        }, 1000 / settings.tps);

        comm(
            settings.wsurl,
            settings.tps,
            (type: string, data: any) => {
                switch (type) {
                    case "status": {
                        dispatch(actions.status.updateStatus(data))
                        break;
                    }
                    case "framebatch": {
                        dispatch(actions.game.addFrameBatch(data))
                        break;
                    }
                    case "init": {
                        dispatch(actions.agent.clear())

                        data.agents.forEach(agent => {
                            dispatch(actions.agent.addAgent(agent.AgentName, agent.Id))
                        })

                        break;
                    }
                }
            },
        );
    }

    if (hasPlaycanvas) {
        window._startpc(
            canvasRef,
            onAppCreated,
            onAppConfigured,
            onSceneLoaded,
        );
    } else {
        console.warn("PlayCanvas has not been detected");
    }
}

const store = createStore(
    reducer,
    applyMiddleware(gameSettingsStorage.persistSettings),
);

observeStoreUpdateGameFrame(store, () => game);
observeStoreUpdateGameSettings(store, () => game);

initpc(store.dispatch);

ReactDOM.render(
    <ReduxProvider store={store}>
        <App
            canvasRef={canvasRef}
            toolbarHeight={toolbarHeight}
        />
    </ReduxProvider>,
    document.getElementById("root"), // eslint-disable-line flowtype-errors/show-errors
);

registrerEvents(store);
