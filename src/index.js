// https://medium.com/@necsoft/three-js-101-hello-world-part-1-443207b1ebe1

import getDimensions from './dimensions';
import createScene from './scene';
import createRenderer from './renderer';
import createCamera from './camera';

const scene = createScene();
const renderer = createRenderer({ getDimensions });
const camera = createCamera({ getDimensions });

/* Rooting in the browser */
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', function() {
    const { width, height } = getDimensions();
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}, false);

/* Render loop */
const render = () => {
    scene.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
};

requestAnimationFrame(render);
