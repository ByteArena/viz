// @flow

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Renderer from "../renderer";
import { css } from "emotion";

type Props = {
    children: any,
    toolbarHeight: number,
    canvasRef: Object,
    dispatch: StoreDispatch,
};

const containerClass = css`
    display flex;
    height: 100vh;
    flex-direction: column;
    font-size: 1.3em;
`;

const rendererClass = css`
    display: flex;
    flex-grow: 1;
`;


function Layout({ canvasRef, children, toolbarHeight }: Props) {
    const elements = React.Children.map(children, item => item);

    const elementClass = css`
        display flex;
        height: ${toolbarHeight}px;
        width: 100%;
    `;

    return (
        <div className={containerClass}>
            <div className={elementClass}>
                {elements}
            </div>
            <div className={rendererClass}>
                <Renderer canvasRef={canvasRef} />
            </div>
        </div>
    );
}

Layout.contextTypes = {
    game: PropTypes.object,
};

export default connect()(Layout);
