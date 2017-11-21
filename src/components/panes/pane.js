// @flow

import React from "react";
import PropTypes from "prop-types";
import SplitPane from "react-split-pane";
import { css } from "emotion";

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
};

type Context = {
    game: Game,
}

function Element({ children }: any) {
    return (
        <div className={elementClassName}>
            {children}
        </div>
    );
}

export function Pane({ canvasRef, className, children, size }: Props, { game }: Context) {
    const elements = React.Children.map(children, item => (
        <Element>
            {item}
        </Element>
    ));

    function inject(node) {
        (node) && node.appendChild(canvasRef);
    }

    function onDragFinished() {
        const {width} = canvasRef.getBoundingClientRect();

        (game) && game.getApp().setCanvasFillMode(
            pc.FILLMODE_NONE,
            width,
            window.innerHeight,
        );
    }

    return (
        <SplitPane
            onDragFinished={onDragFinished}
            defaultSize={100 - size + "%"}
            resizerStyle={resizerStyle}
            split="vertical"
        >
            <div ref={inject} />

            <div className={className}>
                {elements}
            </div>
        </SplitPane>
    );
}

Pane.contextTypes = {
    game: PropTypes.object,
}
