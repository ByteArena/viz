// @flow

import React from "react";
import { css } from "emotion";

import Pane from "./components/panes/pane";
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
    toolbarHeight: number,
};

export function App({ canvasRef, toolbarHeight }: Props) {

    return (
        <div>
            <Pane
                className={rightPaneClass}
                toolbarHeight={toolbarHeight}
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

