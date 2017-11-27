// @flow

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

type Props = {
    children: any,
    toolbarHeight: number,
    canvasRef: Object,
    dispatch: StoreDispatch,
};

function Layout({ canvasRef, children, toolbarHeight }: Props) {
    const elements = React.Children.map(children, item => item);

    function inject(node) {
        node && node.appendChild(canvasRef);
    }

    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                flexDirection: "column",
            }}
        >
            <div
                style={{
                    display: "flex",
                    height: toolbarHeight + "px",
                    width: "100%",
                }}
            >
                {elements}
            </div>
            <div
                style={{ display: "flex", flexGrow: "1" }}
                ref={inject}
            />
        </div>
    );
}

Layout.contextTypes = {
    game: PropTypes.object,
};

export default connect()(Layout);
