import { FreeCamera, Scene, Vector3 } from 'babylonjs';
import * as constants from './constants';

export default class AwesomeCamera {

    private cam : FreeCamera;
    private zoom: number = 6;
    private baseopening: number = 8;
    private sightdirection: Vector3;

    private static minZoom = -2;
    private static maxZoom = 10;

    private static origPosition: Vector3 = new Vector3(0, 100, 0);

    private static viewTop: Vector3 = new Vector3(0, 0, 0);
    private static viewFront: Vector3 = new Vector3(0, 0, 100);
    private static viewISO: Vector3 = new Vector3(100, 0, 100);

    constructor(scene: Scene, iso: boolean = true) {
        this.cam = new FreeCamera(
            "awcam",
            AwesomeCamera.origPosition,
            scene
        );

        if(iso) this.cam.mode = FreeCamera.ORTHOGRAPHIC_CAMERA;

        this.cam.minZ = -1000;

        this.setISOView();
        this.update();
    }

    setTopView() {
        this.sightdirection = AwesomeCamera.viewTop;
        this.cam.position = AwesomeCamera.origPosition;
        this.cam.setTarget(this.sightdirection);
    }

    setFrontView() {
        this.sightdirection = AwesomeCamera.viewFront;
        this.cam.position = AwesomeCamera.origPosition;
        this.cam.setTarget(this.sightdirection);
    }

    setISOView() {
        this.sightdirection = AwesomeCamera.viewISO;
        this.cam.position = AwesomeCamera.origPosition;
        this.cam.setTarget(this.sightdirection);
    }

    follow(point: Vector3) {

        // Dampening the movement for smoother curves
        // This causes the camera focus to "lag" some pixels behind the actual target (when it's moving), but it's undetectable, ang produces a nicer experience overall
        const dampeningfac = 0.1;

        const maxDampenedDistance = 5;

        const curPosition = this.cam.position.clone();
        const desiredPosition = new Vector3(
            point.x - this.sightdirection.x,
            this.cam.position.y,
            point.z - this.sightdirection.z,
        );

        const travel = desiredPosition.subtract(curPosition);
        if(travel.lengthSquared() > maxDampenedDistance*maxDampenedDistance) {
            this.cam.position = desiredPosition;
        } else {
            this.cam.position = curPosition.add(travel.scale(dampeningfac));
        }
    }

    onResize() {
        this.update();
    }

    zoomOut() {
        this.zoom--;
        if(this.zoom < AwesomeCamera.minZoom) this.zoom = AwesomeCamera.minZoom;
        this.update();
    }

    zoomIn() {
        this.zoom++;
        if(this.zoom > AwesomeCamera.maxZoom) this.zoom = AwesomeCamera.maxZoom;
        this.update();
    }

    setZoom(zoom: number) {
        if(zoom < AwesomeCamera.minZoom) zoom = AwesomeCamera.minZoom;
        if(zoom > AwesomeCamera.maxZoom) zoom = AwesomeCamera.maxZoom;

        this.zoom = zoom;
    }

    getOpeningDimensions() {
        const viewrect = this.cam.getScene().getEngine().getRenderingCanvasClientRect();
        const ratio = viewrect.width / viewrect.height;

        const height = this.baseopening * Math.pow(constants.SQRT2, AwesomeCamera.maxZoom - this.zoom);
        const width = height * ratio;

        return { width, height };
    }

    update() {
        const opening = this.getOpeningDimensions();

        const halfvop = opening.height / 2;

        const viewrect = this.cam.getScene().getEngine().getRenderingCanvasClientRect();
        const ratio = viewrect.width / viewrect.height;

        this.cam.orthoBottom = -halfvop;
        this.cam.orthoTop = halfvop;

        this.cam.orthoLeft = -halfvop*ratio;
        this.cam.orthoRight = halfvop*ratio;
    }
}