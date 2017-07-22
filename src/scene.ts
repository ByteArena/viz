import { Engine, Scene, Camera, SceneLoader, Mesh } from 'babylonjs';
import { AssetsManager, IAssetTask, MeshAssetTask, ImageAssetTask, TextureAssetTask } from 'babylonjs';
import { VertexData, VertexBuffer } from 'babylonjs';

import { FreeCamera } from 'babylonjs';

import { HemisphericLight } from 'babylonjs';

import { StandardMaterial } from 'babylonjs';
import { Texture } from 'babylonjs';

import { Vector2, Vector3 } from 'babylonjs';
import { Color3, Color4 } from 'babylonjs';

import * as constants from './constants';
import Projection from './projection';
import GridMaterial from './gridmaterial';
import AgentComponent from './components/agent';
import WallComponent from './components/wall';
import IsoCursorComponent from './components/isocursor';

import './protocol/vizmessage'

const scenestate = {
    pickpos: null,
};

type LoadedAssets = {
    meshes: Map<string, Mesh>,
    images: Map<string, HTMLImageElement>,
    textures: Map<string, Texture>,
};

async function loadAssets(assetsManager: AssetsManager) : Promise<LoadedAssets> {

    return await new Promise<LoadedAssets>((resolve, reject) => {
        assetsManager.onTaskError = reject;
        assetsManager.onFinish = (tasks: any[]) => {

            const assets: LoadedAssets = {
                meshes: new Map<string, Mesh>(),
                images: new Map<string, HTMLImageElement>(),
                textures: new Map<string, Texture>(),
            };

            tasks.map(task => {
                const tasknameparts = (task.name as string).split(":");
                const assettype = tasknameparts[0];
                const assetname = tasknameparts[1];

                switch(assettype) {
                    case "mesh": {
                        const meshtask = (task as MeshAssetTask);
                        const mainmesh = meshtask.loadedMeshes[0] as Mesh;
                        mainmesh.setEnabled(false);
                        
                        assets["meshes"].set(assetname, mainmesh);

                        break;
                    }
                    case "image": {
                        const imagetask = task as ImageAssetTask;
                        assets["images"].set(assetname, imagetask.image);
                        break;
                    }
                    case "texture": {
                        const texturetask = task as TextureAssetTask;
                        assets["textures"].set(assetname, texturetask.texture);
                        break;
                    }
                }
            });

            resolve(assets);
        };

        assetsManager.load();
    });
}

