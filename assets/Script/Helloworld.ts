const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'MX Player Demo';

    start () {
        // init logic
        this.label.string = this.text;
    }

    startButtonAction(event, data){
        cc.director.loadScene("GamePlay",(error: any, scene: cc.Scene)=>{
            if (error) {
                cc.log(error.message || error);
            }else{
                cc.log("Game Scene loaded successfully");
            }
        });
    }
}
