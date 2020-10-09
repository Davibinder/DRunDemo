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

const {ccclass, property} = cc._decorator;

@ccclass
export default class Platform extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    type: PlatformType = 0;

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
        if(this.type == PlatformType.Moving){
            this.node.runAction(cc.moveTo(5,cc.v2(this.gamePlay.size.width/2,this.node.y)));
        }

    }

    update (dt) {
    }

    setupCollider(){
        this.node.addComponent(cc.BoxCollider);
        this.node.getComponent(cc.BoxCollider).enabled = true;
        this.node.getComponent(cc.BoxCollider).size = this.node.getContentSize();
    }

    /**
    * Call when a collision is detected
    * @param  {Collider} other The other Collider Component
    * @param  {Collider} self  Self Collider Component
    */
   onCollisionEnter (other, self) {
        cc.log('on collision enter');
        if(other.node.group === 'left'){
            cc.log("collided with left");
            if(this.type == PlatformType.Moving){
                this.node.stopAllActions();
                this.node.runAction(cc.moveTo(5,cc.v2(this.gamePlay.size.width/2,this.node.y)));
            }

        }else if(other.node.group === 'right'){
            cc.log("collided with right");
            if(this.type == PlatformType.Moving){
                this.node.stopAllActions();
                this.node.runAction(cc.moveTo(5,cc.v2(-this.gamePlay.size.width/2,this.node.y)));
            }

        }else{

        }
        if(this.gamePlay.isDownWard){
            this.gamePlay.platformFound = true;
            this.player.stopAllPlayerActions();
            this.player.startJump(this.player.getCurrentPosition());
            //
            if(this.node.getPosition().y > -this.gamePlay.size.height*0.1){
                // this.gamePlay.addNewPlatform_1();
                // for (let index = 0; index < 2; index++) {
                //     this.gamePlay.addNewPlatform(false);            
                // }
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
