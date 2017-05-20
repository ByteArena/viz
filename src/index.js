// https://medium.com/@necsoft/three-js-101-hello-world-part-1-443207b1ebe1

import { Engine } from 'babylonjs';

import createScene from './scene';

const canvas = document.getElementById('renderCanvas');
const engine = new Engine(canvas, true);    // true: webgl AA
engine.enableOfflineSupport = false; // disable mesh in-browser cache (and the 404 error for manifest files)
console.log(engine.getRenderingCanvasClientRect());

const scene = createScene({ engine, canvas });

engine.runRenderLoop(function() {
    scene.render();
});

document.getElementById("debug").addEventListener("click", () => scene._.toggleDebug());

document.getElementById("topview").addEventListener("click", () => scene._.setTopView());
document.getElementById("isoview").addEventListener("click", () => scene._.setISOView());
document.getElementById("frontview").addEventListener("click", () => scene._.setFrontView());

document.getElementById("zoomin").addEventListener("click", () => scene._.zoomIn());
document.getElementById("zoomout").addEventListener("click", () => scene._.zoomOut());

/*
document.getElementById("cam-left").addEventListener("click", () => scene._.panLeft());
document.getElementById("cam-right").addEventListener("click", () => scene._.panRight());
document.getElementById("cam-up").addEventListener("click", () => scene._.panUp());
document.getElementById("cam-down").addEventListener("click", () => scene._.panDown());
*/