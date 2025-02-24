import { _decorator, Component, Node, Vec3, input, Input, EventKeyboard, KeyCode, Quat, EventTouch, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CarController2')
export class CarController2 extends Component {
    @property({ type: Node })
    car: Node = null;

    @property({ type: Node })
    frontLeftWheel: Node = null;

    @property({ type: Node })
    frontRightWheel: Node = null;

    @property({ type: Node })
    backLeftWheel: Node = null;

    @property({ type: Node })
    backRightWheel: Node = null;

    @property
    rotateSpeed: number = 0.9;

    @property
    speed: number = 0;

    @property
    acceleration: number = 20;

    @property
    maxSpeed: number = 100;

    @property
    deceleration: number = 20;

    private currentSpeed: number = 0;
    private isAccelerating: boolean = false; 

    start() {
        input.on(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        this.isAccelerating = true;
    }

    onTouchEnd(event: EventTouch) {
        this.isAccelerating = false;
    }

    update(deltaTime: number) {
        //todo
        if((sys.os === sys.OS.ANDROID || sys.os === sys.OS.IOS) && this.isAccelerating){
            this.currentSpeed += this.acceleration;
        }

        if (!this.isAccelerating) {
            if (this.currentSpeed > 0) {
                this.currentSpeed -= this.deceleration * deltaTime;
                if (this.currentSpeed < 0) this.currentSpeed = 0;
            } else if (this.currentSpeed < 0) {
                this.currentSpeed += this.deceleration * deltaTime;
                if (this.currentSpeed > 0) this.currentSpeed = 0;
            }
        }

        if (this.currentSpeed > this.maxSpeed) {
            this.currentSpeed = this.maxSpeed;
        } else if (this.currentSpeed < -this.maxSpeed) {
            this.currentSpeed = -this.maxSpeed;
        }

        this.car.setPosition(new Vec3(this.car.position.x + this.currentSpeed * deltaTime, this.car.position.y, this.car.position.z));
        this.rotateWheels(deltaTime);
    }

    private rotateWheels(deltaTime: number) {
        const wheelRotationSpeed = 360 * this.currentSpeed *this.rotateSpeed;

        const rotationQuat = new Quat();
        Quat.fromEuler(rotationQuat, -90, 0, wheelRotationSpeed * deltaTime);

        if (this.frontLeftWheel) this.frontLeftWheel.setRotation(rotationQuat);
        if (this.frontRightWheel) this.frontRightWheel.setRotation(rotationQuat);
        if (this.backLeftWheel) this.backLeftWheel.setRotation(rotationQuat);
        if (this.backRightWheel) this.backRightWheel.setRotation(rotationQuat);
    }

    private onKeyPressing(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                this.isAccelerating = true;
                this.currentSpeed += this.acceleration;
                break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN: 
                this.isAccelerating = true;
                this.currentSpeed -= this.acceleration;
                break;
        }
    }

    private onKeyUp(event: EventKeyboard) {
        if (event.keyCode === KeyCode.ARROW_UP || event.keyCode === KeyCode.ARROW_DOWN || KeyCode.KEY_S || KeyCode.KEY_W) {
            this.isAccelerating = false;
        }
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyPressing, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }
} 