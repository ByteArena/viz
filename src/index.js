// @flow

import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import comm from "./internal/comm";
import Game from "./game/game";
import { App } from "./app";

const hasPlaycanvas = typeof window._startpc !== "undefined";
const canvasRef = document.createElement("div");

type State = {
    app: ?Object,
    game: ?Game,
    subscribeTo: (string, Object) => void,
    ref: Object,
};

const subscriptions = {
    init: () => {},
    status: () => {},
};

function subscribeTo(eventName, cb) {
    if (typeof subscriptions[eventName] === "undefined") {
        throw new Error(`Cannot subscribeTo ${eventName}`);
    }

    subscriptions[eventName] = cb;
}

class Provider extends Component<any, State> {
    static childContextTypes = {
        game: PropTypes.object,
        subscribeTo: PropTypes.func,
    };

    state: State = {
        app: undefined,
        game: undefined,
        subscribeTo,
        ref: undefined,
    };

    getChildContext() {
        return {
            game: this.state.game,
            subscribeTo: this.state.subscribeTo,
        };
    }

    componentDidMount() {
        const onAppCreated = app => this.setState({ app });

        const onAppConfigured = () => {};

        const onSceneLoaded = (/*scene*/) => {
            const { app } = this.state;

            if (!app) return;

            const settings = window.BAVizSettings;

            const game = new Game(app);
            game.init();

            this.setState({ game });

            app.update = game.update.bind(game);

            comm(
                settings.wsurl,
                settings.tps,
                game.onFrame.bind(game),
                function (type: string, data: any) {
                    subscriptions[type](data);
                },
            );
        };

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

    render() {
        const children = React.cloneElement(
            this.props.children,
            { canvasRef },
        );

        return (
            <div>
                {children}
            </div>
        );
    }
}

ReactDOM.render(
    <Provider>
        <App />
    </Provider>,
    document.getElementById("root"), // eslint-disable-line flowtype-errors/show-errors
);
