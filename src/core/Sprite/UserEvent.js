import { Game } from "../Game/Game.js"

export function userEvent(unit) {
    const userEvents = Game.userEvents

    return {
        // 监听
        watch(eventType, callback) {
            if (!userEvents[unit.id]) {
                userEvents[unit.id] = {}
            }
            // 添加事件到userEvents中
            userEvents[unit.id][eventType] = callback.bind(unit)
        },
        // 解除监听
        unwatch(eventType) {
            // 判断用户事件是否存在
            if (!eventType || !userEvents[unit.id] || !userEvents[unit.id][eventType]) { return }

            // 解除监听
            delete Game.userEvents[unit.id][eventType]
        },
    };
}