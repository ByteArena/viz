// @flow

import React from "react";
import { css } from "emotion";

import Renderer from "../renderer";
import Notifier from "../notifier";

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
                <Notifier />
            </div>
        </div>
    );
}

export default Layout;
