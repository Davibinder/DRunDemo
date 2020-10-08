// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Platform from "./Platform";

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
    
    // LIFE-CYCLE CALLBACKS:
    onLoad () {        
        this.size = this.container.getContentSize();
        this.playerPreviousPos = this.player.getPosition();
        this.player.zIndex = ComponentZOrders.Player;
        this.headerBar.zIndex = ComponentZOrders.Player - 1;
        this.player.getComponent("Player").gamePlay = this;
        for (let index = 0; index < 20; index++) {
            this.addNewPlatform(true);            
        }
    }

    start () {
        
    }

    update (dt) {
        // check player up/down movement
        if(this.player.getPosition().y < this.playerPreviousPos.y){
            this.isDownWard = true;
        }else{
            this.isDownWard = false;
        }        
        this.playerPreviousPos = this.player.getPosition();
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
       if(this.player.y > 30){
           this.movePlatformsDown(2); 
       }
       // destroy platform which are out of bounds
       this.destroyPlatforms();

    }

    // methods
    destroyPlatforms(){
        this.container.children.forEach(child => {
            if(child.y < -this.size.height/2){
                child.destroy()
            }
        });

    }
    movePlatformsDown(offset){
        cc.log("child counts : "+this.container.childrenCount);
        this.container.children.forEach(child => {
            if(child.name == "platform"){
                child.y = child.y-offset; 
            }
        });
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
