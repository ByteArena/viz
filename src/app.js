// @flow

import React from "react";
import { css } from "emotion";
import PropTypes from "prop-types";

import { Pane } from "./components/panes/pane";
import { AgentList } from "./components/agent-list";
import { ZoomSlider } from "./components/zoom-slider";
import { CameraSelect } from "./components/camera-select";
import { StatusIndicator } from "./components/status-indicator";

const rightPaneClass = css`
    height: 100%;
    background: #1e1e1e;
    color: white;
`;

type Props = {
    canvasRef: Object,
};

type Context = {
    game: ?Game,
};

export function App({ canvasRef }: Props, { game }: Context) {
    function onZoomChange(value) {
        if (game != null) {
            game.setZoom(value);
        }
    }

    function onCameraSelect(value) {
        if (game != null) {
            game.setCamera(value);
        }
    }

    return (
        <div>
            <Pane
                className={rightPaneClass}
                size={20}
                canvasRef={canvasRef}
            >
                <ZoomSlider onChange={onZoomChange} />
                <CameraSelect onChange={onCameraSelect} />
                <StatusIndicator />
                <AgentList />
            </Pane>
        </div>
    );
}

App.contextTypes = {
    game: PropTypes.object,
};
