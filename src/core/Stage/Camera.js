import { Game } from "../Game/Game.js"

export function camera(stage) {
    let camera = {
        x: 0,
        y: 0,
        scale: 1,
        follow: null,
        movement: null
    }
    // 创建镜头移动函数
    let createMovement = (x, y, time, callback, disable = true) => {
        // 计算数据
        let frames = time * Game.frames || 1
        let perX = x / frames
        let perY = y / frames

        if (perX === 0 && perY === 0) {
            return
        }

        // 取消相机跟随
        camera.follow = null

        // 定义常量
        const STAGE_WIDTH = stage.width
        const GAME_WIDTH = Game.width

        // 调整相机位置
        if (camera.x < 0) {
            camera.x = 0
        }
        if (camera.x > STAGE_WIDTH - GAME_WIDTH) {
            camera.x = STAGE_WIDTH - GAME_WIDTH
        }

        // 移动计数
        let count = 0

        // 禁用单位
        if (disable === true) {
            Game.unit.travel(unit => {
                unit.disabled = true
            })
        }

        // 修改镜头移动函数
        camera.movement = () => {
            // 相机移动
            camera.x += perX
            camera.y += perY

            // 移动计数增加
            count++

            // 判断移动计数和相机位置
            if (count > frames || (camera.x <= 0 || camera.x >= STAGE_WIDTH - GAME_WIDTH)) {
                // 清空相机移动函数
                camera.movement = null

                // 启用精灵
                if (disable === true) {
                    Game.unit.travel(unit => {
                        unit.disabled = false
                    })
                }

                // 执行回调函数
                callback && callback()
                return
            }
        }
    }

    // 计算镜头位置
    let cameraCal = () => {
        const follow = camera.follow
        // 当相机跟随精灵时
        if (follow) {
            const position = borderCal(follow)
            camera.x = position.x
            camera.y = position.y
        } else {
            // 执行相机移动函数
            camera.movement && camera.movement()
        }
    }

    // 计算边界问题
    function borderCal(unit) {
        const ux = unit.x
        const uy = unit.y
        const uw = unit.width
        const uh = unit.height
        const sw = stage.width
        const sh = stage.height
        const gw = Game.width
        const gh = Game.height
        let x, y

        // 相机处于舞台宽度范围内才会跟随精灵x变化，否则固定值
        if (ux < (gw - uw) / 2) {
            x = 0
        } else if (ux > sw - (gw + uw) / 2) {
            x = sw - gw
        } else {
            x = ux - (gw - uw) / 2
        }

        // 相机处于舞台高度范围内才会跟随精灵x变化，否则固定值
        if (uy < (gh - uh) / 2) {
            y = 0
        } else if (uy > sh - (gh + uh) / 2) {
            y = sh - gh
        } else {
            y = uy - (gh - uh) / 2
        }

        return { x, y }
    }

    return {
        // 跟随
        follow(unit) {
            if (unit === camera.follow) { return }
            camera.follow = unit
        },
        // 获取镜头数据
        get() {
            // 计算镜头数据
            cameraCal()
            // 返回镜头数据(只读)
            return Object.assign({}, camera)
        },
        // 移动
        move(x, y, time, callback) {
            createMovement(x, y, time, callback)
        },
        // 移动到
        moveTo(unit, time, callback) {
            // 边界计算
            const { x, y } = borderCal(unit)

            createMovement((x - camera.x), (y - camera.y), time, callback)
        },
        // 解除跟随
        unFollow() {
            camera.follow = null
        },
    }
}