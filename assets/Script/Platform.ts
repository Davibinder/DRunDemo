// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

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

    // LIFE-CYCLE CALLBACKS:

    onLoad () {}

    start () {

    }

    update (dt) {}
}
