import { historyReplace } from "./routerMonitor";

export default class ActionMonitor {
    start() {
        this.init()
    }
    init() {
        historyReplace()    
    }
}