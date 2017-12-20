// @flow

import React from "react";
import { css } from "emotion";

import CameraSelect from "../../containers/camera-select";
import AgentList from "../../containers/agent-list";
import StatusIndicator from "../../containers/status-indicator";
import ZoomSlider from "../../containers/zoom-slider";
import BotLogo from "../logo/bot";

const separation = css`
    margin-left: 10px;
`;

const menuClass = css`
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 5px;
    border-bottom: 1px solid gray;
`;

const cameraClass = css`
    flexDirection: column;
    width: 200px;
    ${separation}
`;

const indicatorStatus = css`
    width: 130px;
    ${separation}
`;

const MenuBar = ({ height }: { height: number }) => (
    <div className={menuClass}>
        <BotLogo
            height={height-10}
            width={null}
        />
        <div className={cameraClass}>
            <CameraSelect />
            <ZoomSlider />
        </div>
        <div className={indicatorStatus}>
            <StatusIndicator />
        </div>
        <AgentList />
    </div>
);

export default MenuBar;
