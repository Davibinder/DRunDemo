
export class GameUtils {
    private static instance           :   GameUtils;

    public static getInstance(): GameUtils {
        if (!this.instance) {
            this.instance = new GameUtils();
        }
        return this.instance;
    }

    public static randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
}