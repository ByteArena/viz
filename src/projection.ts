import { Scene, FreeCamera, Vector2, Vector3, Matrix } from 'babylonjs';

export default class Projection {
    protected scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public project3DToScreenSpace(point3d: Vector3) : Vector2 {
        const engine = this.scene.getEngine();
        const projected = Vector3.Project(
            point3d,
            Matrix.Identity(), 
            this.scene.getTransformMatrix(),
            this.scene.activeCamera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight())
        );

        return new Vector2(projected.x, projected.y);
    }
}