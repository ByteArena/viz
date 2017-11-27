// @flow

import Game from "../game/game";

export default class BaseUI {

    _game: Game;
    _font: any;
    _screen2d: any;

    constructor({ game }: { game: Game }) {
        this._game = game;
    }

    init() {
        const template = this._game.getApp().root.findByName("AgentLabelTemplate");
        template.enabled = false;
        template.element.pivot = new pc.Vec2(0.5, 0.5);
        template.element.anchor = new pc.Vec4(0.0, 0.0, 0.0, 0.0);
        this._font = template.element.font;
        template.parent.destroy();
        this.restart();
        // this._screen2d = template.parent;
        // this._screen2d.setPosition(0, 0, 0);
        // this._screen2d.setLocalPosition(0, 0, 0);
        // this._screen2d.addComponent("screen");
        // this._screen2d.screen.screenSpace = true;
        // this._screen2d.screen.scaleMode = pc.SCALEMODE_NONE;
    }

    restart() {
        if(this._screen2d) this._screen2d.destroy();

        const screen2d = new pc.Entity();
        screen2d.setPosition(0, 0, 0);
        screen2d.setLocalPosition(0, 0, 0);
        screen2d.addComponent("screen");
        screen2d.screen.screenSpace = true;
        screen2d.screen.scaleMode = pc.SCALEMODE_NONE;
        this._screen2d = screen2d;
        this._game.getApp().root.addChild(screen2d);
    }

    update() { }

    createGroup(name: string): any {
        const group = new pc.Entity();
        group.addComponent("element", { type: "group" });
        group.setName(name);
        this._screen2d.addChild(group);

        return group;
    }

    getFontAsset(): any {
        return this._font;
    }

    getScreenResolution(): pc.Vec3 {
        return this._screen2d.screen.referenceResolution;
    }

    getScreenPosition(worldpos: pc.Vec3): pc.Vec3 {
        const screenCoords = this._game.getCamera().worldToScreen(worldpos);
        const res = this.getScreenResolution();
        return new pc.Vec3(
            screenCoords.x,
            res.y - screenCoords.y,
            0,
        );
    }
}
