// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import GamePlay from "./GamePlay";
import Player from "./Player";

export enum PlatformType {
    Static          =   100,    
    Moving          =   101,    
    StaticBroken    =   102,
}

export enum PowerUps {
    Normal      =   200,    
    Helicopter  =   201,    
    Spring      =   202,
}

export enum MoveActionTags {
    LeftMove    =   300,    
    RightMove   =   301,    
    Default     =   302,
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class Platform extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    type: PlatformType = 0;

    @property(cc.Node)
    spring: cc.Node = null;

    @property(cc.Node)
    helicopter: cc.Node = null;

    @property(cc.SpriteFrame)
    brokenFrame:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    movingFrame:cc.SpriteFrame = null;

    gamePlay : GamePlay = null;
    player : Player = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        this.setupCollider();
    }

    start () {        
        // this.helicopter.active = false;
        // this.spring.active = false;
        if(this.type == PlatformType.Moving){
            this.node.getComponent(cc.Sprite).spriteFrame = this.movingFrame;
        }else if(this.type == PlatformType.StaticBroken){
            this.node.getComponent(cc.Sprite).spriteFrame = this.brokenFrame;
        }

    }

    update (dt) {
        if(this.node.y < this.gamePlay.size.height/2 && this.type == PlatformType.Moving){
            if(this.node.getActionByTag(MoveActionTags.Default) || this.node.getActionByTag(MoveActionTags.LeftMove) || this.node.getActionByTag(MoveActionTags.RightMove)) return;
            var action = cc.moveTo(5,cc.v2(this.gamePlay.size.width/2,this.node.y));
            action.setTag(MoveActionTags.Default);
            this.node.runAction(action);
        }
    }

    /**
     * Add dynamic collider to Pre-fabricated resources
     */
    setupCollider(){
        this.node.addComponent(cc.BoxCollider);
        this.node.getComponent(cc.BoxCollider).enabled = true;
        this.node.getComponent(cc.BoxCollider).size = this.node.getContentSize();
    }

    /**
     * Horozontal Movement of movable platforms
     * @param isLeft 
     */
    movePlatformHorizontly(isLeft){
        if(isLeft){
            var action = cc.moveTo(5,cc.v2(-this.gamePlay.size.width/2,this.node.y));
            action.setTag(MoveActionTags.LeftMove);
            this.node.runAction(action);
        }else{
            var action = cc.moveTo(5,cc.v2(this.gamePlay.size.width/2,this.node.y));
            action.setTag(MoveActionTags.RightMove);
            this.node.runAction(action);
        }        
    }

    /**
    * Call when a collision is detected
    * @param  {Collider} other The other Collider Component
    * @param  {Collider} self  Self Collider Component
    */
   onCollisionEnter (other, self) {
        // cc.log('on collision enter');
        if(other.node.group === 'left'){
            // cc.log("collided with left");
            if(this.type == PlatformType.Moving){
                this.node.stopAllActions();
                // this.node.runAction(cc.moveTo(5,cc.v2(this.gamePlay.size.width/2,this.node.y)));
                this.movePlatformHorizontly(false);
            }

        }else if(other.node.group === 'right'){
            // cc.log("collided with right");
            if(this.type == PlatformType.Moving){
                this.node.stopAllActions();
                // this.node.runAction(cc.moveTo(5,cc.v2(-this.gamePlay.size.width/2,this.node.y)));
                this.movePlatformHorizontly(true);
            }

        }else{

        }
        if(this.gamePlay.isDownWard && other.node.group === 'player'){
            if(this.type == PlatformType.StaticBroken){
                this.node.destroy();
            }else{
                this.gamePlay.platformFound = true;
                this.player.stopAllPlayerActions();
                this.player.startJump(this.player.getCurrentPosition());
                if((this.node.y - this.gamePlay.pPlatformY) > 0){
                    if(this.helicopter.active == true){
                        this.gamePlay.powerUpsBehaviour(PowerUps.Helicopter);
                    }
                    else if(this.spring.active == true){
                        this.gamePlay.powerUpsBehaviour(PowerUps.Spring);
                    }else {
                        this.gamePlay.movePlatformsDown(0.3,(this.node.y - this.gamePlay.pPlatformY),PowerUps.Normal);
                    }
                }else{
                    if(this.helicopter.active == true){
                        this.gamePlay.powerUpsBehaviour(PowerUps.Helicopter);
                    }
                    else if(this.spring.active == true){
                        this.gamePlay.powerUpsBehaviour(PowerUps.Spring);
                    }
                }
                
            }
        }
    }

    /**
    * Call after enter collision, before end collision, and after every time calculate the collision result.
    * @param  {Collider} other The other Collider Component
    * @param  {Collider} self  Self Collider Component
    */
    onCollisionStay (other, self) {
        // cc.log('on collision stay');
    }
    /**
    * Call after end collision
    * @param  {Collider} other The other Collider Component
    * @param  {Collider} self  Self Collider Component
    */
    onCollisionExit (other, self) {
        // cc.log('on collision exit');
        this.gamePlay.platformFound = false;
    }
    

}
