import { _decorator, Collider, Component, Node, RigidBody } from 'cc';
import { CarPart } from './CarPart';
const { ccclass, property } = _decorator;

@ccclass('CarModule')
export class CarModule extends Component {
    @property({ type: RigidBody })
    rb: RigidBody = null;

    @property({ type: Collider })
    collider: Collider = null;
    
    @property({ type: [CarPart] })
    carParts: CarPart[] = [];

    start(){
        for(var i = 0; i < this.carParts.length; i++){
            this.carParts[i].init(this);
        }
    }
    
    death(){
        console.log("death CarModule " + this.name);

        for(var i = 0; i < this.carParts.length; i++){
            this.carParts[i].init(this);
        }
    }
}


