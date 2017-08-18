import { Mesh, InstancedMesh, Scene, SceneLoader, StandardMaterial, Color3, Texture, Vector2, Vector3 } from 'babylonjs';

import BaseComponent from './basecomponent';
import * as constants from '../constants';

export default class Agent extends BaseComponent {

    private shadowinstance: InstancedMesh = null;

    static mesh: Mesh = null;
    static shadowmesh: Mesh = null;

    static setup(shipmesh: Mesh, shadowmesh: Mesh) {
        Agent.mesh = shipmesh;
        Agent.shadowmesh = shadowmesh;
    }

    init(scene: Scene, id: string) : Promise<this> {

        this.instance = Agent.mesh.createInstance("agent-" + id);
        this.shadowinstance = Agent.shadowmesh.createInstance("agent-" + id + "-shadow");

        this.setScale(new Vector3(1, 1, 1));

        this.instance.position.y = 1.2;    // altitude

        this.instance.setPivotPoint(new Vector3(0, 0, 0.5));       // pushing the rotation point in the nose of the spacecraft
        this.shadowinstance.setPivotPoint(new Vector3(0, 0.25, 0));      // rearing the shadow back under the spacecraft; assigning Y because the shadow mesh is rotated ? 0.25 because of scale*2 on shadow

        this.instance.setEnabled(true);
        this.shadowinstance.setEnabled(true);

        return Promise.resolve(this);
    }

    destroy(scene: Scene) {
        super.destroy(scene);
        this.shadowinstance.dispose();
    }

    setPosition(x: number, y: number, height: number = null) {
        super.setPosition(x, y, height);
        this.shadowinstance.position = new Vector3(this.instance.position.x, 0.05, this.instance.position.z);
    }

    setScale(scale: Vector3) {
        super.setScale(scale);
        this.shadowinstance.scaling = scale.add(new Vector3(1, 1, 1));
    }

    setOrientation(orientation: number) {
        super.setOrientation(orientation);
        this.shadowinstance.rotation.y = orientation;
    }
}
