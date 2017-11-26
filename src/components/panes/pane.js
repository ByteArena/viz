// @flow

import React from "react";
import PropTypes from "prop-types";
import SplitPane from "react-split-pane";
import { css } from "emotion";
import { connect } from "react-redux"

import actions from "../../actions";

const resizerStyle = {
    width: "5px",
    zIndex: "1000",
    minWidth: "5px",
    background: "lightgray",
    cursor: "col-resize",
    borderLeft: "1px solid gray",
    borderRight: "1px solid gray",
    boxSizing: "border-box",
    backgroundClip: "padding-box",
};

const elementClassName = css`margin: 7px;`;

type Props = {
    children: any,
    size: number,
    className: string,
    canvasRef: Object,
    dispatch: StoreDispatch,
};

function Element({ children }: any) {
    return <div className={elementClassName}>{children}</div>;
}

function Pane(
    { canvasRef, className, children, size, dispatch }: Props,
) {
    const elements = React.Children.map(children, item => (
        <Element>{item}</Element>
    ));

    function inject(node) {
        node && node.appendChild(canvasRef);
    }

    function onDragFinished() {
        //const { width } = canvasRef.getBoundingClientRect();
        //dispatch(actions.game.resize(pc.FILLMODE_NONE, width, window.innerHeight));
        window.dispatchEvent(new Event('resize'));
    }

    return (
        <SplitPane
            defaultSize={100 - size + "%"}
            onDragFinished={onDragFinished}
            resizerStyle={resizerStyle}
            split="vertical"
        >
            <div ref={inject} />

            <div className={className}>{elements}</div>
        </SplitPane>
    );
}

Pane.contextTypes = {
    game: PropTypes.object,
};

export default connect()(Pane);
