import { _decorator, Component, EventTouch, Input, input, Node, Vec3, tween } from 'cc';
import { CarController } from './CarController';
const { ccclass, property } = _decorator;

@ccclass('Joystick')
export class Joystick extends Component {
    @property({ type: Node })
    stick: Node = null;

    @property({ type: Node })
    hand: Node = null; 

    maxOffset: number = 150;
    handMoveOffset: number = 150; // Насколько двигается рука
    handMoveTime: number = 1 // Время движения руки
    handSleepTime: number = 1.5
    handHideTime : number = 3
    handStartSleepTime : number = 1

    startPos: Vec3 = new Vec3();
    static inputY: number = 0;
    tutorialActive: boolean = true;

    start() {
        if (this.stick) {
            this.startPos.set(this.stick.position);
        }
        this.hand.active = false
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.scheduleOnce(() => {
            this.startHandTutorial();
        }, this.handStartSleepTime); 

        CarController.deathEvent.push(this.onDeathCar.bind(this));
    }

    onDeathCar(){
        this.node.parent.active = false;
    }

    onTouchStart(event: EventTouch) {
        if (!this.stick) return;
        this.hideHand();
        const touchPos = event.getUILocation();
        this.updateStickPosition(touchPos.y);
    }

    onTouchMove(event: EventTouch) {
        if (!this.stick) return;
        this.hideHand();
        const touchPos = event.getUILocation();
        this.updateStickPosition(touchPos.y);
    }

    onTouchEnd(event: EventTouch) {
        if (!this.stick) return;
        this.stick.setPosition(this.startPos);
        Joystick.inputY = 0;
        this.scheduleTutorialRestart();
    }

    private updateStickPosition(touchY: number) {
        const deltaY = touchY - this.startPos.y;
        const clampedY = Math.max(-this.maxOffset, Math.min(this.maxOffset, deltaY));
        this.stick.setPosition(this.startPos.x, this.startPos.y + clampedY, this.startPos.z);
        
        Joystick.inputY = clampedY / this.maxOffset;
    }

    private startHandTutorial() {
        if (!this.hand) return;
        this.tutorialActive = true;

        const startPos = this.hand.position.clone();
        const endPos = new Vec3(startPos.x, startPos.y + this.handMoveOffset, startPos.z);

        const tutorialLoop = () => {
            if (!this.tutorialActive) return;

            this.hand.setPosition(startPos);
            this.hand.active = true;

            tween(this.hand)
                .to(this.handMoveTime, { position: endPos })// Опускаем руку
                .call(() => this.hand.active = false)       // Исчезает
                .delay(this.handHideTime)                                   // Ждём перед повтором
                .call(tutorialLoop)                         // Повторяем цикл
                .start();
        };

        tutorialLoop();
    }

    private hideHand() {
        if (this.hand) {
            this.hand.active = false;
            this.tutorialActive = false;
        }
    }

    private scheduleTutorialRestart() {
        this.scheduleOnce(() => {
            if (Joystick.inputY === 0) {
                this.startHandTutorial();
            }
        }, this.handSleepTime);
    }
}
