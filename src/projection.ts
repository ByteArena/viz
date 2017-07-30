import { Scene, FreeCamera, Vector2, Vector3, Matrix } from 'babylonjs';

import OrthoViewAbstract from './views/OrthoViewAbstract';
import OrthoViewTop from './views/OrthoViewTop';
import OrthoViewFront from './views/OrthoViewFront';
import OrthoViewIsometric from './views/OrthoViewIsometric';

export default class Projection {
    protected scene: Scene;
    protected views: Map<string, OrthoViewAbstract>;
    protected currentview: OrthoViewAbstract;

    constructor(scene: Scene, camera: FreeCamera, view: string = "iso") {
        this.scene = scene;

        this.views = new Map<string, OrthoViewAbstract>();

        this.views.set("top", new OrthoViewTop("top", camera, 15));
        this.views.set("front", new OrthoViewFront("front", camera, 15));
        this.views.set("iso", new OrthoViewIsometric("iso", camera, 15));

        this.useView(view);
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

    protected getView(viewname: string) : OrthoViewAbstract {
        const res = this.views.get(viewname);
        if(res === undefined) throw new Error("Unknown view:" + viewname);
        return res;
    }

    public useView(viewname: string) {
        const view = this.getView(viewname);
        this.currentview = view;
        view.activate();
    }

    public getCurrentView() : OrthoViewAbstract {
        return this.currentview;
    }

    public zoomIn() : this {
        const { currentview } = this;

        const currentopening = currentview.getVerticalOpeningOrtho();
        if(currentopening <= 8) return;

        currentview.setVerticalOpeningOrtho(currentopening - 4);
        return this;
    }

    public zoomOut() : this {
        const { currentview } = this;

        currentview.setVerticalOpeningOrtho(
            currentview.getVerticalOpeningOrtho() + 4
        );

        return this;
    }

    public follow(point: Vector3) {
        const { currentview, scene } = this;

        const camIsoPos = currentview.getFocusIsoPoint();
        const actorIsoPos = currentview.isoPointFrom3DPoint(point);

        //console.log(camIsoPos);
        
        // calculate vector to destination
        const travelIso = actorIsoPos.subtract(camIsoPos);

        // Dampening the movement for smoother curves
        // This causes the camera focus to "lag" some pixels behind the actual target (when it's moving), but it's undetectable, ang produces a nicer experience overall
        const dampeningfac = 0.1;

        const camera = scene.activeCamera;

        camera.orthoLeft += travelIso.x*dampeningfac;
        camera.orthoRight += travelIso.x*dampeningfac;

        camera.orthoBottom += travelIso.y*dampeningfac;
        camera.orthoTop += travelIso.y*dampeningfac;
    }
}