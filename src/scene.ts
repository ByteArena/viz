import { Engine, Scene, Mesh, FreeCamera, GUI } from 'babylonjs';
import { HemisphericLight, DirectionalLight, ShadowGenerator } from 'babylonjs';
import { AssetsManager, VertexData, Vector3, Color3, Color4 } from 'babylonjs';
import { StandardMaterial, Texture } from 'babylonjs';

import * as constants from './constants';
import Projection from './projection';
import AgentComponent from './components/agent';
import SceneComponent from './components/scenecomponent';
import BasicComponentBuilder from './components/BasicComponentBuilder';
import BasicComponent from './components/BaseComponent';
import IsoCursorComponent from './components/isocursor';

import AwesomeCamera from './awesomecamera';
import loadAssets from './loadassets';
import './protocol/vizmessage'

//import GridMaterial from './gridmaterial';

const scenestate = { pickpos: null };
const debug = false;

export default async function createScene(engine: Engine, canvas: HTMLElement, assetsUrl: string) : Promise<any> {

    const mapUrl = assetsUrl + "/maps/deathmatch/desert/death-valley";
    const themeUrl = assetsUrl + "/themes/desert";
    const agentsUrl = assetsUrl + "/agents";

    /* ********************************************************************* */
    /* SCENE */
    /* ********************************************************************* */
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 1);

    const assetsManager = new AssetsManager(scene);
    assetsManager.useDefaultLoadingScreen = false;

    //assetsManager.addMeshTask("mesh:ship", "Ship", agentsUrl + "/redship/", "ship.babylon");
    assetsManager.addMeshTask("mesh:ship", "main", themeUrl + "/models/", "spaceCraft04.babylon");
    assetsManager.addImageTask("image:shadow", agentsUrl + "/redship/shadow.jpg");

    //assetsManager.addMeshTask("mesh:rocksTallOre", "rocksTallOre", themeUrl + "/models/", "rocksTallOre.babylon");
    assetsManager.addMeshTask("mesh:rocks01", "rocksTall", themeUrl + "/models/", "rocksTall.babylon");
    assetsManager.addMeshTask("mesh:rocks02", "main", themeUrl + "/models/", "rocks02.babylon");
    assetsManager.addMeshTask("mesh:crater01", "crater", themeUrl + "/models/", "crater01.babylon");
    assetsManager.addMeshTask("mesh:crater02", "craterLarge", themeUrl + "/models/", "crater02.babylon");
    assetsManager.addMeshTask("mesh:satellite01", "main", themeUrl + "/models/", "satellite01.babylon");
    assetsManager.addMeshTask("mesh:satellite02", "main", themeUrl + "/models/", "satellite02.babylon");
    assetsManager.addMeshTask("mesh:alienbones", "main", themeUrl + "/models/", "alienBones.babylon");
    assetsManager.addMeshTask("mesh:alienbones", "main", themeUrl + "/models/", "alienBones.babylon");
    assetsManager.addMeshTask("mesh:station01", "main", themeUrl + "/models/", "station01.babylon");
    assetsManager.addMeshTask("mesh:station02", "main", themeUrl + "/models/", "station02.babylon");
    assetsManager.addMeshTask("mesh:projectile", "main", themeUrl + "/models/", "projectile.babylon");
    
    //assetsManager.addImageTask("image:desert", themeUrl + "/textures/sand-ripples-seamless-orange.jpg");
    assetsManager.addImageTask("image:desert", themeUrl + "/textures/seamless-clay.jpg");

    const assets = await loadAssets(assetsManager);

    /* ********************************************************************* */
    /* CAMERA */
    /* ********************************************************************* */

    const awcam = new AwesomeCamera(scene, true);
    const projection = new Projection(scene);

    /* ********************************************************************* */
    /* LIGHTING */
    /* ********************************************************************* */

    const light = new HemisphericLight(
        "hemilight",
        new Vector3(0, 1, 0),
        scene
    );
    light.intensity = 0.95;
    light.diffuse = new Color3(0.7, 0.8, 1.0);
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
    light2.intensity = 1;
    light2.diffuse = new Color3(1, 1, 0.9);
    light2.specular = new Color3(0, 0, 0);

    // const shadowGenerator = new ShadowGenerator(2048, light2);
    // shadowGenerator.useExponentialShadowMap = true;
    // shadowGenerator.usePoissonSampling = true; 
    // shadowGenerator.bias = 0.01;

    /* ********************************************************************* */
    /* SCENE OBJECTS */
    /* ********************************************************************* */

    // GRID GROUND (debug)

    // const ground = Mesh.CreateGround("ground1", 3000, 3000, 1, scene);
    // ground.material = new GridMaterial("groundMaterial", scene);
    // ground.position.y = -0.1; // slightly below the y origin to avoid rendering artefacts due to coplanar meshes on y=0

    // 3D CURSOR
    const cursor3D = new IsoCursorComponent();
    cursor3D.init(scene);
    cursor3D.setProjection(projection);

    // AGENT
    const shadowmesh = Mesh.CreatePlane("actorshadow", 1.0, scene);
    shadowmesh.setEnabled(false);
    

    const shadowMaterial = new StandardMaterial("shadow", scene);
    const shadowTexture = new Texture("data:image(shadow)", scene, true, true, Texture.TRILINEAR_SAMPLINGMODE, () => null, () => null, assets.images.get("shadow"));
    //shadowMaterial.emissiveTexture = shadowTexture;
    //shadowMaterial.emissiveTexture = shadowTexture;
    shadowMaterial.diffuseTexture = shadowTexture;
    //shadowMaterial.opacityTexture = shadowTexture;
    shadowMaterial.opacityTexture = shadowTexture;
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

    /* Obstacles meshs + materials */

    const AlienBonesComponent = BasicComponentBuilder();
    AlienBonesComponent.setup(assets.meshes.get("alienbones"));

    const Rocks01Component = BasicComponentBuilder();
    Rocks01Component.setup(assets.meshes.get("rocks01"));

    const Rocks02Component = BasicComponentBuilder();
    Rocks02Component.setup(assets.meshes.get("rocks02"));

    const Crater01Component = BasicComponentBuilder();
    Crater01Component.setup(assets.meshes.get("crater01"));

    const Crater02Component = BasicComponentBuilder();
    Crater02Component.setup(assets.meshes.get("crater02"));

    // const Crater02Component = BasicComponentBuilder();
    // Crater02Component.setup(assets.meshes.get("crater02"));

    const Satellite01Component = BasicComponentBuilder();
    Satellite01Component.setup(assets.meshes.get("satellite01"));

    const Satellite02Component = BasicComponentBuilder();
    Satellite02Component.setup(assets.meshes.get("satellite02"));

    const Station01Component = BasicComponentBuilder();
    Station01Component.setup(assets.meshes.get("station01"));

    const Station02Component = BasicComponentBuilder();
    Station02Component.setup(assets.meshes.get("station02"));

    const ProjectileComponent = BasicComponentBuilder();
    ProjectileComponent.setup(assets.meshes.get("projectile"));


    const agents = new Map<string, AgentComponent>();
    const projectiles = new Map<string, BasicComponent>();

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

    // GUI
    const guiLayer = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Adding image
    var iconImage = new GUI.Image("logo_icon", "https://bytearena.com/assets/img/angrybot.png");
    iconImage.width = "65px";
    iconImage.height = "62px";
    iconImage.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    iconImage.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    iconImage.stretch = GUI.Image.STRETCH_UNIFORM;
    iconImage.left = "5px";
    iconImage.top = "5px";
    guiLayer.addControl(iconImage);

    /*********************************************************************** */
    /* Debug container                                                       */
    /*********************************************************************** */

    let isMapSet = false;

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
            setProjection(projection) {
                awcam.setIsometric(projection === "isometric");
            },
            setAltitude(altitude) {
                awcam.setFar(altitude === "high");
            },
            resize: function() {
                awcam.onResize();
                engine.resize();
            },
            click: function() {
                const pickResult = scene.pick(scene.pointerX, scene.pointerY);
                scenestate.pickpos = pickResult.pickedPoint;    // pos or null
            },
            setMap: function(arenamap: any) {

                if(isMapSet) return;
                isMapSet = true;

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
                    desertTexture.uScale = 7.0;
                    desertTexture.vScale = 7.0;
                    groundMaterial.diffuseTexture = desertTexture;
                    //groundMaterial.bumpTexture = desertTexture;
                    
                    //groundMaterial.emissiveTexture = desertTexture;
                    //groundMaterial.emissiveColor = Color3.Red();
                    //groundMaterial.useEmissiveAsIllumination = true;

                    groundmesh.material = groundMaterial;
                    groundmesh.material.freeze();

                    //groundmesh.receiveShadows = true;

                    // Make a mesh shaper device.
                    var vertexData = new VertexData();
                    vertexData.positions = ground.mesh.vertices;
                    vertexData.indices = ground.mesh.indices;
                    vertexData.uvs = ground.mesh.uvs;
                    
                    // Use the vertexData object.. to shape-ify blankmesh
                    vertexData.applyToMesh(groundmesh);


                    // heightmap ground
                    // const hmground = Mesh.CreateGroundFromHeightMap("ground", themeUrl + "/textures/heightMap.png", 100, 100, 100, 0, 10, scene, false);
                    // //hmground.material = groundMaterial;
                    // //hmground.convertToFlatShadedMesh();
                    // hmground.position = new Vector3(500, 0, 500);
                });

                // Field objects setup

                arenamap.data.objects.map((object, index) => {

                    let objectInstance : SceneComponent;

                    let scale = null;

                    switch(object.type) {
                        case "rocks01": {
                            objectInstance = new Rocks01Component();
                            break;
                        }
                        case "rocks02": {
                            objectInstance = new Rocks02Component();
                            break;
                        }
                        case "alienBones": {
                            objectInstance = new AlienBonesComponent();
                            break;
                        }
                        case "satellite01": {
                            objectInstance = new Satellite01Component();
                            break;
                        }
                        case "satellite02": {
                            objectInstance = new Satellite02Component();
                            break;
                        }
                        case "station01": {
                            objectInstance = new Station01Component();
                            break;
                        }
                        case "station02": {
                            objectInstance = new Station02Component();
                            break;
                        }
                        case "crater01": {
                            objectInstance = new Crater01Component();
                            scale = new Vector3(object.diameter, object.diameter/2, object.diameter);
                            break;
                        }
                        case "crater02": {
                            objectInstance = new Crater02Component();
                            scale = new Vector3(object.diameter, object.diameter/2, object.diameter);
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
                    objectInstance.setScale(scale ? scale : new Vector3(object.diameter, object.diameter, object.diameter));
                    objectInstance.setOrientation(object.orientation);
                    //shadowGenerator.getShadowMap().renderList.push(objectInstance.getInstancedMesh());
                });

                if(debug) {
                    const collisionmaterial = new StandardMaterial("collmesh", scene);
                    collisionmaterial.diffuseColor = new Color3(1, 0, 1);
                    collisionmaterial.emissiveColor = collisionmaterial.diffuseColor;
    
                    arenamap.data.collisionmeshes.map((collisionmeshinfo, index) => {
                        
                        const collisionmesh = new Mesh("collisionmesh-" + collisionmeshinfo.id, scene);
                        collisionmesh.position = new Vector3(0, 20, 0);
                        collisionmesh.material = collisionmaterial;
    
                        const indices = Array.apply(null, {length: collisionmeshinfo.vertices.length/3}).map(Number.call, Number);
    
                        const vertexData = new VertexData();
                        vertexData.positions = collisionmeshinfo.vertices;
                        vertexData.indices = indices;
                        vertexData.applyToMesh(collisionmesh);
                    });
    
                    console.log("ARENAMAP", arenamap);
                }


            },
            setVizMessage: function(vizmsg: Vizmessage) {

                const unitRatio = 1.0;

                // const debugpoints = document.getElementById("debugpoints");
                // while(debugpoints.firstChild) {
                //     debugpoints.removeChild(debugpoints.firstChild);
                // }

                // vizmsg.DebugPoints.concat(vizmsg.DebugIntersects).forEach((debugpoint, index) => {
                //     const projected = projection.project3DToScreenSpace(new Vector3(debugpoint[0] * unitRatio, 0, debugpoint[1] * unitRatio));
                //     const newDebugPoint: HTMLDivElement = document.createElement("div");
                //     newDebugPoint.style.left = projected.x + "px";
                //     newDebugPoint.style.top = projected.y + "px";
                //     debugpoints.appendChild(newDebugPoint);
                // });

                const seenprojectiles = [];

                if(vizmsg.Projectiles) {
                    vizmsg.Projectiles.forEach(projectileinfo => {
                        seenprojectiles.push(projectileinfo.Id);
                        let projectile = null;
                        if (!projectiles.has(projectileinfo.Id)) {
                            projectile = new ProjectileComponent();
                            projectile.init(scene);
                            projectile.setScale(new Vector3(0.3, 0.3, 0.3));
                            projectiles.set(projectileinfo.Id, projectile);
                        } else {
                            projectile = projectiles.get(projectileinfo.Id);
                        }

                        projectile.setPosition(
                            projectileinfo.Position[0] * unitRatio,
                            projectileinfo.Position[1] * unitRatio,
                            debug ? 30.2 : 1.2 // debug altitude / agent altitude
                        );
                        //projectile.setOrientation(projectileinfo.Orientation);
                    });
                }

                let removeids = [];
                projectiles.forEach((projectile, projectileid) => {
                    if(seenprojectiles.indexOf(projectileid) >= 0) return;
                    removeids.push(projectileid);
                });

                removeids.map(projid => {
                    const projectile = projectiles.get(projid);
                    projectile.destroy(scene);
                    projectiles.delete(projid);
                });

                const createLabel = function(msg: string) {
                    var label = new GUI.Rectangle(msg);
                    label.height = "30px";
                    label.alpha = 0.8;
                    label.cornerRadius = 20;
                    label.thickness = 0;
                    label.linkOffsetY = -30;
            
                    var text1 = new GUI.TextBlock();
                    text1.text = msg;
                    text1.color = "white";
                    text1.fontSize = 12;
                    label.addControl(text1);

                    return label;
                }  



                const seenagents = [];

                vizmsg.Agents.forEach(agentinfo => {
                    seenagents.push(agentinfo.Id);
                    let agent = null;
                    if (!agents.has(agentinfo.Id)) {
                        agent = new AgentComponent();
                        agent.init(scene, agentinfo.Id);
                        agents.set(agentinfo.Id, agent);
                        //agent.setScale(new Vector3(3, 3, 3));
                
                        const label = createLabel(agentinfo.Name);
                        guiLayer.addControl(label);
                        label.linkWithMesh(agent.getInstancedMesh());
                        // agent.onBeforeDestroy(function() {
                        //     console.log(label);
                        // });
                    } else {
                        agent = agents.get(agentinfo.Id);
                    }

                    agent.setPosition(agentinfo.Position[0] * unitRatio, agentinfo.Position[1] * unitRatio);
                    agent.setOrientation(agentinfo.Orientation);
                });

                removeids = [];
                agents.forEach((agent, agentid) => {
                    if(seenagents.indexOf(agentid) >= 0) return;
                    removeids.push(agentid);
                });

                removeids.map(agentid => {
                    console.log("REMOVE agent", agentid);
                    const agent = agents.get(agentid);
                    agent.destroy(scene);
                    agents.delete(agentid);
                });
            },
        }
    };
}
