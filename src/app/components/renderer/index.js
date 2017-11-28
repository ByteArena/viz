// @flow

import React from "react";

type Props = {
    canvasRef: HTMLCanvasElement
};

const Renderer = ({ canvasRef }: Props) => {
    const inject = function(node) {
        node && node.appendChild(canvasRef);
    }

    return <div ref={inject} />;
};

export default Renderer;
