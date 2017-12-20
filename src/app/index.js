// @flow

import React from "react";

import Layout from "./components/layout";
import MenuBar from "./components/menubar";

type Props = {
    canvasRef: Object,
    toolbarHeight: number,
};

export function App({ canvasRef, toolbarHeight }: Props) {
    return (
        <div>
            <Layout
                toolbarHeight={toolbarHeight}
                canvasRef={canvasRef}
            >
                <MenuBar height={toolbarHeight} />
            </Layout>
        </div>
    );
}
