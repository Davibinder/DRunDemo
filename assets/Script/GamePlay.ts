// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import {PlatformType} from "./Platform"
import {GameUtils} from "./GameUtils"

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
    timer : number = 0;

    pPlatformY: number = 0;
    
    // LIFE-CYCLE CALLBACKS:
    onLoad () {        
        this.timer = 0;
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
        if(this.player.y < -this.size.height/2 + 50){
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
       if(!this.platformFound && this.isJumpCompleted){
        this.player.setPosition(cc.v2(this.player.getPosition().x,this.player.getPosition().y=this.player.getPosition().y-15))
       }

       // destroy platform which are out of bounds
       this.destroyPlatforms();

    }

    // methods
    destroyPlatforms(){
        this.container.children.forEach(child => {
            if(child.y < -this.size.height*0.5 && child.name == "platform"){
                child.destroy();
                this.score.string = "Score : "+this.timer;
                this.timer = this.timer+1;
            }
        });
    }
    movePlatformsDown(offset){
        // cc.log("child counts : "+this.container.childrenCount);
        this.container.children.forEach(child => {
            if(child.name == "platform" || child.name == "player"){
                child.runAction(cc.moveTo(0.3,cc.v2(child.x,child.y-offset)));
            }
        });
    }
    
    addNewPlatforms(){
        var platform = cc.instantiate(this.platForm);
        platform.name = "platform";
        this.container.addChild(platform);
        platform.setPosition(cc.v2(this.player.getPosition().x,this.player.getPosition().y - 50));
        this.lastPlatformYPosition = platform.getPosition().y;
        this.pPlatformY =  platform.getPosition().y;
        platform.getComponent('Platform').gamePlay = this;
        platform.getComponent('Platform').player = this.player.getComponent("Player");
        let level_1 = 0;
        while(level_1 < 1000) {
            this.addNewPlatform();
            level_1 = level_1 + 1;
        }
    }

    addNewPlatform(){
        
        var platform = cc.instantiate(this.platForm);
        platform.name = "platform";
        this.container.addChild(platform);
        var randX =  GameUtils.randomIntFromInterval(-this.size.width/2+70,this.size.width/2-100);
        var randY =  this.lastPlatformYPosition + GameUtils.randomIntFromInterval(this.minPlatformDistance,this.maxPlatformDistance);
        platform.setPosition(cc.v2(randX,randY));
        this.lastPlatformYPosition = platform.getPosition().y;
        cc.log("Platform last y pos:"+platform.getPosition().y);
        // platform.getComponent('Platform').type = PlatformType.Static;
        platform.getComponent('Platform').gamePlay = this;
        platform.getComponent('Platform').player = this.player.getComponent("Player");
    }
}
