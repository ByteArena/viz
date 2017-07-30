import { Mesh, InstancedMesh, Scene, SceneLoader, StandardMaterial, Color3, Texture, Vector2, Vector3 } from 'babylonjs';

import SceneComponent from './scenecomponent';
import * as constants from '../constants';

export default class RocksTallOreComponent implements SceneComponent {

    private instance: InstancedMesh = null;
    static mesh: Mesh = null;

    static setup(mesh: Mesh) {
        RocksTallOreComponent.mesh = mesh;
    }

    init(scene: Scene) : Promise<this> {

        const randid = Math.random();
        this.instance = RocksTallOreComponent.mesh.createInstance("rocktallore-" + randid);

        this.instance.setEnabled(true);

        return Promise.resolve(this);
    }

    destroy(scene: Scene) { }
    update(scene: Scene) { }

    setPosition(x: number, y: number) {
        const { instance } = this;
        if(instance === null) return;

        instance.position.x = x;
        instance.position.z = y;

        instance.position = new Vector3(instance.position.x, 0, instance.position.z);
    }

    setOrientation(orientation: number) {
        const { instance } = this;
        instance.rotation.y = orientation;
    }

    setScale(scale: Vector3) {
        const { instance } = this;
        instance.scaling = scale;
    }

    getPosition() : Vector3 {
        if(this.instance === null) return Vector3.Zero();
        return this.instance.position;
    }
}
    
