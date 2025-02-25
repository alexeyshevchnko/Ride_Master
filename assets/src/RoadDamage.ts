import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RoadDamage')
export class RoadDamage extends Component {
    @property
    damage:number = 10;
}


