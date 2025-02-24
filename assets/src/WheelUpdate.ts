import { _decorator, Component, Node, RigidBody, Vec3, PhysicsSystem, geometry } from 'cc';
import { BridgeTrigger } from './BridgeTrigger';
const { ccclass, property } = _decorator;

@ccclass('WheelUpdate')
export class WheelUpdate extends Component { 
    private ray = new geometry.Ray(); 
 
    isTouchingGround(): boolean {
        const wheelPos = this.node.worldPosition;
        geometry.Ray.set(this.ray, wheelPos.x, wheelPos.y, wheelPos.z, 0, -1, 0);
        return PhysicsSystem.instance.raycastClosest(this.ray, 1 << 0, 1.2, false);
    }

    tryDamageBridge(): boolean {
        const wheelPos = this.node.worldPosition;
        geometry.Ray.set(this.ray, wheelPos.x, wheelPos.y, wheelPos.z, 0, -1, 0);
        
        const isRaycastClosest =  PhysicsSystem.instance.raycastClosest(this.ray, 1 << 0, 1.2, false);
        const result = PhysicsSystem.instance.raycastClosestResult;
    
        if (isRaycastClosest) {
            const hitNode = result.collider.node;
            const bridgeTrigger = hitNode.getComponent(BridgeTrigger);
            bridgeTrigger.useDamagePerSecond();
            
            if (bridgeTrigger) {
                return false;  
            }
    
            return true;  
        }
    
        return false;  
    }

    update(deltaTime: number) {  
        if (!this.tryDamageBridge()) {
            return;  
        } 
    } 
}
