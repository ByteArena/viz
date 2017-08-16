import { Scene, Vector3, InstancedMesh } from "babylonjs";

export default interface SceneComponent {
    init(scene: Scene, options: any);
    destroy(scene: Scene);
    update(scene: Scene, options: any);
    setPosition(x: number, y: number);

    setOrientation(orientation: number);

    setScale(scale: Vector3);

    getPosition() : Vector3;
    getInstancedMesh() : InstancedMesh;
}

