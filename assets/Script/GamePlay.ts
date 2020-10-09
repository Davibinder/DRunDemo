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

enum GSMacros {
     kMinPlatformStep =	30,
     kMaxPlatformStep =	80,
}

enum ComponentZOrders {
    Player      =   50,    
    Platform    =   45,
}
const {ccclass, property} = cc._decorator;

@ccclass
export default class GamePlay extends cc.Component {

    @property(cc.Node)
    player: cc.Node = null;

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
    isJumpCompleted:boolean = true;    

    minPlatformModifier:number = GSMacros.kMinPlatformStep;
    lastPlatformYPosition : number = 0;
    timer : number = 0;
    
    // LIFE-CYCLE CALLBACKS:
    onLoad () {        
        this.timer = 0;
        this.size = this.container.getContentSize();
        this.playerPreviousPos = this.player.getPosition();
        this.player.zIndex = ComponentZOrders.Player;
        this.player.name = "player";
        this.headerBar.zIndex = ComponentZOrders.Player - 1;
        this.player.getComponent("Player").gamePlay = this;
        // for (let index = 0; index < 20; index++) {
        //     this.addNewPlatform(true);            
        // }
        this.addNewPlatformIntials();
        // counter
        // this.schedule(function() {
        //     this.timer = this.timer+1;
        // }, 1);
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
       // moves platform down
       if(this.player.y > 0){
           this.movePlatformsDown(6); 
           if(this.container.childrenCount < 100)
                this.addNewPlatform_1();
       }
       // destroy platform which are out of bounds
       this.destroyPlatforms();

    }

    // methods
    destroyPlatforms(){
        this.container.children.forEach(child => {
            if(child.y < -this.size.height/2){
                child.destroy();
                this.timer = this.timer+1;
            }
        });

    }
    movePlatformsDown(offset){
        cc.log("child counts : "+this.container.childrenCount);
        this.container.children.forEach(child => {
            if(child.name == "platform"){
                child.y = child.y-offset; 
            }
            if(child.name == "player"){
                child.y = child.y-(offset*0.7); 
            }

        });
    }
    
    addNewPlatformIntials(){
        var platform = cc.instantiate(this.platForm);
        platform.name = "platform";
        this.container.addChild(platform);
        platform.setPosition(cc.v2(this.player.getPosition().x,this.player.getPosition().y - 50));
        this.lastPlatformYPosition = platform.getPosition().y;
        platform.getComponent('Platform').gamePlay = this;
        platform.getComponent('Platform').player = this.player.getComponent("Player");
        let tempA = 0;
        while(tempA < 15) {
            this.addNewPlatform_1();
            tempA = tempA+1;
        }
    }

    addNewPlatform_1(){
        var platform = cc.instantiate(this.platForm);
        platform.name = "platform";
        this.container.addChild(platform);
        var randX =  this.randomIntFromInterval(-this.size.width/2+70,this.size.width/2-100);
        var randY =  this.lastPlatformYPosition + this.randomIntFromInterval(this.minPlatformModifier,GSMacros.kMaxPlatformStep);
        platform.setPosition(cc.v2(randX,randY));
        this.lastPlatformYPosition = platform.getPosition().y;
        // 
        // cc.log("timer="+this.timer);
        // if(this.timer > 10 && this.randomIntFromInterval(1,10) <= 7){
        //     cc.log("Moving");
        //     platform.getComponent('Platform').type = PlatformType.Moving;
        // }
        platform.getComponent('Platform').gamePlay = this;
        platform.getComponent('Platform').player = this.player.getComponent("Player");
    }

    addNewPlatform(initials:boolean) {
        var platform = cc.instantiate(this.platForm);
        platform.name = "platform";
        this.container.addChild(platform);
        platform.setPosition(this.getNewPlatformPosition(initials));
        platform.getComponent('Platform').gamePlay = this;
        platform.getComponent('Platform').player = this.player.getComponent("Player");
    }

    getNewPlatformPosition (initials:boolean) {
        var randX =  this.randomIntFromInterval(-this.size.width/2+70,this.size.width/2-100);
        var randY =  this.randomIntFromInterval(-this.size.height/2+70,this.size.height/2-70);
        if (!initials)
            randY =  this.randomIntFromInterval(70,this.size.height*0.7);
        return cc.v2(randX, randY);
    }

    randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

}
