// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
    /**
     * Play Button action callback
     * @param event 
     * @param data 
     */
    playButtonAction(event,data){
        cc.director.loadScene("GamePlay",(error: any, scene: cc.Scene)=>{
            if (error) {
                cc.log(error.message || error);
            }else{
                cc.log("Game Play Scene loaded successfully");
            }
        });
    }
    /**
     * Home button action callback
     * @param event 
     * @param data 
     */
    homeButtonAction(event,data){
        cc.director.loadScene("helloworld",(error: any, scene: cc.Scene)=>{
            if (error) {
                cc.log(error.message || error);
            }else{
                cc.log("Game Home Scene loaded successfully");
            }
        });
        
    }
}
