// @flow

import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from 'redux'
import { Provider as ReduxProvider } from 'react-redux'

import * as settings from "./storage/settings";
import comm from "./internal/comm";
import reducer from "./reducers"
import Game from "./game/game";
import { App } from "./app";
import actions from "./actions";
import { registrerEvents } from "./events"

const hasPlaycanvas = typeof window._startpc !== "undefined";
const canvasRef = document.createElement("div");

let game;

function initpc(dispatch: StoreDispatch) {
    let app: any;

    function onAppCreated(data) {
        app = data;
    }

    function onAppConfigured(/* app */) {
        const width = window.document
            .getElementById("application-canvas")
            .getBoundingClientRect().width;

        const height = window.innerHeight;
        app.setCanvasFillMode(pc.FILLMODE_NONE, width, height);
    }

    function onSceneLoaded(/* scene */) {
        if (!app) return;

        const settings = window.BAVizSettings;

        game = new Game(app);
        game.init();

        app.update = game.update.bind(game);

        comm(
            settings.wsurl,
            settings.tps,
            game.onFrame.bind(game),
            (type: string, data: any) => {
                switch(type) {
                    case "status": {
                        dispatch(actions.status.updateStatus(data))
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
    applyMiddleware(settings.persistSettings),
);

settings.restoreState(store.dispatch);

store.subscribe(() => {
    const {settings} = store.getState();

    if (game != null) {
        game.setZoom(settings.zoom);
        game.setCamera(settings.camera);
    }
});

initpc(store.dispatch);

ReactDOM.render(
    <ReduxProvider store={store}>
        <App canvasRef={canvasRef} />
    </ReduxProvider>,
    document.getElementById("root"), // eslint-disable-line flowtype-errors/show-errors
);

registrerEvents(store);
