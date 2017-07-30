import { Mesh, InstancedMesh, Scene } from 'babylonjs';

import Vector2 from '../vector2'

import SceneComponent from './scenecomponent';
import * as constants from '../constants';
import Projection from '../projection';

export default class Wall implements SceneComponent {

    private meshinstance: InstancedMesh = null;
    static mesh: Mesh = null;

    static setup(mesh: Mesh) {
        Wall.mesh = mesh;
    }

    init(scene: Scene) : Promise<this> {
        const randid = Math.random();

        this.meshinstance = Wall.mesh.createInstance("wall-" + randid);
        this.meshinstance.position.y = 0;
        this.meshinstance.setEnabled(true);

        return Promise.resolve(this);
    }

    destroy(scene: Scene) { }
    update(scene: Scene) { }

    setPosition(x1: number, y1: number, x2: number, y2: number) {
        const { meshinstance } = this;
        if (meshinstance === null) return;

        meshinstance.position.x = x1;
        meshinstance.position.z = y1;

        const start = new Vector2(x1, y1);
        const end = new Vector2(x2, y2);

        const vec = end.clone().sub(start);
        this.setLength(vec.mag());

        //console.log(vec.toArray(), vec.angle());
        
        //meshinstance.rotation.y = vec.angle();
        meshinstance.rotation.y = Math.atan2(vec.x, vec.y); // TODO(netgusto): figure out why x and y have to be interverted here relative to Vector2.angle()
    }

    private setOrientation(orientation: number) {
        const { meshinstance } = this;
        meshinstance.rotation.y = orientation;
    }

    private setLength(len: number) {
        this.meshinstance.scaling.z = len / 2;
    }
}
