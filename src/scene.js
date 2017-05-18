import { Scene, Camera, SceneLoader, Mesh } from 'babylonjs';
import { Vector2, Vector3 } from 'babylonjs';
import { HemisphericLight } from 'babylonjs';
import { ArcRotateCamera } from 'babylonjs';
//import { UniversalCamera } from 'babylonjs';
//import { PointLight } from 'babylonjs';
import { Color3 } from 'babylonjs';

export default function createScene({ engine, canvas }) {

    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new Scene(engine);

    const camera = new ArcRotateCamera(
        "camera1",          // name
        1,
        1,
        1,
        new Vector3(0, 0, 0),     // target
        scene
    );
    camera.setPosition(new Vector3(
        -10,
        10,
        -10
    ));

    //camera.attachControl(canvas, true);
    camera.mode = Camera.ORTHOGRAPHIC_CAMERA;

    const light = new HemisphericLight(
        "light1",                   // name
        new Vector3(0, 10, 0),       // direction to the sky
        scene
    );

    light.intensity = 1;
    light.diffuse = new Color3(1, 1, 1);
    light.specular = new Color3(1, 1, 1);
    light.groundColor = new Color3(0.4, 0.4, 0.4);  // make bottom shadows less harsh

    const resize = () => {
        const viewrect = engine.getRenderingCanvasClientRect();

        var ratio = viewrect.width / viewrect.height;
        var opening = 10;
        var halfOpening = opening / 2;
        var newWidth = halfOpening * ratio;

        camera.orthoTop = halfOpening;
        camera.orthoLeft = -Math.abs(newWidth);
        camera.orthoRight = newWidth;
        camera.orthoBottom = -Math.abs(halfOpening);

        engine.resize();
    };

    window.addEventListener('resize', resize);
    resize();

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    Mesh.CreateGround("ground1", 10, 10, 1, scene);

    let actor = null;

    // The first parameter can be used to specify which mesh to import. Here we import all meshes
    SceneLoader.ImportMesh("", "res/models/web/", "ship-helico-game.babylon", scene, function (newMeshes) {
        // Set the target of the camera to the first imported mesh
        actor = newMeshes[0];
        actor.showBoundingBox = true;
    });

    let count = 0;
    let ox = 0; let oz = 0;

    let radius = 3;

    // Move the light with the camera
    scene.registerBeforeRender(function () {
        if(actor === null) return;

        actor.position.x = ox + radius * Math.sin(count);
        actor.position.z = oz - radius * Math.cos(count);

        const pos = new Vector2(actor.position.x, actor.position.z);
        const tangentvec = new Vector2(pos.y, -pos.x);
        const rotation = Math.atan2(tangentvec.y, tangentvec.x);

        actor.rotation.y = -rotation + Math.PI*0.5;

        count+= 0.01;
    });

    return scene;
}
