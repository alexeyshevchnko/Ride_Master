import { _decorator, Component, Node, Quat, RigidBody, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Propeller')
export class Propeller extends Component {
    @property({ type: RigidBody })
    carRb: RigidBody = null;

    @property
    maxRotationSpeed: number = 500;

    @property
    accelerationFactor: number = 20; 

    private currentRotationSpeed = 0;
    private velocity = new Vec3();

    update(deltaTime: number) {
        this.carRb.getLinearVelocity(this.velocity);
        const speed = this.velocity.length();
        this.currentRotationSpeed = speed * this.accelerationFactor;
        this.currentRotationSpeed = Math.min(this.currentRotationSpeed, this.maxRotationSpeed);
        const rotationAngle = this.currentRotationSpeed * deltaTime;
        this.node.rotate(Quat.fromEuler(new Quat(), rotationAngle, 0, 0));
    }
}
