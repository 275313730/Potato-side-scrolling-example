export function event(stage) {
    let events = {}

    return {
        // 添加
        add(name, callback, ...args) {
            if (events[name]) { reutrn }
            events[name] = callback.bind(stage, ...args)
        },
        // 删除
        del(name) {
            if (!events[name]) { return }
            delete events[name]
        },
        // 执行
        execute() {
            for (const key in events) {
                events[key].call(stage)
            }
        }
    }
}