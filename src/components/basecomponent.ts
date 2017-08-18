import { Mesh, InstancedMesh, Scene, SceneLoader, StandardMaterial, Color3, Texture, Vector2, Vector3 } from 'babylonjs';

import SceneComponent from './scenecomponent';
import * as constants from '../constants';

export default abstract class BaseComponent implements SceneComponent {

    protected instance: InstancedMesh = null;

    abstract init(scene: Scene, id: string) : Promise<this>;

    destroy(scene: Scene) {
        this.getInstancedMesh().dispose();
    }

    update(scene: Scene, options: any) { }

    setPosition(x: number, y: number, height: number = null) {
        const { instance } = this;
        if(instance === null) return;

        instance.position.x = x;
        instance.position.z = y;
        if(height !== null) {
            instance.position.y = height;
        }

        instance.position = new Vector3(instance.position.x, instance.position.y, instance.position.z);
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
    
    getInstancedMesh() : InstancedMesh {
        return this.instance;
    }
}