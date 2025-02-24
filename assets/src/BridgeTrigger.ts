import { _decorator, Component, Collider, ITriggerEvent, RigidBody, Vec3, BoxCollider, randomRange, random } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BridgeTrigger')
export class BridgeTrigger extends Component {
    mainCollider: BoxCollider = null; 
    triggerCollider: BoxCollider = null;

    @property
    debug: boolean = true;

    @property
    id: number = -1;

    @property
    maxHealth: number = 5; 

    @property
    damagePerSecond: number = 1;

    private health: number = 0;
    private isCarOnBridge: boolean = false;
    private rigidBody: RigidBody = null;
    private carRigidBody: RigidBody = null;
    lastDeltaTime:number;

    onLoad() {
        this.damagePerSecond = 30 +this.id * 0.9;  
        this.health = this.maxHealth; 

        const colliders = this.node.getComponents(BoxCollider);
        for(var i =0; i< colliders.length; i++){
            if(colliders[i].isTrigger){
                this.triggerCollider = colliders[i];
            }else{
                this.mainCollider = colliders[i];
            }
        }

        this.rigidBody = this.getComponent(RigidBody);
        if (!this.rigidBody) {
            console.error("BridgeTrigger: RigidBody не найден на мосту!");
            return;
        } 
    }

    update(deltaTime: number) {
        this.lastDeltaTime = deltaTime; 
    }

    useDamagePerSecond(){
        
        this.health -= this.damagePerSecond * this.lastDeltaTime; 
        if (this.health <= 0) {
            this.breakBridge();
        }
    }
 
    private breakBridge() { 

        this.mainCollider.enabled = false;       
        this.triggerCollider.enabled = false;

        if(this.carRigidBody){
            
            this.carRigidBody.setLinearVelocity(new Vec3(0, -5, 0)); 
            
        }

        // Делаем мост физическим (падает вниз)
        this.rigidBody.type = RigidBody.Type.DYNAMIC;
        this.rigidBody.mass = 10;  // Масса для физики

        var x = random()*10;
        var z = random()*10;

        this.rigidBody.setLinearVelocity(new Vec3( ( Math.random() * 2 - 1) * 10, -30, ( Math.random() * 2 - 1) * 10));   
        const randomAngularVelocity = new Vec3(
            Math.random() * 2 - 1,   
            Math.random() * 2 - 1,  
            Math.random() * 2 - 1   
        );
        
        // Устанавливаем угловую скорость на Rigidbody
        this.rigidBody.setAngularVelocity(randomAngularVelocity);
    }
}
