import { Scene, Fog } from 'three';
import { BoxGeometry, MeshPhongMaterial, Mesh } from 'three';

import createLights from './lights';

export default function createScene() {

    const scene = new Scene();
    scene.fog = new Fog(0xf7d9aa, 100, 950);

    // Create a Cube Mesh with basic material
    const geometry = new BoxGeometry(20, 20, 20);
    const material = new MeshPhongMaterial({ color: "#FF0000" });
    const cube = new Mesh(geometry, material);
    cube.position.x = 0;
    cube.position.y = 100;
    cube.position.z = 120;

    // Add cube to Scene
    scene.add(cube);

    createLights({ scene });

    scene.update = function() {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }

    return scene;
}
