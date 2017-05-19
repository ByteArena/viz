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


const cameraVerticalOpeningOrtho = 14;
const cameraAltitude = 10;
const shadows = true;

const SQRT2 = Math.sqrt(2);
const SQRT2_HALF = Math.sqrt(2) / 2;
const ISOCOEFF = Math.sqrt(1.5);

export default function createScene({ engine, canvas }) {

    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 1);

    let isometricLeft = new Vector2(-1.0, 0);
    let isometricRight = new Vector2(1.0, 0);
    let isometricDown = new Vector2(0, -1.0);
    let isometricUp = new Vector2(0, 1.0);

    function project3DToScreenSpace(point3d) {
        const projected = Vector3.Project(
            point3d,
            Matrix.Identity(), 
            scene.getTransformMatrix(),
            camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight())
        );

        return new Vector2(projected.x, projected.y);
    }

    function getCameraIsometricPoint() {
        // determine camera center point

        const camerax = (camera.orthoRight + camera.orthoLeft) / 2;
        const cameray = (camera.orthoTop + camera.orthoBottom) / 2;

        // http://clintbellanger.net/articles/isometric_math/
        const cameraxDivTILE_WIDTH_HALF = camerax / isometricRight.x;
        const camerayDivTILE_HEIGHT_HALF = cameray / isometricUp.y;
        let mapx = (cameraxDivTILE_WIDTH_HALF + camerayDivTILE_HEIGHT_HALF) / 2;
        let mapy = (camerayDivTILE_HEIGHT_HALF - cameraxDivTILE_WIDTH_HALF) / 2;

        if(mapx === -0) mapx = 0;
        if(mapy === -0) mapy = 0;

        return new Vector2(mapx, mapy);
    }

    function threeDPointToIsometricPoint(point3d) {
        return new Vector2(point3d.x, point3d.z);
    }


    console.log(project3DToScreenSpace);
    console.log(threeDPointToIsometricPoint);
    console.log(getCameraIsometricPoint);

    scene._ = {
        toggleDebug: function() {
            scene.debugLayer.isVisible() ? scene.debugLayer.hide() : scene.debugLayer.show();
        },
        setTopView: function() {

            isometricLeft = new Vector2(-1.0, 0);
            isometricRight = new Vector2(1.0, 0);
            isometricDown = new Vector2(0, -1.0);
            isometricUp = new Vector2(0, 1.0);

            camera.position = new Vector3(0, cameraAltitude, 0);
            camera.setTarget(new Vector3(0, 0, 0));
        },
        setFrontView: function() {

            isometricLeft = new Vector2(-1.0, 0);
            isometricRight = new Vector2(1.0, 0);
            isometricDown = new Vector2(0, -SQRT2_HALF);
            isometricUp = new Vector2(0, SQRT2_HALF);

            camera.position = new Vector3(-0.000000000000001, cameraAltitude, -cameraAltitude);
            camera.setTarget(new Vector3(0, 0, 0));
        },
        setISOView: function() {

            isometricLeft = new Vector2(-SQRT2/2, -SQRT2_HALF/2);
            isometricRight = new Vector2(SQRT2/2, SQRT2_HALF/2);
            isometricDown = new Vector2(SQRT2/2, -SQRT2_HALF/2);
            isometricUp = new Vector2(-SQRT2/2, SQRT2_HALF/2);
            
            camera.position = new Vector3(-cameraAltitude*ISOCOEFF, cameraAltitude, -cameraAltitude*ISOCOEFF);
            camera.setTarget(new Vector3(0, 0, 0));
        },
        panUp: function() {
            camera.orthoLeft += 1 * isometricUp.x;
            camera.orthoRight += 1 * isometricUp.x;
            camera.orthoBottom += 1 * isometricUp.y;
            camera.orthoTop += 1 * isometricUp.y;
        },
        panDown: function() {
            camera.orthoLeft += 1 * isometricDown.x;
            camera.orthoRight += 1 * isometricDown.x;
            camera.orthoBottom += 1 * isometricDown.y;
            camera.orthoTop += 1 * isometricDown.y;
        },
        panLeft: function() {
            camera.orthoLeft += 1 * isometricLeft.x;
            camera.orthoRight += 1 * isometricLeft.x;
            camera.orthoBottom += 1 * isometricLeft.y;
            camera.orthoTop += 1 * isometricLeft.y;
        },
        panRight: function() {
            camera.orthoLeft += 1 * isometricRight.x;
            camera.orthoRight += 1 * isometricRight.x;
            camera.orthoBottom += 1 * isometricRight.y;
            camera.orthoTop += 1 * isometricRight.y;
        }
    };

    const camera = new FreeCamera(
        "camera1",
        new Vector3(0, 0, 0),
        scene
    );
    camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
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
        var halfOpening = cameraVerticalOpeningOrtho / 2 / SQRT2;
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
    /*const groundMaterial = new StandardMaterial("ground", scene);
    groundMaterial.diffuseColor = new Color3(1, 1, 1);
    ground.material = groundMaterial;
    groundMaterial.specularColor = new Color3(0, 0, 0);
    groundMaterial.emissiveColor = new Color3(1, 0.5, 0.5); // colour of the shadows
    */
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


        const camIsoPos = getCameraIsometricPoint();
        const actorIsoPos = threeDPointToIsometricPoint(actorgroundpos.position);
        
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

        //console.log("Camera is at " + camIsoPos + "; actor is at " + actorIsoPos);

        count+= 0.005;
    });

    return scene;
}
