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
//import GridMaterial from './gridmaterial';
import AgentComponent from './components/agent';
import RocksTallOreComponent from './components/rocksTallOre';
import IsoCursorComponent from './components/isocursor';

import './protocol/vizmessage'

const valueMapRange = function(n: number, start1: number, stop1: number, start2: number, stop2: number) : number {
	return ((n-start1)/(stop1-start1))*(stop2-start2) + start2
};

const scenestate = {
    pickpos: null,
};

type LoadedAssets = {
    meshes: Map<string, Mesh>,
    images: Map<string, HTMLImageElement>,
    textures: Map<string, Texture>,
};

const mapServer = "http://bytearena.com/maps";
const map = "deathmatch/desert/death-valley";

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
    assetsManager.addMeshTask("mesh:rocksTallOre", "rocksTallOre", mapServer + "/" + map + "/res/models/", "rocksTallOre.babylon");
    assetsManager.addImageTask("image:shadow", "/res/img/textures/shadow.png");
    assetsManager.addImageTask("image:desert", mapServer + "/" + map + "/res/textures/sand.jpg");

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
    //const ground = Mesh.CreateGround("ground1", 1000, 1000, 1, scene);
    //ground.material = new GridMaterial("groundMaterial", scene);
    //ground.position.y = -0.001; // slightly below the y origin to avoid rendering artefacts due to coplanar meshes on y=0

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
    const agentmaterial = shipmesh.material as StandardMaterial;
    agentmaterial.unfreeze();
    agentmaterial.specularColor = new Color3(0, 0, 0);
    agentmaterial.emissiveTexture = agentmaterial.diffuseTexture;
    agentmaterial.emissiveColor = new Color3(0, 0, 0);
    agentmaterial.freeze();

    AgentComponent.setup(
        shipmesh,
        shadowmesh
    );

    const agents = new Map<string, AgentComponent>();

    /* Obstacles meshs + materials */

    const rocksTallOreMesh = assets.meshes.get("rocksTallOre");
    
    rocksTallOreMesh.convertToFlatShadedMesh();
    const rocksTallOreMaterial = shipmesh.material as StandardMaterial;
    rocksTallOreMaterial.unfreeze();
    rocksTallOreMaterial.specularColor = new Color3(0, 0, 0);
    rocksTallOreMaterial.emissiveTexture = rocksTallOreMaterial.diffuseTexture;
    rocksTallOreMaterial.emissiveColor = new Color3(0, 0, 0);
    rocksTallOreMaterial.freeze();

    RocksTallOreComponent.setup(
        rocksTallOreMesh
    );

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

        //projection.follow(new Vector3(100, 0, 100));  // 0 on y: aligning on ground
    });

    return {
        scene,
        handles: {
            toggleDebug: function() {
                //scene.debugLayer.isVisible() ? scene.debugLayer.hide() : scene.debugLayer.show();
                scene.debugLayer.show();
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
                const focus = projection.getCurrentView().getFocusIsoPoint();
                projection.zoomIn();
                this.resize(focus);
            },
            zoomOut: function() {
                const focus = projection.getCurrentView().getFocusIsoPoint();
                projection.zoomOut();
                this.resize(focus);
            },
            setZoom: function(zoompercent: number) {
                const focus = projection.getCurrentView().getFocusIsoPoint();
                projection.getCurrentView().setZoom(zoompercent);
                this.resize(focus);
            },
            resize: function(focuspoint: Vector2|null) {
                const viewrect = engine.getRenderingCanvasClientRect();

                const ratio = viewrect.width / viewrect.height;
                const verticalOpening = projection.getCurrentView().getVerticalOpeningOrtho();
                const horizontalOpening = verticalOpening * ratio;
                const halfVerticalOpening = verticalOpening / 2;
                const halfHorizontalOpening = horizontalOpening / 2;

                if(focuspoint) {
                    console.log("AVANT", camera.orthoTop, camera.orthoBottom, camera.orthoRight, camera.orthoLeft);
                    camera.orthoTop = focuspoint.y + halfVerticalOpening;
                    camera.orthoBottom = focuspoint.y -halfVerticalOpening;
                    camera.orthoRight = focuspoint.x + halfHorizontalOpening;
                    camera.orthoLeft = focuspoint.x - halfHorizontalOpening;
                    console.log("APRES", camera.orthoTop, camera.orthoBottom, camera.orthoRight, camera.orthoLeft);
                } else {
                    camera.orthoTop = halfVerticalOpening;
                    camera.orthoBottom = -halfVerticalOpening;
                    camera.orthoRight = halfHorizontalOpening;
                    camera.orthoLeft = -halfHorizontalOpening;
                }

                engine.resize();
            },
            click: function() {
                const pickResult = scene.pick(scene.pointerX, scene.pointerY);
                scenestate.pickpos = pickResult.pickedPoint;    // pos or null
            },
            setMap: function(arenamap: any) {

                // Grounds setup
                arenamap.data.grounds.map((ground, index) => {

                    var groundmesh = new Mesh("ground" + index, scene);
                    groundmesh.position = new Vector3(0, -0.001, 0);

                    const groundMaterial = new StandardMaterial("desert", scene);
                    const desertTexture = new Texture(
                        "data:image(desert)",
                        scene,
                        true,
                        true,
                        Texture.TRILINEAR_SAMPLINGMODE,
                        () => null,
                        () => null,
                        assets.images.get("desert")
                    );
                    desertTexture.uScale = 50.0;
                    desertTexture.vScale = 50.0;
                    groundMaterial.diffuseTexture = desertTexture;
                    groundMaterial.emissiveTexture = desertTexture;

                    groundmesh.material = groundMaterial;
                    groundmesh.material.freeze();

                    // Make a mesh shaper device.
                    var vertexData = new VertexData();
                    vertexData.positions = ground.mesh.vertices;
                    vertexData.indices = ground.mesh.indices;
                    vertexData.uvs = ground.mesh.uvs;
                    
                    // Use the vertexData object.. to shape-ify blankmesh
                    vertexData.applyToMesh(groundmesh);
                });

                // Field objects setup
                console.log(arenamap.data);
                arenamap.data.objects.map((object, index) => {

                    console.log(object, index);

                    let objectInstance : RocksTallOreComponent;

                    switch(object.type) {
                        case "rocksTallOre": {
                            objectInstance = new RocksTallOreComponent();
                            break;
                        }
                        default: {
                            throw new Error("Cannot find mesh type: " + object.type);
                        }
                    }

                    objectInstance.init(scene);
                    objectInstance.setPosition(
                        object.point[0],      // x (latéral)
                        object.point[1],      // z (profondeur)
                    );
                    objectInstance.setScale(new Vector3(object.diameter, object.diameter, object.diameter));

                    // var groundmesh = new Mesh("ground" + index, scene);
                    // groundmesh.position = new Vector3(0, -0.001, 0);

                    // const groundMaterial = new StandardMaterial("desert", scene);
                    // const desertTexture = new Texture(
                    //     "data:image(desert)",
                    //     scene,
                    //     true,
                    //     true,
                    //     Texture.TRILINEAR_SAMPLINGMODE,
                    //     () => null,
                    //     () => null,
                    //     assets.images.get("desert")
                    // );
                    // desertTexture.uScale = 50.0;
                    // desertTexture.vScale = 50.0;
                    // groundMaterial.diffuseTexture = desertTexture;
                    // groundMaterial.emissiveTexture = desertTexture;

                    // groundmesh.material = groundMaterial;
                    // groundmesh.material.freeze();

                    // // Make a mesh shaper device.
                    // var vertexData = new VertexData();
                    // vertexData.positions = ground.mesh.vertices;
                    // vertexData.indices = ground.mesh.indices;
                    // vertexData.uvs = ground.mesh.uvs;
                    
                    // // Use the vertexData object.. to shape-ify blankmesh
                    // vertexData.applyToMesh(groundmesh);
                });


            },
            setVizMessage: function(vizmsg: Vizmessage) {

                const unitRatio = 1.0;

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
            }
        }
    };
}
