import { Scene, Camera, SceneLoader, Mesh } from 'babylonjs';
import { FreeCamera } from 'babylonjs';
//import { PointLight/*, DirectionalLight*/ } from 'babylonjs';

import { HemisphericLight } from 'babylonjs';

import { GridMaterial, StandardMaterial } from 'babylonjs';
import { Matrix } from 'babylonjs';

import { Vector2, Vector3 } from 'babylonjs';
import { Color3, Color4 } from 'babylonjs';


const cameraAltitude = 10;

const SQRT2 = Math.sqrt(2);
const SQRT2_HALF = SQRT2 / 2;
const SQRT2_FOURTH = SQRT2 / 4;
const SQRT2_DOUBLE = SQRT2 * 2;
const ISOCOEFF = Math.sqrt(1.5);

class OrthoViewAbstract {

    constructor({ name, camera, verticalopeningortho = 32 }) {
        this.name = name;
        this.camera = camera;
        this.verticalopeningortho = verticalopeningortho;
    }

    isoPointFrom3DPoint(point3d) {
        return new Vector2(point3d.x, point3d.z);
    }

    getVerticalOpeningOrtho() {
        return this.verticalopeningortho;
    }

    setVerticalOpeningOrtho(verticalopeningortho) {
        this.verticalopeningortho = verticalopeningortho;
        return this;
    }

    getFocusIsoPoint() {
    }

    activate() {
    }
}

class OrthoViewISO extends OrthoViewAbstract {

    getFocusIsoPoint() {
        const { camera } = this;
        const camerax = (camera.orthoRight + camera.orthoLeft) / 2;
        const cameray = (camera.orthoTop + camera.orthoBottom) / 2;

        // http://clintbellanger.net/articles/isometric_math/
        const cameraxDivTILE_WIDTH_HALF = camerax / SQRT2_HALF;
        const camerayDivTILE_HEIGHT_HALF = cameray / SQRT2_FOURTH;
        let mapx = (cameraxDivTILE_WIDTH_HALF + camerayDivTILE_HEIGHT_HALF) / 2;
        let mapy = (camerayDivTILE_HEIGHT_HALF - cameraxDivTILE_WIDTH_HALF) / 2;

        if(mapx === -0) mapx = 0;
        if(mapy === -0) mapy = 0;

        return new Vector2(mapx, mapy);
    }

    activate() {
        this.camera.position = new Vector3(-cameraAltitude*ISOCOEFF, cameraAltitude, -cameraAltitude*ISOCOEFF);
        this.camera.setTarget(Vector3.Zero());
    }
}

class OrthoViewFront extends OrthoViewAbstract {

    getFocusIsoPoint() {
        const { camera } = this; 
        const camerax = (camera.orthoRight + camera.orthoLeft) / 2;
        const cameray = (camera.orthoTop + camera.orthoBottom) / SQRT2;
        return new Vector2(camerax, cameray);
    }

    activate() {
        this.camera.position = new Vector3(-0.000000000000001, cameraAltitude, -cameraAltitude);
        this.camera.setTarget(Vector3.Zero());
    }
}

class OrthoViewTop extends OrthoViewAbstract {

    getFocusIsoPoint() {
        const { camera } = this;
        const camerax = (camera.orthoRight + camera.orthoLeft) / 2;
        const cameray = (camera.orthoTop + camera.orthoBottom) / 2;
        return new Vector2(camerax, cameray);
    }

    activate() {
        this.camera.position = new Vector3(0, cameraAltitude, 0);
        this.camera.setTarget(Vector3.Zero());
    }
}

