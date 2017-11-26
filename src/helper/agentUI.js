// @flow

import BaseUI from "./baseUI";

export default class AgentUI {

    _baseui: BaseUI;

    _container: any;
    _labelEntities: Object = {};

    constructor({ baseui }: { baseui: BaseUI }) {
        this._baseui = baseui;
    }

    init() {
        //this._container = this._baseui.createGroup("agentui");
        window.addEventListener("resize", () => {
            pc.app.graphicsDevice.updateClientRect();
        })
    }

    update(agentEntities: Object) {
        Object.values(agentEntities).map((agentEntity: any) => {

            let label;
            
            const hashkey = agentEntity.getGuid();

            if (!(hashkey in this._labelEntities)) {
                const agentname = agentEntity.getName();
                label = this.makeLabel(agentname);
                this._labelEntities[hashkey] = label;
            } else {
                label = this._labelEntities[hashkey];
            }

            const pos = this._baseui.getScreenPosition(agentEntity.getLocalPosition());
            pos.y += 35;

            label.setLocalPosition(pos);
        });
    }

    makeLabel(label: string): pc.Entity {
        const entity = new pc.Entity();
        entity.addComponent("element", { type: "text" });
        entity.setPosition(0, 0, 0);
        entity.setLocalPosition(0, 0, 0);
        entity.element.text = label;
        entity.element.font = this._baseui.getFontAsset();
        entity.element.fontSize = 24;
        entity.element.pivot = new pc.Vec2(0.5, 0.5);
        entity.element.anchor = new pc.Vec4(0.0, 0.0, 0.0, 0.0);
        this._baseui._screen2d.addChild(entity);

        return entity;
    }
}
