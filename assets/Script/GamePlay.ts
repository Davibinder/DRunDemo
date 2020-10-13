// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import {PlatformType,PowerUps} from "./Platform";
import {GameUtils} from "./GameUtils";
import {AudioMgr} from "./AudioMgr";


enum ComponentZOrders {
    Player      =   50,    
    Platform    =   45,
}
const {ccclass, property} = cc._decorator;

@ccclass
export default class GamePlay extends cc.Component {

    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Label)
    score: cc.Label = null;

    @property(cc.Node)
    container: cc.Node = null;

    @property(cc.Node)
    headerBar: cc.Node = null;

    @property(cc.Prefab)
    platForm: cc.Prefab = null;

    size: cc.Size = null;
    playerPreviousPos : cc.Vec2 = null;
    isDownWard : boolean = false;
    platformFound: boolean = false;
    isJumpCompleted:boolean = false;    

    minPlatformDistance:number = 30;
    maxPlatformDistance:number = 80;

    lastPlatformYPosition : number = 0;
    scoreCounter : number = 0;

    pPlatformY: number = 0;

    isOnhelicopter:boolean = false;
    isOnSpring:boolean = false;
    
    // LIFE-CYCLE CALLBACKS:
    onLoad () {        
        this.scoreCounter = 0;
        this.size = this.container.getContentSize();
        this.playerPreviousPos = this.player.getPosition();
        this.player.zIndex = ComponentZOrders.Player;
        this.player.name = "player";
        this.headerBar.zIndex = ComponentZOrders.Player - 1;
        this.player.getComponent("Player").gamePlay = this;
        this.addNewPlatforms();
        
    }

    start () {
        
    }

    update (dt) {
        // Game Over
        if(this.player.y < -this.size.height*0.7 ){
            cc.director.loadScene("GameOver",(error: any, scene: cc.Scene)=>{
                if (error) {
                    cc.log(error.message || error);
                }else{
                    cc.log("Game Over Scene loaded successfully");
                }
            });
        }
        // check player up/down movement
        if(this.player.y < (this.playerPreviousPos.y - 2)){
            this.isDownWard = true;
        }else{
            this.isDownWard = false;
        }        
        this.playerPreviousPos = this.player.position;
        // Player left /right bounds
        if(this.player.x < -this.size.width/2 + (this.player.getContentSize().width * 1.2))
            this.player.x = -this.size.width/2 + (this.player.getContentSize().width *1.2);
        if(this.player.x > this.size.width/2 - (this.player.getContentSize().width*1.2))
            this.player.x = this.size.width/2 - (this.player.getContentSize().width*1.2);
        
        // platform detection
        if(this.isOnhelicopter || this.isOnSpring){
            this.container.children.forEach(child => {
                if(child.name == "platform"){
                    child.y = child.y - 15;
                }
            });

        }else{
            if(!this.platformFound && this.isJumpCompleted){
                this.player.setPosition(cc.v2(this.player.getPosition().x,this.player.getPosition().y=this.player.getPosition().y-15))
               }
        }

       // destroy platform which are out of bounds
       this.destroyPlatforms();

    }

    /**
     * Destroy platform which gets out of screen from below
     */
    destroyPlatforms(){
        this.container.children.forEach(child => {
            if(child.y < -this.size.height*0.5 && child.name == "platform"){
                child.destroy();
                this.score.string = "Score : "+this.scoreCounter;
                this.scoreCounter = this.scoreCounter + 1;
            }
        });
    }

    /**
     * Move platorm down according to player step
     * @param speed 
     * @param offset 
     * @param powerUp 
     */
    movePlatformsDown(speed,offset,powerUp){
        // cc.log("child counts : "+this.container.childrenCount);
        AudioMgr.getInstance().playEffect("sounds/jump.mp3");
        this.container.children.forEach(child => {
            if(child.name == "platform" || child.name == "player"){
                child.runAction(cc.moveTo(speed,cc.v2(child.x,child.y-offset)));
            }
        });
    }
    /**
     * Set Player/Doodle behaviour in case power up(Helocopter/spring) collided
     * @param powerup 
     */
    powerUpsBehaviour(powerup){
        AudioMgr.getInstance().playEffect("sounds/power_jump.mp3");
        if(powerup == PowerUps.Helicopter){
            let actionSequenve = cc.sequence(
                cc.callFunc(function() {
                    this.player.stopAllActions();
                    if(this.player.y < 0) this.player.runAction(cc.moveTo(0.2,cc.v2(this.player.x,0)));
                }.bind(this)),
                cc.callFunc(function() {
                    this.isOnhelicopter = true;
                }.bind(this)),
                cc.delayTime(3),
                cc.callFunc(function() {
                    this.isOnhelicopter = false;
                    this.isJumpCompleted = true;
                }.bind(this))
                );
            this.node.runAction(actionSequenve);
        }else if(powerup == PowerUps.Spring){
            let actionSequenve = cc.sequence(
                cc.callFunc(function() {
                    this.player.stopAllActions();
                    if(this.player.y < 0) this.player.runAction(cc.moveTo(0.2,cc.v2(this.player.x,0)));
                }.bind(this)),
                cc.callFunc(function() {
                    this.isOnSpring = true;
                }.bind(this)),
                cc.delayTime(1),
                cc.callFunc(function() {
                    this.isOnSpring = false;
                    this.isJumpCompleted = true;
                }.bind(this))
                );
            this.node.runAction(actionSequenve);
        }
    }
    
    /**
     * Add platforms to level
     */
    addNewPlatforms(){
        var platform = cc.instantiate(this.platForm);
        platform.name = "platform";
        this.container.addChild(platform);
        platform.setPosition(cc.v2(this.player.getPosition().x,this.player.getPosition().y - 50));
        this.lastPlatformYPosition = platform.getPosition().y;
        this.pPlatformY =  platform.getPosition().y;
        platform.getComponent('Platform').gamePlay = this;
        platform.getComponent('Platform').player = this.player.getComponent("Player");
        platform.getComponent('Platform').spring.active = false;
        platform.getComponent('Platform').helicopter.active = false;
        let level_1 = 0;
        while(level_1 < 1000) {
            this.addNewPlatform();
            level_1 = level_1 + 1;
        }
    }
    /**
     * Add single platform to level either on level or anywhere dynamically needed
     */
    addNewPlatform(){
        
        var platform = cc.instantiate(this.platForm);
        platform.name = "platform";
        this.container.addChild(platform);
        var randX =  GameUtils.randomIntFromInterval(-this.size.width/2+100,this.size.width/2-100);
        var randY =  this.lastPlatformYPosition + GameUtils.randomIntFromInterval(this.minPlatformDistance,this.maxPlatformDistance);
        platform.setPosition(cc.v2(randX,randY));
        this.lastPlatformYPosition = platform.getPosition().y;
        this.platformTypeAndPowerUp(platform);
        platform.getComponent('Platform').gamePlay = this;
        platform.getComponent('Platform').player = this.player.getComponent("Player");
    }

    /**
     * Function will set type of platform i.e static,moving,static broken randomly and append power ups
     * @param platform 
     */
    platformTypeAndPowerUp(platform){
        let prob = Math.random();
        if(platform.y > this.size.width && prob<= 0.2 && prob>= 0.1){
            platform.getComponent('Platform').type = PlatformType.StaticBroken;
            platform.getComponent('Platform').spring.active = false;
            platform.getComponent('Platform').helicopter.active = false;
        }else if(platform.y > this.size.width && prob > 0.9 && prob <= 1){
            if(Math.random() >= 0.2) platform.getComponent('Platform').spring.active = false;
            platform.getComponent('Platform').helicopter.active = false;
            platform.getComponent('Platform').type = PlatformType.Moving;
        }else{
            if(Math.random() >= 0.1) platform.getComponent('Platform').helicopter.active = false;
            platform.getComponent('Platform').spring.active = false;
            platform.getComponent('Platform').type = PlatformType.Static;

        }
    }
}
