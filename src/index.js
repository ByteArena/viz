// https://medium.com/@necsoft/three-js-101-hello-world-part-1-443207b1ebe1

import { Engine } from 'babylonjs';

import createScene from './scene';
/*import createRenderer from './renderer';
import createCamera from './camera';*/


const canvas = document.getElementById('renderCanvas');
const engine = new Engine(canvas, true);
engine.enableOfflineSupport = false; // disable mesh in-browser cache (and the 404 error for manifest files)
console.log(engine.getRenderingCanvasClientRect());

const scene = createScene({ engine, canvas });

engine.runRenderLoop(function() {
    scene.render();
});

/*const renderer = createRenderer({ getDimensions });
const camera = createCamera({ getDimensions });

window.addEventListener('resize', function() {
    const { width, height } = getDimensions();
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}, false);

const render = () => {
    scene.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
};

requestAnimationFrame(render);
*/