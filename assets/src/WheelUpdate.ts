import { _decorator, Component, Node, RigidBody, Vec3, PhysicsSystem, geometry } from 'cc';
import { BridgeTrigger } from './BridgeTrigger';
const { ccclass, property } = _decorator;

@ccclass('WheelUpdate')
export class WheelUpdate extends Component { 
    private ray = new geometry.Ray(); 
    rigidBody:RigidBody;

    protected start(){
        this.rigidBody = this.getComponent(RigidBody);
    }

    isTouchingGround(): boolean {
        const wheelPos = this.node.worldPosition;
        geometry.Ray.set(this.ray, wheelPos.x, wheelPos.y, wheelPos.z, 0, -1, 0);
        return PhysicsSystem.instance.raycastClosest(this.ray, 1 << 0, 1.2, false);
    }

    tryDamageBridge(): boolean {
        const result = PhysicsSystem.instance.raycastClosestResult;
        const hitNode = result.collider.node;
        const bridgeTrigger = hitNode.getComponent(BridgeTrigger);

        if (bridgeTrigger) {
            bridgeTrigger.useDamagePerSecond();
            return true;  
        }

        return false;  
    }

    update(deltaTime: number) {  
        if (this.isTouchingGround()) {
            this.tryDamageBridge();
        }else{
            var force = new Vec3(0,-35,0);
            this.rigidBody.applyForce(force, Vec3.ZERO);
        }
    } 
}
