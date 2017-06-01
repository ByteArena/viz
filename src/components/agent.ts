import { Mesh, InstancedMesh, Scene, SceneLoader, StandardMaterial, Color3, Texture, Vector2, Vector3 } from 'babylonjs';

import SceneComponent from './scenecomponent';
import * as constants from '../constants';

export default class Agent implements SceneComponent {

    private agent: Mesh = null;
    private agentinstance: InstancedMesh = null;
    private shadowinstance: InstancedMesh = null;

    private state: {
        count: number,
        //orbitradius: number,
    };

    static shipmesh: Mesh = null;
    static shadowmesh: Mesh = null;

    static setup(shipmesh: Mesh, shadowmesh: Mesh) {
        Agent.shipmesh = shipmesh;
        Agent.shadowmesh = shadowmesh;
    }

    init(scene: Scene/*, { orbitradius } : { orbitradius: number } = { orbitradius: 4.0 }*/) : Promise<this> {

        this.state = {
            count: 0.0,
            //orbitradius: orbitradius,
        };

        const randid = Math.random();
        this.agentinstance = Agent.shipmesh.createInstance("agent-" + randid);
        this.shadowinstance = Agent.shadowmesh.createInstance("agent-shadow-" + randid);

        this.agentinstance.position.y = 0.5;

        this.agentinstance.setEnabled(true);
        this.shadowinstance.setEnabled(true);

        return Promise.resolve(this);
    }

    destroy(scene: Scene) { }
    update(scene: Scene) {

        /*
        const { agentinstance, shadowinstance } = this;
        if(agentinstance === null || shadowinstance === null) return;

        const { orbitradius } = this.state;

        let ox = 0; let oz = 0; // orbit center

        agentinstance.position.x = ox + orbitradius * Math.sin(this.state.count);
        agentinstance.position.z = oz - orbitradius * Math.cos(this.state.count);

        const pos = new Vector2(agentinstance.position.x, agentinstance.position.z);
        const tangentvec = new Vector2(pos.y, -pos.x);
        const rotation = Math.atan2(tangentvec.y, tangentvec.x);

        agentinstance.rotation.y = -rotation - constants.PI_HALF;

        const actorgroundpos = new Vector3(agentinstance.position.x, 0, agentinstance.position.z);

        shadowinstance.position = actorgroundpos;

        this.state.count+= 0.005;
        */
    }

    setPosition(x: number, y: number) {
        const { agentinstance, shadowinstance } = this;
        if(agentinstance === null || shadowinstance === null) return;

        agentinstance.position.x = x;
        agentinstance.position.z = y;

        shadowinstance.position = new Vector3(agentinstance.position.x, 0, agentinstance.position.z);
    }

    setOrientation(orientation: number) {
        const { agentinstance } = this;
        agentinstance.rotation.y = orientation;
    }

    getPosition() : Vector3 {
        if(this.agentinstance === null) return Vector3.Zero();
        return this.agentinstance.position;
    }
}
