import { FreeCamera, Scene, Vector3 } from 'babylonjs';
import * as constants from './constants';

function mapValueToRange(n: number, start1: number, stop1: number, start2: number, stop2: number) : number {
	return ((n-start1)/(stop1-start1))*(stop2-start2) + start2;
}

const agentAltitude = 1.2;

export default class AwesomeCamera {

    private cam : FreeCamera;
    private zoom: number = AwesomeCamera.defaultZoom;
    private baseopening: number = 8;
    private sightdirection: Vector3;
    private isometric: boolean = true;
    private far: boolean = true;

    private _curView = null;

    private static minZoom = -2;
    private static maxZoom = 10;
    private static defaultZoom = 6;

    private static origPosition: Vector3 = new Vector3(0, agentAltitude*4, 0);
    private static origPositionFar: Vector3 = new Vector3(0, 100, 0);

    private static viewTop: Vector3 = new Vector3(0, agentAltitude, 0);
    private static viewFront: Vector3 = new Vector3(0, agentAltitude, 10);
    private static viewISO: Vector3 = new Vector3(10, agentAltitude, 10);

    private static viewTopFar: Vector3 = new Vector3(0, agentAltitude, 0);
    private static viewFrontFar: Vector3 = new Vector3(0, agentAltitude, 100);
    private static viewISOFar: Vector3 = new Vector3(100, agentAltitude, 100);

    constructor(scene: Scene, iso: boolean = true) {
        this.cam = new FreeCamera(
            "awcam",
            AwesomeCamera.origPosition,
            scene
        );

        this.cam.minZ = -10000;
        this.cam.maxZ = 10000;

        this.setIsometric(iso);

        this.setISOView();
        this.update();
    }
    
    setIsometric(iso: boolean) {

        if(this.isometric !== iso) {
            this.zoom = AwesomeCamera.defaultZoom;
        }

        this.isometric = iso;
        if(this.isometric) {
            this.cam.mode = FreeCamera.ORTHOGRAPHIC_CAMERA;
        } else {
            this.cam.mode = FreeCamera.PERSPECTIVE_CAMERA;
        }

        this.update();
    }

    setFar(far: boolean) {
        this.far = far;
        this.zoom = AwesomeCamera.defaultZoom;
        this._curView();
        this.update();
    }

    setTopView() {
        this.sightdirection = this.far ? AwesomeCamera.viewTopFar : AwesomeCamera.viewTop;
        this.cam.position = this.far ? AwesomeCamera.origPositionFar : AwesomeCamera.origPosition;
        this.cam.setTarget(this.sightdirection);
        this._curView = this.setTopView.bind(this);
    }

    setFrontView() {
        this.sightdirection = this.far ? AwesomeCamera.viewFrontFar : AwesomeCamera.viewFront;
        this.cam.position = this.far ? AwesomeCamera.origPositionFar : AwesomeCamera.origPosition;
        this.cam.setTarget(this.sightdirection);
        this._curView = this.setFrontView.bind(this);
    }

    setISOView() {
        this.sightdirection = this.far ? AwesomeCamera.viewISOFar : AwesomeCamera.viewISO;
        this.cam.position = this.far ? AwesomeCamera.origPositionFar : AwesomeCamera.origPosition;
        this.cam.setTarget(this.sightdirection);
        this._curView = this.setISOView.bind(this);
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
        if(this.isometric) {
            const opening = this.getOpeningDimensions();

            const halfvop = opening.height / 2;

            const viewrect = this.cam.getScene().getEngine().getRenderingCanvasClientRect();
            const ratio = viewrect.width / viewrect.height;

            this.cam.orthoBottom = -halfvop;
            this.cam.orthoTop = halfvop;

            this.cam.orthoLeft = -halfvop*ratio;
            this.cam.orthoRight = halfvop*ratio;
        } else {
            this.cam.fovMode = FreeCamera.FOVMODE_VERTICAL_FIXED;
            this.cam.fov = mapValueToRange(this.zoom, AwesomeCamera.maxZoom, AwesomeCamera.minZoom, 0.075, Math.PI/3);
        }
    }
}