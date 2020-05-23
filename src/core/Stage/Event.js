export function event(stage) {
    let events = {}

    return {
        // 添加
        add(fn, ...args) {
            if (events[fn.name]) { reutrn }
            events[fn.name] = fn.bind(stage, ...args)
        },
        // 删除
        del(name) {
            if (!events[name]) { return }
            delete events[name]
        },
        // 单次
        once(fn, ...args) {
            if (events[fn.name]) { return }
            events[fn.name] = () => {
                fn.call(stage, ...args)
                delete events[fn.name]
            }
        },
        // 执行
        execute() {
            for (const key in events) {
                events[key].call(stage)
            }
        }
    }
}