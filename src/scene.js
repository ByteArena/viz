import { Scene, Camera, SceneLoader, Mesh } from 'babylonjs';
import { Vector2, Vector3 } from 'babylonjs';

//import { HemisphericLight } from 'babylonjs';
//import { SpotLight } from 'babylonjs';
import { PointLight } from 'babylonjs';
import { DirectionalLight } from 'babylonjs';

//import { ArcRotateCamera } from 'babylonjs';
import { FreeCamera } from 'babylonjs';
//import { FollowCamera } from 'babylonjs';
import { ShadowGenerator } from 'babylonjs';
//import { UniversalCamera } from 'babylonjs';
import { Color3, Color4 } from 'babylonjs';
import { StandardMaterial } from 'babylonjs';
import { GridMaterial } from 'babylonjs';
import { Matrix } from 'babylonjs';


const cameraAltitude = 10;
const shadows = true;

const SQRT2 = Math.sqrt(2);
const SQRT2_HALF = Math.sqrt(2) / 2;
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
        const cameraxDivTILE_WIDTH_HALF = camerax / (SQRT2 / 2);
        const camerayDivTILE_HEIGHT_HALF = cameray / (SQRT2_HALF / 2);
        let mapx = (cameraxDivTILE_WIDTH_HALF + camerayDivTILE_HEIGHT_HALF) / 2;
        let mapy = (camerayDivTILE_HEIGHT_HALF - cameraxDivTILE_WIDTH_HALF) / 2;

        if(mapx === -0) mapx = 0;
        if(mapy === -0) mapy = 0;

        return new Vector2(mapx, mapy);
    }

    activate() {
        this.camera.position = new Vector3(-cameraAltitude*ISOCOEFF, cameraAltitude, -cameraAltitude*ISOCOEFF);
        this.camera.setTarget(new Vector3(0, 0, 0));
    }
}

class OrthoViewFront extends OrthoViewAbstract {

    getFocusIsoPoint() {
        const { camera } = this; 
        const camerax = (camera.orthoRight + camera.orthoLeft) / 2;
        const cameray = (camera.orthoTop + camera.orthoBottom) / 2 / SQRT2_HALF;
        return new Vector2(camerax, cameray);
    }

    activate() {
        this.camera.position = new Vector3(-0.000000000000001, cameraAltitude, -cameraAltitude);
        this.camera.setTarget(new Vector3(0, 0, 0));
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
        this.camera.setTarget(new Vector3(0, 0, 0));
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
        new Vector3(0, 0, 0),
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

    const hemilight = new PointLight(
        "hemilight",
        new Vector3(5, 10, -5),
        scene
    );
    hemilight.intensity = 1;
    hemilight.diffuse = new Color3(0.4, 0.4, 0.35);
    hemilight.specular = new Color3(1, 1, 1);
    hemilight.groundColor = new Color3(0.2, 0.2, 0.2);  // make bottom shadows less harsh

    const light = new DirectionalLight(
        "*spot00",
        new Vector3(15, -15, 5).normalize(),
        scene
    );
    light.intensity = 1;
    light.diffuse = new Color3(1, 1, 0.95);
    light.position = new Vector3(-5, 10, -5);

    const resize = () => {
        const viewrect = engine.getRenderingCanvasClientRect();

        var ratio = viewrect.width / viewrect.height;
        var halfOpening = currentview.getVerticalOpeningOrtho() / 2 / SQRT2;
        console.log("halfOpening", halfOpening);
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
    ground.receiveShadows = true;
    ground.material = new GridMaterial("groundMaterial", scene);

    const cameratarget = Mesh.CreateSphere("cameratarget", 8, 0.2, scene);
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

    let shadowGenerator;
    if(shadows) {
        
        shadowGenerator = new ShadowGenerator(1024, light);
        shadowGenerator.useBlurVarianceShadowMap = true;
        shadowGenerator.blurScale = 1;

        light.includedOnlyMeshes.push(ground);
    }

    // The first parameter can be used to specify which mesh to import. Here we import all meshes
    SceneLoader.ImportMesh("", "res/models/web/", "ship-helico-game.babylon", scene, function (newMeshes) {
        // Set the target of the camera to the first imported mesh

        actor = newMeshes[0];
        actor.position.y = 0;

        if(shadows) {
            light.includedOnlyMeshes.push(actor);
            shadowGenerator.getShadowMap().renderList.push(actor);

            actor.getChildren().map(submesh => {
                shadowGenerator.getShadowMap().renderList.push(submesh);
                light.includedOnlyMeshes.push(submesh);
            });
        }
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

        actor.rotation.y = -rotation + Math.PI*0.5;

        actorgroundpos.position.x = actor.position.x;
        actorgroundpos.position.z = actor.position.z;
        actorgroundpos.position.y = 0;
        actorgroundpos.rotation = actor.rotation; 

        const projected = project3DToScreenSpace(actorgroundpos.position);
        const screenspacepoint = document.getElementById("screenspacepoint");
        screenspacepoint.style.left = projected.x + "px";
        screenspacepoint.style.top = projected.y + "px";


        const camIsoPos = currentview.getFocusIsoPoint();
        const actorIsoPos = currentview.isoPointFrom3DPoint(actorgroundpos.position);
        
         // calculate vector to destination
        let travelIso = actorIsoPos.subtract(camIsoPos);

        const maxdist = 0.1;
        const maxdistsq = maxdist * maxdist;

        if(travelIso.lengthSquared() > maxdistsq) {
            travelIso = travelIso.normalize().multiplyInPlace(new Vector3(maxdist, maxdist, maxdist));
        }

        camera.orthoLeft += travelIso.x;
        camera.orthoRight += travelIso.x;

        camera.orthoBottom += travelIso.y;
        camera.orthoTop += travelIso.y;

        //console.log("Camera is at " + currentview.getFocusIsoPoint() + "; actor is at " + actorIsoPos);

        count+= 0.005;
    });

    return scene;
}