export default function createScene({ engine, canvas }) {

    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 1);

    function project3DToScreenSpace(point3d) {
        const projected = Vector3.Project(
            point3d,
            Matrix.Identity(), 
            scene.getTransformMatrix(),
            scene.activeCamera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight())
        );

        return new Vector2(projected.x, projected.y);
    }

    console.log(project3DToScreenSpace);

    const camera = new FreeCamera(
        "camera1",
        Vector3.Zero(),
        scene
    );
    camera.mode = Camera.ORTHOGRAPHIC_CAMERA;

    const topView = new OrthoViewTop({ name: "topview", camera, verticalopeningortho: 32 });
    const frontView = new OrthoViewFront({ name: "frontview", camera, verticalopeningortho: 32 });
    const isoView = new OrthoViewISO({ name: "isoview", camera, verticalopeningortho: 32 });

    let currentview = isoView;
    currentview.activate();

    scene._ = {
        toggleDebug: function() {
            scene.debugLayer.isVisible() ? scene.debugLayer.hide() : scene.debugLayer.show();
        },
        setTopView: function() {
            currentview = topView;
            currentview.activate();
        },
        setFrontView: function() {
            currentview = frontView;
            currentview.activate();
        },
        setISOView: function() {
            currentview = isoView;
            currentview.activate();
        },
        zoomIn: function() {
            const currentopening = currentview.getVerticalOpeningOrtho();
            if(currentopening <= 8) return;
            currentview.setVerticalOpeningOrtho(
                currentopening - 4
            );
            resize();
        },
        zoomOut: function() {
            currentview.setVerticalOpeningOrtho(
                currentview.getVerticalOpeningOrtho() + 4
            );
            resize();
        },
        panUp: function() {
        },
        panDown: function() {
        },
        panLeft: function() {
        },
        panRight: function() {
        }
    };

    scene._.setISOView();

    const hemilight = new HemisphericLight(
        "hemilight",
        new Vector3(0, 1, 0),
        scene
    );
    hemilight.intensity = 0.7;
    hemilight.diffuse = new Color3(1, 1, 1);
    hemilight.specular = new Color3(1, 1, 1);
    hemilight.groundColor = new Color3(0.2, 0.2, 0.2);  // make bottom shadows less harsh

    /*const light = new DirectionalLight(
        "*spot00",
        new Vector3(15, -15, 5).normalize(),
        scene
    );
    light.intensity = 1;
    light.diffuse = new Color3(1, 1, 0.95);
    light.position = new Vector3(-5, 10, -5);
    */

    const resize = () => {
        const viewrect = engine.getRenderingCanvasClientRect();

        var ratio = viewrect.width / viewrect.height;
        var halfOpening = currentview.getVerticalOpeningOrtho() / SQRT2_DOUBLE;

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
    const ground = Mesh.CreateGround("ground1", 60, 60, 1, scene);
    ground.material = new GridMaterial("groundMaterial", scene);

    const cameratarget = Mesh.CreateBox("cameratarget", 0.2, scene);
    cameratarget.position.y = 0;
    cameratarget.material = new StandardMaterial("cameratarget", scene);
    cameratarget.material.emissiveColor = new Color3(0, 0, 1);
    cameratarget.material.specularColor = new Color3(0, 0, 0);


    const actorgroundpos = Mesh.CreateBox("actorgroundpos", 0.01, scene);
    actorgroundpos.position.y = 0;
    actorgroundpos.scaling = new Vector3(1, 150, 1);
    actorgroundpos.material = new StandardMaterial("actorgroundpos", scene);
    actorgroundpos.material.emissiveColor = new Color3(1, 0, 0);
    actorgroundpos.material.specularColor = new Color3(0, 0, 0);

    const cube = Mesh.CreateBox("isocube", 1, scene);
    cube.position.y = 0.5;
    cube.material = new StandardMaterial("isocube", scene);
    cube.material.emissiveColor = new Color3(0, 0, 0);
    cube.material.alpha = 0.5;

    let actor = null;

    // The first parameter can be used to specify which mesh to import. Here we import all meshes
    //SceneLoader.ImportMesh("", "res/models/web/", "ship-helico-game.babylon", scene, function (newMeshes) {
    //const model = "alien2.babylon";
    const model = "ship.babylon";

    SceneLoader.ImportMesh("", "res/models/web/aliens/", model, scene, function (meshes, particleSystems, skeletons) {

        actor = meshes[0];
        actor.position.y = 1;
        //actor.rotation.x = -Math.PI/2;
        actor.rotation.y = Math.PI;
        actor.scaling = new Vector3(0.2, 0.2, 0.2);

        /*
        const shadeless = new StandardMaterial("shadeless", scene);
        shadeless.diffuseColor = new BABYLON.Color3(0, 0, 0);
        shadeless.specularColor = new BABYLON.Color3(0, 0, 0);
        shadeless.emissiveTexture = shadeless.diffuseTexture;
        shadeless.diffuseTexture = null;
        */

        actor.getChildMeshes().map(mesh => {
            //mesh.material.diffuseColor = new Color4(0, 0, 0, 0);
            mesh.material.specularColor = new Color3(0, 0, 0);
            mesh.material.emissiveTexture = mesh.material.diffuseTexture;
            mesh.material.emissiveColor = new Color4(0, 0, 0, 0);
            //mesh.material.diffuseTexture = null;
            mesh.material.freeze();
        });

        actor.material.freeze();
    });

    let count = 0;
    let ox = 0; let oz = 0;

    let radius = 3;

    // Move the light with the camera
    scene.registerBeforeRender(function () {
        if(!actor) return;

        actor.position.x = ox + radius * Math.sin(count);
        actor.position.z = oz - radius * Math.cos(count);

        const pos = new Vector2(actor.position.x, actor.position.z);
        const tangentvec = new Vector2(pos.y, -pos.x);
        const rotation = Math.atan2(tangentvec.y, tangentvec.x);

        actor.rotation.y = -rotation - Math.PI/2;
        //actor.rotation.x = -Math.PI/2;

        actorgroundpos.position.x = actor.position.x;
        actorgroundpos.position.z = actor.position.z;
        actorgroundpos.position.y = 0;

        const projected = project3DToScreenSpace(actorgroundpos.position);
        const screenspacepoint = document.getElementById("screenspacepoint");
        screenspacepoint.style.left = projected.x + "px";
        screenspacepoint.style.top = projected.y + "px";


        const camIsoPos = currentview.getFocusIsoPoint();
        const actorIsoPos = currentview.isoPointFrom3DPoint(actorgroundpos.position);
        
         // calculate vector to destination
        const travelIso = actorIsoPos.subtract(camIsoPos);

        // Dampening the movement for smoother curves
        // This causes the camera focus to "lag" some pixels behind the actual target (when it's moving), but it's undetectable, ang produces a nicer effect overall
        const dampeningfac = 0.1;

        camera.orthoLeft += travelIso.x*dampeningfac;
        camera.orthoRight += travelIso.x*dampeningfac;

        camera.orthoBottom += travelIso.y*dampeningfac;
        camera.orthoTop += travelIso.y*dampeningfac;

        //console.log("Camera is at " + currentview.getFocusIsoPoint() + "; actor is at " + actorIsoPos);

        count+= 0.005;
    });

    return scene;
}
