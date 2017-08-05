import { Engine, Scene, Mesh, FreeCamera } from 'babylonjs';
import { HemisphericLight, DirectionalLight } from 'babylonjs';
import { AssetsManager, VertexData, Vector3, Color3, Color4 } from 'babylonjs';
import { StandardMaterial, Texture } from 'babylonjs';

import * as constants from './constants';
import Projection from './projection';
import AgentComponent from './components/agent';
import SceneComponent from './components/scenecomponent';
import BasicComponentBuilder from './components/BasicComponentBuilder';
import IsoCursorComponent from './components/isocursor';

import AwesomeCamera from './awesomecamera';
import loadAssets from './loadAssets';
import './protocol/vizmessage'

//import GridMaterial from './gridmaterial';

const scenestate = { pickpos: null };
const mapServer = "http://bytearena.com/maps";
const map = "deathmatch/desert/death-valley";


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
    assetsManager.addMeshTask("mesh:crater", "crater", mapServer + "/" + map + "/res/models/", "crater.babylon");
    assetsManager.addMeshTask("mesh:rock02", "rocks", mapServer + "/" + map + "/res/models/", "rock02.babylon");
    assetsManager.addMeshTask("mesh:rock03", "rocksSmall", mapServer + "/" + map + "/res/models/", "rock03.babylon");
    assetsManager.addMeshTask("mesh:satellite01", "satelliteDishAntenna", mapServer + "/" + map + "/res/models/", "satellite01.babylon");
    assetsManager.addImageTask("image:shadow", "/res/img/textures/shadow.png");
    //assetsManager.addImageTask("image:desert", mapServer + "/" + map + "/res/textures/sand.jpg");

    const assets = await loadAssets(assetsManager);

    /* ********************************************************************* */
    /* CAMERA */
    /* ********************************************************************* */

    const awcam = new AwesomeCamera(scene);
    const projection = new Projection(scene);

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
    light.specular = new Color3(0, 0, 0);
    //light.groundColor = new Color3(0.4, 0.4, 0.4);  // make bottom shadows less harsh

    //////////////////////////////////////
    // Sunset
    //
    // const light2 = new DirectionalLight("Dir0", new Vector3(10, -1, -0.8), scene);
    // light2.intensity = 0.8;
    // light2.diffuse = new Color3(1, 0.6, 0.6);
    // light2.specular = new Color3(1, 1, 1);


    //////////////////////////////////////
    // Day
    //
    const light2 = new DirectionalLight("Dir0", new Vector3(-1, -1, 0.8), scene);
    light2.intensity = 0.8;
    light2.diffuse = new Color3(0.7, 0.8, 1.0);
    light2.specular = new Color3(0, 0, 0);

    /* ********************************************************************* */
    /* SCENE OBJECTS */
    /* ********************************************************************* */

    // GRID GROUND (debug)
    /*
    const ground = Mesh.CreateGround("ground1", 1000, 1000, 1, scene);
    ground.material = new GridMaterial("groundMaterial", scene);
    ground.position.y = -0.1; // slightly below the y origin to avoid rendering artefacts due to coplanar meshes on y=0
    */

    // 3D CURSOR
    const cursor3D = new IsoCursorComponent();
    cursor3D.init(scene);
    cursor3D.setProjection(projection);

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

    /* Rocks01 */

    const Rock01Component = BasicComponentBuilder();
    Rock01Component.setup(assets.meshes.get("rocksTallOre"));

    const Rock02Component = BasicComponentBuilder();
    Rock02Component.setup(assets.meshes.get("rock02"));

    const Rock03Component = BasicComponentBuilder();
    Rock03Component.setup(assets.meshes.get("rock03"));

    const Crater01Component = BasicComponentBuilder();
    Crater01Component.setup(assets.meshes.get("crater"));

    // const Crater02Component = BasicComponentBuilder();
    // Crater02Component.setup(assets.meshes.get("crater02"));

    const Satellite01Component = BasicComponentBuilder();
    Satellite01Component.setup(assets.meshes.get("satellite01"));

    /* ********************************************************************* */
    /* MECANICS */
    /* ********************************************************************* */
    
    scene.registerBeforeRender(() => {

        cursor3D.update(scene, { point: scenestate.pickpos });

        /* Moving camera focus */
        if(agents.size > 0) {
            const agentpos = Array.from(agents)[0][1].getPosition();
            awcam.follow(new Vector3(agentpos.x, 0, agentpos.z));
        }
    });

    return {
        scene,
        handles: {
            toggleDebug: function() {
                scene.debugLayer.isVisible() ? scene.debugLayer.hide() : scene.debugLayer.show();
            },
            setTopView() { awcam.setTopView(); },
            setFrontView() { awcam.setFrontView(); },
            setISOView() { awcam.setISOView(); },
            zoomIn() { awcam.zoomIn(); },
            zoomOut() { awcam.zoomOut(); },
            resize: function() {
                awcam.onResize();
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
                    groundMaterial.diffuseColor = new Color3(.78, .52, .36);
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
                    //groundMaterial.emissiveTexture = desertTexture;

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

                arenamap.data.objects.map((object, index) => {

                    let objectInstance : SceneComponent;

                    switch(object.type) {
                        case "rock01": {
                            objectInstance = new Rock01Component();
                            break;
                        }
                        case "crater01": {
                            objectInstance = new Satellite01Component();
                            break;
                        }
                        default: {
                            throw new Error("Cannot find mesh type: " + object.type);
                        }
                    }

                    objectInstance.init(scene, object.id);
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
            },
        }
    };
}
