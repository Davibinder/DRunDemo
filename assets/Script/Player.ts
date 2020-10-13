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

enum PlayerDirection {
    Left    =   200,    
    Right   =   201,    
    Up      =   202,
    Down    =   203,
    None    =   204,
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    // exposable properties
    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.SpriteFrame)
    leftFrame:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    rightFrame:cc.SpriteFrame = null;

    // genral TS properties
    jumpHeight : number = 0.0;
    
    direction : PlayerDirection = PlayerDirection.None;

    xPositionOffset : number = 5;
    
    gamePlay : GamePlay = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.jumpHeight = 150;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this); 
        this.startJump(this.getCurrentPosition());

    }

    start () {

    }

    update (dt) {
        // cc.log("direction is = "+this.direction);
        var xPos = this.node.getPosition().x;
        if(this.direction == PlayerDirection.Left){
            xPos = xPos - this.xPositionOffset;
            this.node.setPosition(cc.v2(xPos,this.node.getPosition().y));

        }else if(this.direction == PlayerDirection.Right){
            xPos = xPos + this.xPositionOffset;
            this.node.setPosition(cc.v2(xPos++,this.node.getPosition().y));

        }else{
            return;
        }
    }

    // methods

    getCurrentPosition(){
        return this.node.getPosition();
    }

    startJump(position){
        // this.node.runAction(cc.jumpTo(1,position,this.jumpHeight,1));
        var sequence = cc.sequence(
            cc.callFunc(function() {
                this.gamePlay.isJumpCompleted = false;
            }.bind(this)),
            cc.jumpTo(1,position,this.jumpHeight,1),
            cc.callFunc(function() {
                this.gamePlay.isJumpCompleted = true;
            }.bind(this))
        );
        this.node.runAction(sequence);
    }

    stopAllPlayerActions(){
        this.node.stopAllActions();
    }

    onKeyDown (event) {
        // set a flag when key pressed
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this.direction = PlayerDirection.Left;
                this.node.getComponent(cc.Sprite).spriteFrame = this.leftFrame;
                // cc.log("selected direction is ="+this.direction);
                break;
            case cc.macro.KEY.right:
                this.direction = PlayerDirection.Right;
                this.node.getComponent(cc.Sprite).spriteFrame = this.rightFrame;
                // cc.log("selected direction is ="+this.direction);
                break;
            case cc.macro.KEY.up:
                // this.startJump(this.getCurrentPosition());
                break;
            case cc.macro.KEY.down:
                break;
        }
    }

    onKeyUp (event) {
        // unset a flag when key released
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this.direction = PlayerDirection.None;
                break;
            case cc.macro.KEY.right:
                this.direction = PlayerDirection.None;
                break;
            case cc.macro.KEY.up:
                break;
            case cc.macro.KEY.down:
                break;           
                
        }
    }
}
