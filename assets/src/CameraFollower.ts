import { _decorator, Component, Node, Vec3 } from 'cc';
import { CarController } from './CarController';
const { ccclass, property } = _decorator;

@ccclass('CameraFollower')
export class CameraFollower extends Component {
    @property(Node)
    target: Node = null; 

    @property(Vec3)
    offset: Vec3 = new Vec3(0, 5, -10); 

    start() {
        CarController.deathEvent.push(this.onDeathCar.bind(this));
    }

    onDeathCar(){
        this.enabled = false;
    }

    update(deltaTime: number) {
        if (this.target) {
            
            const cameraPosition = new Vec3(this.target.position.x + this.offset.x, this.offset.y, this.offset.z);
        
            
            this.node.setPosition(cameraPosition);
        }
    }
}
