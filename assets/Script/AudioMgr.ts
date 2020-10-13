
export class AudioMgr {
    private static _g_instance: AudioMgr = null;
    private _buttonSoundUrl:string = '';
    public static getInstance(): AudioMgr {
        if (!AudioMgr._g_instance) {
            AudioMgr._g_instance = new AudioMgr();
            cc.audioEngine.setMaxAudioInstance(5);
        }
        return AudioMgr._g_instance;
    }

    /**
     * 
     * @param url 
     * @param isLoop 
     * @param volume 
     */
    public play(url: string, isLoop: boolean = false, volume: number = 0.5, bInogre:boolean = false): void {        

        let playFunc: (clip: cc.AudioClip) => void = (clip: cc.AudioClip): void => {
            let audioID: number = 0;          

            audioID = cc.audioEngine.play(clip, isLoop, volume);
        }

        let clip: cc.AudioClip = cc.loader.getRes(url);
        if (!clip) {
            cc.loader.loadRes(url, cc.AudioClip, (error: Error, resource: any): void => {
                if (error) {
                    console.error(error);
                    return null;
                }
                playFunc(resource);
            });
        }
        else {
            playFunc(clip);
        }
    }

    /**
     * 
     * @param url 
     * @param isLoop 
     */
    public playEffect(url: string, isLoop: boolean = false,volume: number = 0.5): void {
        

        let playFunc = (clip: cc.AudioClip): void => {
            let audioID: number = 0;            
            cc.audioEngine.setEffectsVolume(volume);
            audioID = cc.audioEngine.playEffect(clip, isLoop);
            console.log("kankan yxiao " + clip.name);
            
        }

        let clip: cc.AudioClip = cc.loader.getRes(url);
        if (!clip) {
            cc.loader.loadRes(url, cc.AudioClip, (error: Error, resource: any): void => {
                if (error) {
                    console.error(error);
                    return null;
                }
                playFunc(resource);
            });
        }
        else {
            playFunc(clip);
        }
    }

    /**
     * 
     * @param voiceName 
     * @param isLoop 
     * @param volume 
     */
    public playButtonSound(voiceName:string,isLoop: boolean = false,volume: number = 0.5){
        console.log('playButtonSound:::'+this._buttonSoundUrl + voiceName);
        this.playEffect(this._buttonSoundUrl + voiceName,isLoop,volume);
    }
    /**
     * 
     * @param url 
     */
    public getDuration(audioID: number): number {

        let time = cc.audioEngine.getDuration(audioID);
        return time;
    }

    /**
     * 
     * @param url
     */
    public getAudioID(url: string): number {
        let audioID: number = -1;
        let name = url.substr(url.lastIndexOf("/") + 1);
        return audioID;
    }

    /**
     * 
     * @param audioID 
     */
    public stop(audioID: number): void {
        cc.audioEngine.stop(audioID);
    }

    /**
     * 
     */
    public stopAll(): void {
        cc.audioEngine.stopAll();
    }

    /**
     * 
     * @param audioID 
     */
    public stopEffect(audioID: number): void {
        cc.audioEngine.stopEffect(audioID);
    }

    /**
     * 
     */
    public stopAllEffects(): void {
        cc.audioEngine.stopAllEffects();
    }

    /**
     * 
     * @param filePath 
     */
    public preload(filePath:string): void {
        cc.audioEngine.preload(filePath);
    }

    /**
     * 
     * @param clip 
     */
    public uncache(clip: cc.AudioClip): void {
        cc.audioEngine.uncache(clip);
    }

    /**
     * 
     */
    public uncacheAll(): void {
        cc.audioEngine.uncacheAll();
    }

    /**
     * 
     * @param audioID 
     */
    public pause(audioID: number): void {
        cc.audioEngine.pause(audioID);
    }

    /**
     * 
     */
    public pauseAll(): void {
        cc.audioEngine.pauseAll();
    }

    /**
     * 
     * @param audioID 
     */
    public resume(audioID: number): void {
        cc.audioEngine.resume(audioID);
    }

    /**
     * 
     */
    public resumeAll(): void {
        cc.audioEngine.resumeAll();
    }
}
