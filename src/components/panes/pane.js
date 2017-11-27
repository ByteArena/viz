// @flow

import React from "react";
import PropTypes from "prop-types";
import { css } from "emotion";
import { connect } from "react-redux"

const elementClassName = css`margin: 7px;`;

type Props = {
    children: any,
    toolbarHeight: number,
    canvasRef: Object,
    dispatch: StoreDispatch,
};

function Element({ children }: any) {
    return <div className={elementClassName}>{children}</div>;
}

function Pane(
    { canvasRef, children, toolbarHeight }: Props,
) {
    const elements = React.Children.map(children, item => (
        <Element>{item}</Element>
    ));

    function inject(node) {
        node && node.appendChild(canvasRef);
    }

    return (
        <div style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
            <div style={{ display: "flex", height: toolbarHeight + "px", width: "100%" }}>{elements}</div>
            <div
                style={{ display: "flex", flexGrow: "1" }}
                ref={inject}
            />
        </div>
    );
}

Pane.contextTypes = {
    game: PropTypes.object,
};

export default connect()(Pane);
