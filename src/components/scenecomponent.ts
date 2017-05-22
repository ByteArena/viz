import { Scene } from "babylonjs";

interface SceneComponent {
    init(scene: Scene, options: any);
    destroy(scene: Scene);
    update(scene: Scene, options: any);
}

export default SceneComponent;
