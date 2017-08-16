import { Mesh, InstancedMesh, Scene, SceneLoader, StandardMaterial, Color3, Texture, Vector2, Vector3 } from 'babylonjs';

import BaseComponent from './basecomponent';
import SceneComponent from './scenecomponent';
import * as constants from '../constants';

export default function BasicComponentBuilder() {
    const res = class extends BaseComponent implements SceneComponent {

        static mesh: Mesh = null;
        static setup(mesh: Mesh) {}

        init(scene: Scene, id: string) : Promise<this> {

            const randid = Math.random();
            this.instance = res.mesh.createInstance(id);

            this.instance.setEnabled(true);

            return Promise.resolve(this);
        }
    };

    res.setup = function(mesh: Mesh) {
        res.mesh = mesh;

        mesh.convertToFlatShadedMesh();
        const meshMaterial = mesh.material as StandardMaterial;
        meshMaterial.unfreeze();
        meshMaterial.specularColor = new Color3(0, 0, 0);
        //meshMaterial.emissiveTexture = meshMaterial.diffuseTexture;
        meshMaterial.emissiveColor = new Color3(0, 0, 0);
        meshMaterial.freeze();
    }

    return res;
}
    
