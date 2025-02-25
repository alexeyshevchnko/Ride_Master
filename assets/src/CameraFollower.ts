import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFollower')
export class CameraFollower extends Component {
    @property(Node)
    target: Node = null; 

    @property(Vec3)
    offset: Vec3 = new Vec3(0, 5, -10); 

    start() {
        if (!this.target) {
            console.error('Target not assigned to CameraFollower script.');
        }
    }

    update(deltaTime: number) {
        if (this.target) {
            
            const cameraPosition = new Vec3(this.target.position.x + this.offset.x, this.offset.y, this.offset.z);
            
            if(this.target.position.x > 130 || this.target.position.y<-2)
                return;
            
            this.node.setPosition(cameraPosition);
        }
    }
}
