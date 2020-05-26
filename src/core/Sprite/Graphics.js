import Game from "../Game/Game.js"

export function graphics(sprite) {
    var context = Game.canvas.getContext('2d')
    var floor = Math.floor

    // 初始化执行函数
    var executor = null

    // 设置尺寸
    var setSize = function (width, height, sameSize) {
        // 设置精灵
        sprite.drawWidth = width
        sprite.drawHeight = height

        if (sameSize) {
            sprite.width = width
            sprite.height = height
        }
    }

    // 获取绘制数据
    var getData = function () {
        return {
            relX: sprite.relX,
            relY: sprite.relY,
            offsetLeft: sprite.offsetLeft,
            offsetTop: sprite.offsetTop,
            width: sprite.width,
            drawWidth: sprite.drawWidth,
            drawHeight: sprite.drawHeight,
            scale: sprite.scale,
            direction: sprite.direction
        }
    }

    // 绘制图片
    var drawImage = function (image) {
        var { relX, relY, offsetLeft, offsetTop, width, drawWidth, drawHeight, scale, direction } = getData()

        // 图片方向
        if (direction === 'right') {
            var tranlateX = floor(relX + offsetLeft)
            var tranlateY = floor(relY + offsetTop)
            context.drawImage(image, 0, 0, drawWidth, drawHeight, tranlateX, tranlateY, drawWidth * scale, drawHeight * scale)
        } else {
            var tranlateX = floor(Game.width - width - relX + offsetLeft)
            var tranlateY = floor(relY + offsetTop)

            // 水平翻转绘制
            drawFlip(Game.width, function () {
                context.drawImage(image, 0, 0, drawWidth, drawHeight, tranlateX, tranlateY, drawWidth * scale, drawHeight * scale)
            })
        }
    }

    // 绘制动画
    var drawAnimation = function (image, flip, currFrame) {
        var { relX, relY, offsetLeft, offsetTop, width, drawWidth, drawHeight, scale, direction } = getData()

        // 图片方向
        if (!flip && direction === 'right' || flip && direction === 'left') {
            var tranlateX = floor(relX + offsetLeft)
            var tranlateY = floor(relY + offsetTop)
            context.drawImage(image, currFrame * drawWidth, 0, drawWidth, drawHeight, tranlateX, tranlateY, drawWidth * scale, drawHeight * scale)
        } else {
            var tranlateX = floor(Game.width - width * scale - relX + offsetLeft)
            var tranlateY = floor(relY + offsetTop)

            // 水平翻转绘制
            drawFlip(Game.width, function () {
                context.drawImage(image, currFrame * drawWidth, 0, drawWidth, drawHeight, tranlateX, tranlateY, drawWidth * scale, drawHeight * scale)
            })
        }
    }

    // 翻转绘制
    function drawFlip(width, callback) {
        context.translate(width, 0);
        context.scale(-1, 1);
        callback()
        context.translate(width, 0);
        context.scale(-1, 1);
    }

    // 测试
    function test() {
        context.strokeStyle = 'red'
        context.strokeRect(sprite.relX, sprite.relY, sprite.width, sprite.height)
    }

    // 初始化方法
    return {
        // 动画
        animation(group, name, sameSize = false) {
            // 获取动画数据
            var animation = Game.asset.get(group, name)

            setSize(animation.width, animation.image.height, sameSize)


            // 内部属性
            var currInterval = 0,
                currFrame = 0

            // 动画属性
            var options = {
                // 动画帧数
                animationFrames: (animation.image.width / animation.width) - 1,
                // 动画间隔帧
                animationInterval: animation.interval || Game.animationInterval,
                // 动画帧宽度
                width: animation.width,
                // 动画帧高度
                height: animation.image.height,
                // 是否翻转
                flip: animation.flip,
                // 完成时
                onComplete: null
            }

            // 绘制函数
            executor = function () {
                // 绘制动画
                drawAnimation(animation.image, options.flip, currFrame)

                // 动画间隔帧增加
                currInterval++

                // 判断计数是否小于间隔帧数
                if (currInterval >= options.animationInterval) {
                    // 动画当前间隔帧归零
                    currInterval = 0

                    // 动画关键帧增加
                    currFrame++

                    // 判断是否播放完成
                    if (currFrame >= options.animationFrames) {
                        // 动画重置
                        currFrame = 0

                        // 动画完成时执行函数
                        options.onComplete && options.onComplete.call(this)
                    }
                }
            }

            // 返回数据
            return options
        },
        // 清除
        clear() {
            executor = null
        },
        // 绘制
        draw(callback) {
            executor = function () {
                callback.call(sprite, context)
            }
        },
        // 图片
        image(group, name, sameSize = false) {
            // 获取图片数据
            var image = Game.asset.get(group, name)

            setSize(image.width, image.height, sameSize)

            // 绘制函数
            executor = function () {
                drawImage(image)
            }
        },
        // 混合(混合和绘制的区别在于混合可以清除画布再继续绘制而不会影响原画布)
        mix(type, callback) {
            var mixCanvas = Game.canvas.cloneNode()
            var ctx = mixCanvas.getContext('2d')
            var mixImage = new Image();
            if (type === 'static') {
                ctx.clearRect(0, 0, Game.width, Game.height)
                callback(ctx)
                mixImage.src = mixCanvas.toDataURL("image/png");
                executor = function () {
                    context.drawImage(mixImage, 0, 0)
                }
            } else if (type === 'dynamic') {
                executor = function () {
                    ctx.clearRect(0, 0, Game.width, Game.height)
                    callback(ctx)
                    mixImage.src = mixCanvas.toDataURL("image/png");
                    context.drawImage(mixImage, 0, 0)
                }
            }
        },
        // 粒子
        particle(group, name, interval, alphaRange, scaleRange) {
            var image = Game.asset.get(group, name)

            // 设置精灵尺寸(粒子精灵没有宽度和高度)
            sprite.width = 0
            sprite.height = 0
            sprite.drawWidth = image.width
            sprite.drawHeight = image.height
            
            // 设置粒子属性
            var nextAlpha, nextscale

            // 检查粒子是否有透明度变化
            if (alphaRange) {
                nextAlpha = (alphaRange[1] - alphaRange[0]) / interval
            }

            // 检查粒子是否有尺寸变化
            if (scaleRange) {
                nextscale = (scaleRange[1] - scaleRange[0]) / interval
                sprite.scale = scaleRange[1]
            }

            executor = function () {
                // 透明度变化
                if (nextAlpha != null) {
                    if (sprite.alpha + nextAlpha <= alphaRange[0] || sprite.alpha + nextAlpha >= alphaRange[1]) {
                        nextAlpha = -nextAlpha
                    }
                    sprite.alpha += nextAlpha
                }

                // 尺寸变化
                if (nextscale != null) {
                    if (sprite.scale + nextscale <= scaleRange[0] || sprite.scale + nextscale >= scaleRange[1]) {
                        nextscale = - nextscale
                    }
                    sprite.scale += nextscale
                }

                drawImage(image)
            }
        },
        // 渲染
        render() {
            var gw = Game.width
            var gh = Game.height
            var ux = sprite.relX
            var uy = sprite.relY
            var uw = sprite.width
            var uh = sprite.height
            var scale = sprite.scale
            if (ux + uw * scale < 0 || ux > gw || uy + uh * scale < 0 || uy > gh) {
                return
            }
            context.globalAlpha = sprite.alpha
            executor && executor()
            Game.test && test()
        },
    }
}