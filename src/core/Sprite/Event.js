export function event(sprite) {
    var events = {}

    return {
        // 添加
        add(name, func) {
            // 判断事件是否存在
            if (events[name]) { return }
            // 添加事件
            events[name] = func
        },
        // 删除
        del(name) {
            // 判断事件是否存在
            if (!events[name]) { return }
            // 删除事件
            delete events[name]
        },
        // 删除所有
        delAll() {
            events = {}
        },
        // 执行
        execute() {
            // disabled时禁用事件
            if (sprite.disabled) { return }
            for (var key in events) {
                events[key].call(sprite)
            }
        }
    }
}