import { _decorator, Component, HingeConstraint, ITriggerEvent, Node, RigidBody, Vec3 } from 'cc';
import { PhysicsAlive } from './PhysicsAlive';
import { CarModule } from './CarModule';
import { RoadDamage } from '../RoadDamage';
const { ccclass, property } = _decorator;

@ccclass('CarPart')
export class CarPart extends PhysicsAlive {
     
    @property({ type: RigidBody })
    carRb: RigidBody = null;

    carModule: CarModule = null; 

    summ:number=0;

    start(){
        super.start();
        this.setAlive();
    }

    init(carModule: CarModule){
        this.carModule = carModule;
    }

    onCollisionEnter(event: ITriggerEvent) { 
        let linearVelocity = new Vec3();
        let angularVelocity = new Vec3();

        this.carRb.getLinearVelocity(linearVelocity);
        this.carRb.getAngularVelocity(angularVelocity);

        var roadDamage = event.otherCollider.node.getComponent(RoadDamage);
        var addDamage = roadDamage ?roadDamage.damage : 0;

        const damage = this.calculateDamage(linearVelocity, angularVelocity, addDamage);
        this.summ+=damage;
        //console.log("Урон колеса: ", this.summ);
        this.applyDamage(damage, this);
    }

     
    calculateDamage(velocity: Vec3, angularVelocity: Vec3, addDamage:number =0): number {
        const linearSpeed = velocity.length();  
        const angularSpeed = angularVelocity.length();  

        const damage = linearSpeed * 0.2 + angularSpeed * 0.2 + addDamage;
        return damage;
    }

    onDeath(){
        this.carModule.death();
    }

}


