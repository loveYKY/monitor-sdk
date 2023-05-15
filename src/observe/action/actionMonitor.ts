import { domReplace } from "./click";
import { historyReplace } from "./router";

export default class ActionMonitor {
    start() {
        this.init()
    }
    init() {
        historyReplace()
        domReplace()
    }
}

