import { FreeCamera, Vector2 } from 'babylonjs';

export default abstract class OrthoViewAbstract {

    protected name: string;
    protected camera: FreeCamera;
    protected verticalopeningortho: number;

    constructor(name: string, camera: FreeCamera, verticalopeningortho: number = 32) {
        this.name = name;
        this.camera = camera;
        this.verticalopeningortho = verticalopeningortho;
    }

    isoPointFrom3DPoint(point3d) : Vector2 {
        return new Vector2(point3d.x, point3d.z);
    }

    getVerticalOpeningOrtho() : number {
        return this.verticalopeningortho;
    }

    setVerticalOpeningOrtho(verticalopeningortho) : this {
        this.verticalopeningortho = verticalopeningortho;
        return this;
    }

    abstract getFocusIsoPoint() : Vector2;

    abstract activate();
}
