import { Engine, Scene, Camera, SceneLoader, Mesh } from 'babylonjs';
import { AssetsManager, IAssetTask, MeshAssetTask, ImageAssetTask, TextureAssetTask } from 'babylonjs';

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
import IsoCursorComponent from './components/isocursor';

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

    assetsManager.addMeshTask("mesh:ship", "Ship", "http://localhost:8080/res/models/web/aliens/", "ship.babylon");
    assetsManager.addMeshTask("mesh:wall", "", "http://localhost:8080/res/models/web/", "wall.babylon");
    assetsManager.addImageTask("image:shadow", "http://localhost:8080/res/img/textures/shadow.png");

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

    const agents = new Map<string, AgentComponent>();

    /*
    const agents = new Array<AgentComponent>();
    for(let k = 1; k < 6; k++) {
        const agent = new AgentComponent();
        agent.init(scene, { orbitradius: k * 2 });
        agents.push(agent);
    }
    */

    // WALLS

    /*
    let wall = null;

    SceneLoader.ImportMesh("", "res/models/web/", "wall.babylon", scene, function (meshes, particleSystems, skeletons) {

        wall = meshes[0];
        wall.convertToFlatShadedMesh();
        wall.position.y = 0;
        wall.position.z = 0;

        wall.material.diffuseColor = new Color3(0, 0, 0);
        wall.material.diffuseTexture = null;
        wall.material.specularColor = new Color3(0, 0, 0);
        wall.material.emissiveColor = new Color4(0, 0, 0, 0);
        wall.material.subMaterials.map(material => {
            material.emissiveColor = material.diffuseColor;
        });

        wall.material.freeze();

        let pos = Vector3.Zero();
        for(let k = 0; k < 100; k++) {
            const wallx = wall.createInstance("wall" + k);
            const dir = Math.random() > 0.5 ? 'x' : 'z';
            if(dir === 'x') {
                wallx.rotation.y = -constants.PI_HALF;
            }
            pos[dir]++;
            wallx.position = pos.clone();
        }

    });
    */

    /* ********************************************************************* */
    /* MECANICS */
    /* ********************************************************************* */
    
    scene.registerBeforeRender(() => {

        // agents.map(agent => {
        //     agent.update(scene);
        // });

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
            setAgent: function(agentinfo: Vizagentmessage) {

                let agent = null;
                if(!agents.has(agentinfo.Id)) {
                    agent = new AgentComponent();
                    agent.init(scene);
                    agents.set(agentinfo.Id, agent);
                    //console.log("iciiiii");
                } else {
                    //console.log("laaaaaaaaaaaa", agentinfo.Id);
                    agent = agents.get(agentinfo.Id);
                }

                agent.setPosition(agentinfo.Position[0]/25, agentinfo.Position[1]/25);
                agent.setOrientation(agentinfo.Orientation);
            }
        }
    };
}
