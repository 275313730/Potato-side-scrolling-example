import Game from "../Game/Game.js"

export function userEvent(sprite) {
    var userEvents = Game.userEvents

    return {
        // 监听
        watch(eventType, callback) {
            if (!userEvents[sprite.id]) {
                userEvents[sprite.id] = {}
            }
            // 添加事件到userEvents中
            userEvents[sprite.id][eventType] = callback.bind(sprite)
        },
        // 解除监听
        unwatch(eventType) {
            // 判断用户事件是否存在
            if (!eventType || !userEvents[sprite.id] || !userEvents[sprite.id][eventType]) { return }

            // 解除监听
            delete Game.userEvents[sprite.id][eventType]
        },
    };
}