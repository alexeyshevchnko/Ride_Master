import { _decorator, Component, Collider, Node, PhysicsSystem, BoxCollider, ITriggerEvent } from 'cc';
import { BridgeTrigger } from './BridgeTrigger';
const { ccclass, property } = _decorator;

@ccclass('CarTrigger')
export class CarTrigger extends Component {

    @property({ type: Collider })
    collider: Collider = null;
    
    start(){ 
        this.collider.on('onCollisionEnter', this.onCollisionEnter, this);
    }

    onCollisionEnter(event: ITriggerEvent){
        //console.log("other " +event.otherCollider.name);
        //const bridgeTrigger = other.node?.getComponent(BridgeTrigger);
        //if (bridgeTrigger) {
        //    console.log("bridgeTrigger.forceDeath();");
        //    bridgeTrigger.forceDeath();
        //}
    }


    
}
