// @flow

import React from "react";
import { css } from "emotion";
import PropTypes from "prop-types";
import { connect } from "react-redux"

import { Pane } from "./components/panes/pane";
import CameraSelect from "./containers/camera-select";
import AgentList from "./containers/agent-list";
import StatusIndicator from "./containers/status-indicator";
import ZoomSlider from "./containers/zoom-slider";

const rightPaneClass = css`
    height: 100%;
    background: #1e1e1e;
    color: white;
`;

type Props = {
    canvasRef: Object,

    settings: {
        zoom: number,
        camera: string,
    },
};

type Context = {
    game: ?Game,
};

function App({ canvasRef, settings }: Props, { game }: Context) {

    if (game != null) {
        game.setZoom(settings.zoom);
    }

    if (game != null) {
        game.setCamera(settings.camera);
    }

    return (
        <div>
            <Pane
                className={rightPaneClass}
                size={20}
                canvasRef={canvasRef}
            >
                <ZoomSlider />
                <CameraSelect />
                <StatusIndicator />
                <AgentList />
            </Pane>
        </div>
    );
}

App.contextTypes = {
    game: PropTypes.object,
};

const mapStateToProps = (state) => ({
    settings: state.settings,
});

export default connect(
    mapStateToProps,
)(App)

