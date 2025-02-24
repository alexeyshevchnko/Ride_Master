import { _decorator, BoxCollider, Component, ITriggerEvent, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CarDamageController')
export class CarDamageController extends Component {
    @property({ type: BoxCollider })
    triggerCollider: BoxCollider = null;
    
    start() {
        this.triggerCollider.on('onTriggerEnter', this.onDamage, this); 
    }

    onDamage(event: ITriggerEvent) {
        console.log("onDamage");
    }

    onDestroy() { 
        this.triggerCollider.off('onTriggerEnter', this.onDamage, this); 
    }
}


