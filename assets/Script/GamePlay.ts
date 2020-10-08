// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

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

    @property(cc.Prefab)
    platForm: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:
    size: cc.Size = null;
    playerPreviousPos : cc.Vec2 = null;
    isDownWard : boolean = false;
    platformFound: boolean = true;
    isJumpCompleted:boolean = true;

    onLoad () {        
        this.size = this.container.getContentSize();
        this.playerPreviousPos = this.player.getPosition();
        this.player.zIndex = ComponentZOrders.Player;
        this.player.getComponent("Player").gamePlay = this;
        this.addNewPlatform();
    }

    start () {
        
    }

    update (dt) {
        if(this.player.getPosition().y < this.playerPreviousPos.y){
            cc.log("downward");
            this.isDownWard = true;
        }else{
            cc.log("upward");
            this.isDownWard = false;
        }        
       this.playerPreviousPos = this.player.getPosition();
       if(!this.platformFound && this.isJumpCompleted){
        this.player.setPosition(cc.v2(this.player.getPosition().x,this.player.getPosition().y=this.player.getPosition().y-15))
       }

    }

    // methods

    addNewPlatform() {
        var platform = cc.instantiate(this.platForm);
        this.container.addChild(platform);
        platform.setPosition(this.getNewPlatformPosition());
        platform.getComponent('Platform').gamePlay = this;
        platform.getComponent('Platform').player = this.player.getComponent("Player");
    }

    getNewPlatformPosition () {
        var randX =  Math.floor(Math.random() * this.size.width);
        var randY =  Math.floor(Math.random() * this.size.height);
        return cc.v2(0.0, 0.0);
    }

}
