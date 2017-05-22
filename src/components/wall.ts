import { Mesh, Scene, SceneLoader, StandardMaterial, Color3, Texture, Vector2, Vector3 } from 'babylonjs';

import SceneComponent from './scenecomponent';
import * as constants from '../constants';
import Projection from '../projection';

export default class Wall implements SceneComponent {

    private state: {
        count: number
    };

    init(scene: Scene) : Promise<this> {
        return Promise.resolve(this);
    }
    destroy(scene: Scene) { }
    update(scene: Scene, { projection, point } : { projection: Projection, point: Vector3 }) {

        if(point === null) return;

        const projected = projection.project3DToScreenSpace(point);
        const screenspacepoint = document.getElementById("screenspacepoint");
        screenspacepoint.style.left = projected.x + "px";
        screenspacepoint.style.top = projected.y + "px";
    }
}
