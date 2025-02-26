import { __private, _decorator, Component, EventHandler, EventTouch, Input, input, Label, Node, Sprite, tween, UIOpacity, Vec3 } from 'cc';
import { CarController } from './CarController';
const { ccclass, property } = _decorator;

@ccclass('RetryWindow')
export class RetryWindow extends Component {
    @property({ type: Node })
    content: Node = null;

    @property({ type: UIOpacity })
    downloadBtn: UIOpacity = null;

    @property([EventHandler])
    touchEvent: EventHandler[] = [];


    start() {
        CarController.deathEvent.push(this.onDeathCar.bind(this));
    }
 
    onDeathCar() {
        var opacitys = this.content.getComponentsInChildren(UIOpacity); 

        this.content.active = true;

        for (let opacity of opacitys) {
            tween(opacity)
                .to(1.3, { opacity: 255 })  
                .start();
        }

        tween( this.content)
            .set({ scale: new Vec3(2, 2, 2) })  
            .to(1, { scale: new Vec3(1, 1, 1) }) 
            .start();
            

        tween(this.downloadBtn)
                .to(1, { opacity: 0 })  
                .start();

        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(event: EventTouch) {
        EventHandler.emitEvents(this.touchEvent, this);
    }

}


