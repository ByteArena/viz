// @flow

import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { createStore, applyMiddleware } from 'redux'
import { connect, Provider as ReduxProvider } from 'react-redux'

import * as settings from "./storage/settings";
import comm from "./internal/comm";
import reducer from "./reducers"
import Game from "./game/game";
import App from "./app";
import actions from "./actions";
import { registrerEvents } from "./events"

const hasPlaycanvas = typeof window._startpc !== "undefined";
const canvasRef = document.createElement("div");

type State = {
    app: ?Object,
    game: ?Game,
};

class Provider extends Component<any, State> {
    static childContextTypes = {
        game: PropTypes.object,
    };

    state: State = {
        app: undefined,
        game: undefined,
    };

    getChildContext() {
        return {
            game: this.state.game,
        };
    }

    componentDidMount() {
        const onAppCreated = app => this.setState({ app });

        const onAppConfigured = app => {
            const width = window.document
                .getElementById("application-canvas")
                .getBoundingClientRect().width;

            const height = window.innerHeight;
            app.setCanvasFillMode(pc.FILLMODE_NONE, width, height);
        };

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
                (type: string, data: any) => {
                    switch(type) {
                        case "status": {
                            this.props.dispatch(actions.status.updateStatus(data))
                            break;
                        }
                        case "init": {
                            this.props.dispatch(actions.agent.clear())

                            data.agents.forEach(agent => {
                                this.props.dispatch(actions.agent.addAgent(agent.AgentName, agent.Id))
                            })
                            break;
                        }
                    }
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
        const children = React.cloneElement(this.props.children, { canvasRef });

        return <div>{children}</div>;
    }
}

const store = createStore(
    reducer,
    applyMiddleware(settings.persistSettings),
);

settings.restoreState(store.dispatch);

const OurProvider = connect()(Provider)

function Main() {
    return (
        <OurProvider>
            <App />
        </OurProvider>
    );
}

ReactDOM.render(
    <ReduxProvider store={store}>
        <Main />
    </ReduxProvider>,
    document.getElementById("root"), // eslint-disable-line flowtype-errors/show-errors
);

registrerEvents(store);
