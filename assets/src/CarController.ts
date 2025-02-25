import { _decorator, Component, Node, Vec3, input, Input, EventKeyboard, KeyCode, RigidBody } from 'cc';
import { Joystick } from './Joystick';
const { ccclass, property } = _decorator;

@ccclass('CarController')
export class CarController extends Component {
    @property({ type: Node })
    car: Node = null;

    @property
    acceleration: number = 50;

    @property
    maxSpeed: number = 50;

    @property
    deceleration: number = 20; // Увеличил, чтобы торможение было эффективнее

    private rigidBody: RigidBody = null;

    start() {
        this.rigidBody = this.car.getComponent(RigidBody);
        if (!this.rigidBody) {
            console.error('No RigidBody attached to the car');
            return;
        }

        input.on(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
    }

    update(deltaTime: number) {
        let inputY = Joystick.inputY;

        const velocity = new Vec3();
        this.rigidBody.getLinearVelocity(velocity);
        let speed = velocity.length();

        if (inputY > 0) {
            // Ускорение вперёд
            const impulse = new Vec3(this.acceleration * deltaTime, 0, 0);
            this.rigidBody.applyImpulse(impulse, Vec3.ZERO);
        } else if (inputY < 0) {
            // Торможение
            let brakeForce = this.deceleration * deltaTime;
            speed = Math.max(0, speed - brakeForce);
            velocity.normalize().multiplyScalar(speed);
            this.rigidBody.setLinearVelocity(velocity);
        }

        // Ограничение максимальной скорости
        if (speed > this.maxSpeed) {
            velocity.normalize().multiplyScalar(this.maxSpeed);
            this.rigidBody.setLinearVelocity(velocity);
        }
    }

    onKeyPressing(event: EventKeyboard) {
        this.useKeyCode(event.keyCode);
    }

    useKeyCode(keyCode: KeyCode) {
        switch (keyCode) {
            case KeyCode.ARROW_UP:
            case KeyCode.KEY_W:
                this.applyAcceleration();
                break;
            case KeyCode.ARROW_DOWN:
            case KeyCode.KEY_S:
                this.applyBraking();
                break;
        }
    }

    private applyAcceleration() {
        const impulse = new Vec3(this.acceleration * 0.016, 0, 0);
        this.rigidBody.applyImpulse(impulse, Vec3.ZERO);
    }

    private applyBraking() {
        const velocity = new Vec3();
        this.rigidBody.getLinearVelocity(velocity);
        let speed = velocity.length();

        let brakeForce = this.deceleration * 0.016;
        speed = Math.max(0, speed - brakeForce);
        velocity.normalize().multiplyScalar(speed);
        this.rigidBody.setLinearVelocity(velocity);
    }

    onDestroy() {
        input.off(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
    }
}
