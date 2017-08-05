import { Mesh, Scene, SceneLoader, StandardMaterial, Color3, Texture, Vector2, Vector3, Matrix } from 'babylonjs';

import SceneComponent from './scenecomponent';
import BaseComponent from './basecomponent';

import * as constants from '../constants';
import Projection from '../projection';

export default class IsoCursor extends BaseComponent implements SceneComponent {

    private projection: Projection;

    init(scene: Scene) : Promise<this> {
        return Promise.resolve(this);
    }

    setProjection(projection: Projection) : this {
        this.projection = projection;
        return this;
    }

    destroy(scene: Scene) { }

    update(scene: Scene, { point } : { point: Vector3 }) {

        if(point === null) return;

        const projected = this.projection.project3DToScreenSpace(point);

        const screenspacepoint = document.getElementById("screenspacepoint");
        screenspacepoint.style.left = projected.x + "px";
        screenspacepoint.style.top = projected.y + "px";
    }
}
