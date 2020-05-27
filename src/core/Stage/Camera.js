import Game from "../Game/Game.js"

export function camera(stage) {
    var camera = {
        x: 0,
        y: 0,
        scale: 1,
        follow: null,
        movement: null
    };
    // 创建镜头移动函数
    var createMovement = function (x, y, time, callback, disable = true) {
        // 计算数据
        var frames = time * 60 || 1;
        var perX = x / frames;
        var perY = y / frames;

        if (perX === 0 && perY === 0) {
            return;
        }

        // 取消相机跟随
        camera.follow = null;

        // 获取边界尺寸
        var sw = stage.width;
        var sh = stage.height;
        var gw = Game.width;
        var gh = Game.height;

        // 移动计数
        var count = 0;

        // 禁用单位
        if (disable === true) {
            Game.unit.travel(function (unit) {
                unit.disabled = true;
            })
        }

        // 修改镜头移动函数
        camera.movement = function () {
            // 相机移动
            camera.x += perX;
            camera.y += perY;

            // 移动计数增加
            count++;

            // 判断移动计数和相机位置
            if (count > frames ||
                (camera.x < 0 || camera.x > sw - gw) ||
                (camera.y < 0 || camera.y > sh - gh)) {
                camera.x = Math.max(0, camera.x)
                camera.x = Math.min(camera.x, sw - gw)
                camera.y = Math.max(0, camera.y)
                camera.y = Math.min(camera.y, sh - gh)

                // 清空相机移动函数
                camera.movement = null;

                // 启用单位
                if (disable === true) {
                    Game.unit.travel(function (unit) {
                        unit.disabled = false;
                    });
                }

                // 执行回调函数
                callback && callback();
                return;
            }
        }
    }

    // 计算镜头位置
    var cameraCal = function () {
        var follow = camera.follow;
        // 当相机跟随单位时
        if (follow) {
            var position = borderCal(follow);
            camera.x = position.x;
            camera.y = position.y;
        } else {
            // 执行相机移动函数
            camera.movement && camera.movement();
        }
    }

    // 计算边界问题
    function borderCal(unit) {
        var ux = unit.x;
        var uy = unit.y;
        var uw = unit.width;
        var uh = unit.height;
        var sw = stage.width;
        var sh = stage.height;
        var gw = Game.width;
        var gh = Game.height;
        var x, y;

        // 相机处于舞台宽度范围内才会跟随单位x变化，否则固定值
        if (ux < (gw - uw) / 2) {
            x = 0;
        } else if (ux > sw - (gw + uw) / 2) {
            x = sw - gw;
        } else {
            x = ux - (gw - uw) / 2;
        }

        // 相机处于舞台高度范围内才会跟随单位x变化，否则固定值
        if (uy < (gh - uh) / 2) {
            y = 0;
        } else if (uy > sh - (gh + uh) / 2) {
            y = sh - gh;
        } else {
            y = uy - (gh - uh) / 2;
        }

        return { x, y };
    }

    return {
        // 跟随
        follow(unit) {
            if (unit === camera.follow) { return }
            camera.follow = unit;
        },
        // 更新镜头数据
        update() {
            // 计算镜头数据
            cameraCal();
            // 返回镜头数据
            return camera;
        },
        // 移动
        move(x, y, time, callback) {
            createMovement(x, y, time, callback);
        },
        // 移动到
        moveTo(unit, time, callback) {
            // 边界计算
            var { x, y } = borderCal(unit);

            createMovement((x - camera.x), (y - camera.y), time, callback);
        },
        // 解除跟随
        unFollow() {
            camera.follow = null;
        }
    };
}