export default async function createScene(engine: Engine, canvas: HTMLElement) : Promise<any> {

    /* ********************************************************************* */
    /* SCENE */
    /* ********************************************************************* */
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 1);

    const assetsManager = new AssetsManager(scene);
    assetsManager.useDefaultLoadingScreen = false;

    assetsManager.addMeshTask("mesh:ship", "Ship", "/res/models/web/aliens/", "ship.babylon");
    assetsManager.addMeshTask("mesh:wall", "", "/res/models/web/", "wall.babylon");
    assetsManager.addImageTask("image:shadow", "/res/img/textures/shadow.png");

    const assets = await loadAssets(assetsManager);

    /* ********************************************************************* */
    /* CAMERA */
    /* ********************************************************************* */

    const camera = new FreeCamera(
        "camera1",
        Vector3.Zero(),
        scene
    );
    camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
    camera.minZ = -1000;

    /* ********************************************************************* */
    /* PROJECTION */
    /* ********************************************************************* */

    const projection = new Projection(scene, camera);

    /* ********************************************************************* */
    /* LIGHTING */
    /* ********************************************************************* */

    const light = new HemisphericLight(
        "hemilight",
        new Vector3(0, 1, 0),
        scene
    );
    light.intensity = 0.7;
    light.diffuse = new Color3(1, 1, 1);
    light.specular = new Color3(1, 1, 1);
    light.groundColor = new Color3(0.2, 0.2, 0.2);  // make bottom shadows less harsh

    /* ********************************************************************* */
    /* SCENE OBJECTS */
    /* ********************************************************************* */

    // GROUND
    const ground = Mesh.CreateGround("ground1", 1000, 1000, 1, scene);
    ground.material = new GridMaterial("groundMaterial", scene);
    ground.position.y = -0.001; // slightly below the y origin to avoid rendering artefacts due to coplanar meshes on y=0

    // 3D CURSOR
    const cursor3D = new IsoCursorComponent();
    cursor3D.init(scene);

    // AGENT
    const shadowmesh = Mesh.CreatePlane("actorshadow", 1.0, scene);
    shadowmesh.setEnabled(false);
    

    const shadowMaterial = new StandardMaterial("shadow", scene);
    shadowMaterial.emissiveTexture = new Texture("data:res/img/textures/shadow.png", scene, true, true, Texture.TRILINEAR_SAMPLINGMODE, () => null, () => null, assets.images.get("shadow"));
    shadowMaterial.opacityTexture = shadowMaterial.emissiveTexture;
    shadowMaterial.alphaMode = Engine.ALPHA_MULTIPLY;
    shadowmesh.material = shadowMaterial;
    shadowmesh.material.freeze();

    shadowmesh.rotation.x = constants.PI_HALF;


    /* Agent ship mesh + material */

    const shipmesh = assets.meshes.get("ship");

    shipmesh.convertToFlatShadedMesh();
    const material = shipmesh.material as StandardMaterial;
    material.unfreeze();
    material.specularColor = new Color3(0, 0, 0);
    material.emissiveTexture = material.diffuseTexture;
    material.emissiveColor = new Color3(0, 0, 0);
    material.freeze();

    AgentComponent.setup(
        shipmesh,
        shadowmesh
    );

    /* Wall mesh + material */
    const wallmesh = assets.meshes.get("wall");
    wallmesh.convertToFlatShadedMesh();
    const wallmaterial = wallmesh.material as StandardMaterial;
    wallmaterial.unfreeze();
    wallmaterial.diffuseColor = new Color3(0, 0, 0);
    wallmaterial.diffuseTexture = null;
    wallmaterial.specularColor = new Color3(0, 0, 0);
    wallmaterial.emissiveColor = new Color3(255, 255, 255);
    /*wallmaterial.subMaterials.map(material => {
        material.emissiveColor = material.diffuseColor;
    });*/
    wallmesh.material.freeze();

    WallComponent.setup(wallmesh);

    const agents = new Map<string, AgentComponent>();
    const walls = new Map<string, WallComponent>();

    // const wall = new WallComponent();
    // wall.init(scene);
    // walls.set("randomid", wall);

    // wall.setPosition(0, 0, 2, 1);

    /* ********************************************************************* */
    /* MECANICS */
    /* ********************************************************************* */
    
    scene.registerBeforeRender(() => {

        cursor3D.update(scene, { projection, point: scenestate.pickpos });

        /* Moving camera focus */
        if(agents.size > 0) {
            const agentpos = Array.from(agents)[0][1].getPosition();
            projection.follow(new Vector3(agentpos.x, 0, agentpos.z));  // 0 on y: aligning on ground
        }
    });

    return {
        scene,
        handles: {
            toggleDebug: function() {
                scene.debugLayer.isVisible() ? scene.debugLayer.hide() : scene.debugLayer.show();
            },
            setTopView: function() {
                projection.useView("top");
            },
            setFrontView: function() {
                projection.useView("front");
            },
            setISOView: function() {
                projection.useView("iso");
            },
            zoomIn: function() {
                projection.zoomIn();
                this.resize();
            },
            zoomOut: function() {
                projection.zoomOut();
                this.resize();
            },
            resize: function() {
                const viewrect = engine.getRenderingCanvasClientRect();

                const ratio = viewrect.width / viewrect.height;
                const halfOpening = projection.getCurrentView().getVerticalOpeningOrtho() / constants.SQRT2_DOUBLE;

                const newWidth = halfOpening * ratio;

                camera.orthoTop = halfOpening;
                camera.orthoLeft = -Math.abs(newWidth);
                camera.orthoRight = newWidth;
                camera.orthoBottom = -Math.abs(halfOpening);

                engine.resize();
            },
            click: function() {
                const pickResult = scene.pick(scene.pointerX, scene.pointerY);
                scenestate.pickpos = pickResult.pickedPoint;    // pos or null
            },
            setMap: function(arenamap: any) {

                arenamap.data.grounds.map((ground, index) => {

                    var groundmesh = new Mesh("ground" + index, scene);
                    groundmesh.position = Vector3.Zero();
                    //groundmesh.scaling = new Vector3(1, 1, -1);
                    var groundMaterial = new StandardMaterial("groundmaterial", scene);
                    groundMaterial.backFaceCulling = false;
                    groundMaterial.disableLighting = true;
                    groundmesh.material = groundMaterial;

                    var positions = ground.mesh.map(triangle => {
                        return [
                            [triangle[0][0], 0, triangle[0][1]],
                            [triangle[1][0], 0, triangle[1][1]],
                            [triangle[2][0], 0, triangle[2][1]],
                        ]
                    });

                    // connect the triangle dots ... counter clockwise
                    var indices = [];
                    
                    for(var i = 0; i < positions.length; i++) {
                        var offset = i*3;
                        indices.push(offset+0, offset+1, offset+2); // connect vertices 0->1->2
                    }
                    
                    // Make a mesh shaper device.
                    var vertexData = new VertexData();

                    // stuff its buffers with your stuff

                    function flatten(arr) {
                        return arr.reduce(function (flat, toFlatten) {
                            return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
                        }, []);
                    }

                    vertexData.positions = flatten(positions);
                    vertexData.indices = indices;
                    
                    // Use the vertexData object.. to shape-ify blankmesh
                    vertexData.applyToMesh(groundmesh);
                });
            },
            setVizMessage: function(vizmsg: Vizmessage) {

                const unitRatio = 1 / 50;

                const debugpoints = document.getElementById("debugpoints");
                while(debugpoints.firstChild) {
                    debugpoints.removeChild(debugpoints.firstChild);
                }

                vizmsg.DebugPoints.concat(vizmsg.DebugIntersects).forEach((debugpoint, index) => {
                    const projected = projection.project3DToScreenSpace(new Vector3(debugpoint[0] * unitRatio, 0, debugpoint[1] * unitRatio));
                    const newDebugPoint: HTMLDivElement = document.createElement("div");
                    newDebugPoint.style.left = projected.x + "px";
                    newDebugPoint.style.top = projected.y + "px";
                    debugpoints.appendChild(newDebugPoint);
                });

                vizmsg.Agents.forEach(agentinfo => {
                    let agent = null;
                    if (!agents.has(agentinfo.Id)) {
                        agent = new AgentComponent();
                        agent.init(scene);
                        agents.set(agentinfo.Id, agent);
                    } else {
                        agent = agents.get(agentinfo.Id);
                    }

                    agent.setPosition(agentinfo.Position[0] * unitRatio, agentinfo.Position[1] * unitRatio);
                    agent.setOrientation(agentinfo.Orientation);
                });

                var wall = new WallComponent();
                wall.init(scene);
                walls.set("wall", wall);

                const startpos = [0, 0];
                const endpos = [10, 10];
                wall.setPosition(startpos[0] * unitRatio, startpos[1] * unitRatio, endpos[0] * unitRatio, endpos[1] * unitRatio);

                // vizmsg.Obstacles.forEach(obstacleinfo => {

                //     let wall = null;
                //     if (!walls.has(obstacleinfo.Id)) {
                //         wall = new WallComponent();
                //         wall.init(scene);
                //         walls.set(obstacleinfo.Id, wall);

                //         const startpos = obstacleinfo.A;
                //         const endpos = obstacleinfo.B;
                //         console.log(obstacleinfo, startpos);

                //         wall.setPosition(startpos[0] * unitRatio, startpos[1] * unitRatio, endpos[0] * unitRatio, endpos[1] * unitRatio);
                //     }
                // });
            }
        }
    };
}
