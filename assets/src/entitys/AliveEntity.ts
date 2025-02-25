import { _decorator, Component, Layers, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AliveEntity')
export class AliveEntity extends Component {
    @property
    maxHealth: number = 100;

    @property
    isShowDamageNum: boolean = true;

    @property
    damagHeightText: number = 1;

    @property
    debugMode: boolean = false;

    defaultHealth: number = 100;
    _health: number = this.defaultHealth;
    isAlive: boolean = true;
    armor: number = 0; 
    _myNode:Node;

    @property
    healthUpdateEvent: Function[] = [];

    @property
    damageEvent: Function[] = [];

    @property
    aliveEvent: Function[] = [];

    @property
    deathEvent: Function[] = [];

    onLoad () {
        this._myNode = this.node;  
    }

    onEnable () { 
        this.setMaxHealth(this.maxHealth);
    }

    start() { 
    } 

    onDisable () { 
    }

    getWorldPosition(){ 
        if(!this.isAlive){
            return Vec3.zero;
        }
        return this._myNode.worldPosition.clone();
    }

    setMaxHealth(val: number) {
        let coef = val / this.maxHealth - 1;
        this.maxHealth = val;
        let hpBonus = this._health * coef;
        this._health += hpBonus;
        this.healthUpdateEvent.forEach(func => func(this._health, -hpBonus)); 
    }

    setArmor(val: number) {
        this.armor = val;
    }

    applyDamage(damage: number, damageSource: AliveEntity, 
            showDamage: boolean = true,  
            visualDamage: number = -1) {
        if (this.isAlive) {
            damage *= (1 - this.armor); // armor protection
            this._health = Math.max(0, this._health - damage);
            if (this.isShowDamageNum)
                this.showDamage(visualDamage > 0 ? visualDamage : damage);
            this.healthUpdateEvent.forEach(func => func(this._health, damage));
            this.damageEvent.forEach(func => func(damage));
            if (this._health <= 0)
                this.setDead(damageSource);
        }
    }

    showDamage(damage: number) {
         
    }

    regen(regen: number) {
        let regenValue = this.maxHealth * regen;
        if (this._health + regenValue > this.maxHealth) {
            regenValue = this.maxHealth - this._health;
        }
        this._health += regenValue;
        this.healthUpdateEvent.forEach(func => func(this._health, -regenValue));
    }

    setAlive() {
        this._health = this.maxHealth;
        this.isAlive = true;
        this.aliveEvent.forEach(func => func());
        this.healthUpdateEvent.forEach(func => func(this._health, -this.maxHealth));
    }

    setDead(killer: AliveEntity) {
        this._health = 0;
        this.isAlive = false;
        this.deathEvent.forEach(func => func(killer));
        this.onDeath();
    }
 
    onDeath(){

    }
}


