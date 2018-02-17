// @flow

import React from "react";
import ReactDOM from "react-dom";
import { createStore } from 'redux'
import { Provider as ReduxProvider } from 'react-redux'

import * as gameSettingsStorage from "./app/storage/settings";
import comm from "./internal/comm"; 
import reducer from "./app/reducers"
import Game from "./game";
import { App } from "./app";
import actions from "./app/actions";
import { registerEvents } from "./app/events"
import { observeStoreUpdateGameFrame, observeStoreUpdateGameSettings } from "./app/observers/game"
import { observeStorePersistSettings } from "./app/observers/settings"

const hasPlaycanvas = typeof window._startpc !== "undefined";
const canvasRef = document.createElement("canvas");
const toolbarHeight = 50;

let game;

function initpc(store) {

    let app: any;

    function onAppCreated(data) {
        app = data;
    }

    const onAppConfigured = app => {

        const resize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight - toolbarHeight;
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

        game = new Game(app, store.dispatch);
        game.init();

        // Restore and registrer settings management
        gameSettingsStorage.restoreState(store.dispatch);
        observeStorePersistSettings(store);

        app.update = game.update.bind(game);

        comm(
            settings.wsurl,
            settings.tps,
            (type: string, data: any) => {  // on frame
                switch (type) {
                    case "status": {
                        store.dispatch(actions.status.updateStatus(data))
                        break;
                    }
                    case "frame": {
                        store.dispatch(actions.game.addFrame(data))
                        break;
                    }
                    case "init": {
                        store.dispatch(actions.game.clear())
                        store.dispatch(actions.agent.clear())

                        data.agents.forEach(agent => {
                            store.dispatch(
                                actions.agent.addAgent(
                                    agent.manifest.name,
                                    agent.id,
                                ),
                            );
                        })

                        break;
                    }
                }
            },
            (events: Array<VizEvent>) => {
                if(events.length === 0) return;
                events = events
                    .map(event => {
                        event.Id = Math.random().toString();    // key useful for React
                        return event;
                    });
                store.dispatch(actions.game.eventBatch(events));

                events.map(event => setTimeout(() => store.dispatch(
                    actions.game.eventTimeouted(event.Id),
                ), 6000));
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

const store = createStore(reducer);

observeStoreUpdateGameFrame(store, () => game);
observeStoreUpdateGameSettings(store, () => game);

initpc(store);

ReactDOM.render(
    <ReduxProvider store={store}>
        <App
            canvasRef={canvasRef}
            toolbarHeight={toolbarHeight}
        />
    </ReduxProvider>,
    document.getElementById("root"), // eslint-disable-line flowtype-errors/show-errors
);

registerEvents(store);
