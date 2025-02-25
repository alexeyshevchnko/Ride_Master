import { _decorator, Collider, Component, ITriggerEvent, Node, RigidBody } from 'cc';
import { AliveEntity } from './AliveEntity';
const { ccclass, property } = _decorator;

@ccclass('PhysicsAlive')
export abstract class PhysicsAlive extends AliveEntity {
    @property({ type: RigidBody })
    rb: RigidBody = null;

    @property({ type: Collider })
    collider: Collider = null;
    
    start(){
        super.start();
        this.collider.on('onCollisionEnter', this.onCollisionEnter, this);
    }

    abstract onCollisionEnter(event: ITriggerEvent);

    onDestroy() {
        this.collider.off('onCollisionEnter', this.onCollisionEnter, this);
    }
}


