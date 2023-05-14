import _support from "../../utils/global"
import { ACTION_TYPES, EVENT_TYPES, STATUS_CODE } from "./types"

export function domReplace() {
    document.addEventListener('click', ({ target }) => {
        //todo： 解决ts报错
        const targetInstance = target as any
        const tagName = targetInstance?.tagName?.toLowerCase() ?? ''
        if (tagName === 'body') {
            return
        }
        let classNames = targetInstance?.classList.value
        classNames = classNames !== "" ? `class="${classNames}"` : ""
        const id = targetInstance?.id ? ` id="${targetInstance?.id}"` : ""
        const innerText = targetInstance?.innerText
        const dom: string = `<${tagName}${id}${
            classNames !== "" ? classNames : ""
            }>${innerText}</${tagName}>`;
        
        _support.actionStore.push({
            type: EVENT_TYPES.CLICK,
            time: Date.now(),
            data: {
                dom: dom,
            },
            category:ACTION_TYPES.CLICK,
            status: STATUS_CODE.OK
        })
    })
}