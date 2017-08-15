// https://medium.com/@necsoft/three-js-101-hello-world-part-1-443207b1ebe1

import { Engine } from 'babylonjs';

import createScene from './scene';
import comm from './comm';

export default async function main(canvas: HTMLCanvasElement, wsurl: string, tps: number, cdnbaseurl: string) : Promise<any> {

    const engine = new Engine(canvas, true);    // true: webgl AA
    engine.enableOfflineSupport = null; // disable mesh in-browser cache (and the 404 error for manifest files)
    //console.log(engine.getRenderingCanvasClientRect());

    const { scene, handles } = await createScene(engine, canvas, cdnbaseurl);

    window.addEventListener('resize', function(e) { handles.resize(); });
    window.addEventListener('click', handles.click);

    handles.resize();

    engine.runRenderLoop(function() {
        scene.render();
    });

    document.getElementById("debug").addEventListener("click", e => {
        e.stopPropagation();
        handles.toggleDebug();
    });

    document.getElementById("topview").addEventListener("click", e => {
        e.stopPropagation();
        handles.setTopView();
    });

    document.getElementById("frontview").addEventListener("click", e => {
        e.stopPropagation();
        handles.setFrontView();
    });

    document.getElementById("isoview").addEventListener("click", e => {
        e.stopPropagation();
        handles.setISOView();
    });

    document.getElementById("zoomin").addEventListener("click", e => {
        e.stopPropagation();
        handles.zoomIn();
    });

    document.getElementById("zoomout").addEventListener("click", e => {
        e.stopPropagation();
        handles.zoomOut();
    });

    // document.getElementById("zoomslider").addEventListener("input", e => {
    //     e.stopPropagation();
    //     handles.setZoom(e.target.value);
    // });

    comm(wsurl, tps, handles.setMap, handles.setVizMessage);
}
