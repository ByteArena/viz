// @flow

import React from "react";

import CameraSelect from "../../containers/camera-select";
import AgentList from "../../containers/agent-list";
import StatusIndicator from "../../containers/status-indicator";
import ZoomSlider from "../../containers/zoom-slider";
import BotLogo from "../logo/bot";

const separation = { marginLeft: "10px" };

const MenuBar = () => (
    <div
        style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            padding: "5px",
        }}
    >
        <div style={{ display: "flex" }}>
            <BotLogo
                height={50}
                width={null}
            />
        </div>
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "200px",
                ...separation,
            }}
        >
            <div style={{ display: "flex", width: "100%" }}>
                <CameraSelect />
            </div>
            <div style={{ display: "flex", width: "100%" }}>
                <ZoomSlider />
            </div>
        </div>
        <div style={{ display: "flex", width: "100px", ...separation }}>
            <StatusIndicator />
        </div>
        <AgentList />
    </div>
);

export default MenuBar;
