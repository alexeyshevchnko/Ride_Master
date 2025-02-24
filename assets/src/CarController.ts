import { _decorator, Component, Node, Vec3, input, Input, EventKeyboard, KeyCode, RigidBody, Quat, Collider, ITriggerEvent, EventTouch, sys } from 'cc';
import { BridgeTrigger } from './BridgeTrigger';
const { ccclass, property } = _decorator;

@ccclass('CarController')
export class CarController extends Component {
    @property({ type: Node })
    car: Node = null;

    @property({ type: Node })
    frontLeftWheel: Node = null;

    @property({ type: Node })
    frontRightWheel: Node = null;

    @property({ type: Node })
    backLeftWheel: Node = null;

    @property({ type: Node })
    relativePoint: Node = null;

    rb: RigidBody = null;

    @property({ type: Node })
    backRightWheel: Node = null;

    @property
    acceleration: number = 50;

    @property
    maxSpeed: number = 50;

    @property
    deceleration: number = 5;
    
    isTouching = false;
    rigidBody: RigidBody = null;
    lastDeltaTime: number;
    summDeltaTime: number;
    start() {
        this.rigidBody = this.car.getComponent(RigidBody);
        if (!this.rigidBody) {
            console.error('No RigidBody attached to the car');
            return;
        }

        input.on(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        
        const collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this.onCarEnter, this);
    }

    onCarEnter(event: ITriggerEvent) {
        console.error("onCarEnter " +event.otherCollider.node.name);
         
        const bridgeTrigger = event.otherCollider.node.getComponent(BridgeTrigger);
            
        if (bridgeTrigger) {
            bridgeTrigger.forceDeath(); 
        }
    }

    onTouchStart(event: EventTouch) {
        this.isTouching = true;
    }

    onTouchEnd(event: EventTouch) {
        this.isTouching = false;
    }

    update(deltaTime: number) {
        this.lastDeltaTime = deltaTime;
        this.summDeltaTime +=deltaTime;

        if (this.isTouching) {
            const force = new Vec3();
            force.set(this.acceleration * deltaTime, 0, 0);  // Умножаем на deltaTime для стабильности
            this.rigidBody.applyForce(force, Vec3.ZERO);
        }
    
        const currentVelocity = new Vec3();
        this.rigidBody.getLinearVelocity(currentVelocity);
    
        // Ограничиваем скорость
        if (currentVelocity.x > this.maxSpeed) {
            this.rigidBody.setLinearVelocity(new Vec3(this.maxSpeed, currentVelocity.y, currentVelocity.z));
        } else if (currentVelocity.x < -this.maxSpeed) {
            this.rigidBody.setLinearVelocity(new Vec3(-this.maxSpeed, currentVelocity.y, currentVelocity.z));
        }
    }
    

    onKeyPressing(event: EventKeyboard) {
        const force = new Vec3();
        switch (event.keyCode) {
            case KeyCode.ARROW_UP: 
            case KeyCode.KEY_W:
                force.set(this.acceleration*this.summDeltaTime, 0, 0); 
                this.rigidBody.applyForce(force, Vec3.ZERO);
                break;
            case KeyCode.ARROW_DOWN: 
            case KeyCode.KEY_S:
                force.set(-this.acceleration*this.summDeltaTime, 0, 0); 
                this.rigidBody.applyForce(force, Vec3.ZERO);
                break;
        }
        this.summDeltaTime =0;
    }

    onDestroy() {
        input.off(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        
        const collider = this.getComponent(Collider);
        if (collider) {
            collider.off('onTriggerEnter', this.onCarEnter, this);
        }
    }
}
