import { _decorator, Collider, Component, director, Node, physics, RigidBody, Vec3 } from 'cc';
import { CarPart } from './CarPart';
import { WheelUpdate } from '../WheelUpdate';
const { ccclass, property } = _decorator;

@ccclass('CarModule')
export class CarModule extends Component {
    @property({ type: RigidBody })
    carRb: RigidBody = null;
    
    @property({ type: RigidBody })
    rb: RigidBody = null;

    @property({ type: Collider })
    collider: Collider = null;
    
    @property({ type: [CarPart] })
    carParts: CarPart[] = [];   

    @property
    disableCoillider:boolean = false;

    @property
    isRandomVelocity:boolean = true;

    start(){
        if(this.disableCoillider)
            this.collider.enabled = false;
       
        for(var i = 0; i < this.carParts.length; i++){
            this.carParts[i].init(this);
        }
    }
    
    death(){
        console.log("death CarModule " + this.name);

        let linearVelocity = new Vec3();
        let angularVelocity = new Vec3();

        this.carRb.getLinearVelocity(linearVelocity);
        this.carRb.getAngularVelocity(angularVelocity);

        for(var i = 0; i < this.carParts.length; i++){
            const part = this.carParts[i];
            var constraint = part.getHingeConstraint();
            if(constraint !== null) {
                constraint.enabled = false;
                constraint.destroy();
            }

            if(part.node !== this.node){
                part.node.parent = this.node;
                part.rb.type = RigidBody.Type.STATIC;
            }
            
            var wheelUpdate = part.node.getComponent(WheelUpdate);
            if(wheelUpdate){
                wheelUpdate.destroy();
                //part.rb.destroy();
                //part.rb.setLinearVelocity(Vec3.ZERO);
                //part.rb.setAngularVelocity(Vec3.ZERO);  
            }
        }

        var oldPos = this.node.getWorldPosition().clone();
        var oldRot = this.node.getWorldRotation().clone();
        this.node.parent = director.getScene();
        this.node.setWorldPosition(oldPos);
        this.node.setWorldRotation(oldRot);

        this.rb.type = RigidBody.Type.DYNAMIC;

        if(!this.isRandomVelocity){
            this.rb.setLinearVelocity(linearVelocity);
            this.rb.setAngularVelocity(angularVelocity);  
           // this.rb.setLinearVelocity(new Vec3(0,-100,0));
        }else{
            this.rb.setLinearVelocity(new Vec3(
                Math.random() * (20 - 15) + 15, 
                Math.random() * (20 - 15) + 15, 
                Math.random() * (20 - 15) + 15
            ));    
            const randomAngularVelocity = new Vec3(
                Math.random() * 2 - 0.6,   
                Math.random() * 2 - 0.6,  
                Math.random() * 2 - 0.6   
            );
            this.rb.setAngularVelocity(randomAngularVelocity);
            this.rb.mass = 100;
        }
        
        
        this.collider.enabled = true;
        
    }
}


