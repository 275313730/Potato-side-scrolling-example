"use strict"
import Game from "../Game/Game.js";
import { graphics } from "./Graphics.js";
import { audio } from "./Audio.js";
import { event } from "./Event.js";
import { userEvent } from "./UserEvent.js";

function Sprite(options) {
    // 初始化生命周期函数
    this.beforeCreate = options.beforeCreate
    this.created = options.created
    this.beforeUpdate = options.beforeUpdate
    this.updated = options.updated
    this.beforeDestroy = options.beforeDestroy
    this.destroyed = options.destroyed

    this.beforeCreate && this.beforeCreate()

    // 设置参数
    var config = options.config

    // 没有id时
    if (!config.id) {
        throw Error(`Sprite need an id.`)
    }

    // id 为单位主键
    this.id = config.id

    // x 为单位横坐标
    this.x = config.x || 0

    // y 为单位纵坐标
    this.y = config.y || 0

    // width 为单位宽度
    this.width = config.width || 0

    // height 为单位高度
    this.height = config.height || 0

    // offsetLeft 为单位横向偏移量
    this.offsetLeft = config.offsetLeft || 0

    // offsetTop 为单位纵向偏移量
    this.offsetTop = config.offsetTop || 0

    // global 决定是否为全局单位
    this.global = config.global || false

    // alpha 决定绘制透明度
    this.alpha = config.alpha == null ? 1 : config.alpha

    // scale 决定实际绘制尺寸
    this.scale = config.scale == null ? 1 : config.scale

    // direction 决定图片的方向
    this.direction = config.direction || 'right'

    // layer 决定图片上下关系，layer越大，单位越晚渲染
    this.layer = config.layer || 0

    // diasabled 为true时无法执行单位事件和用户事件
    this.disabled = config.disabled || false

    // fixed 为单位固定参数
    // 为0时随镜头移动
    // 为1时固定在页面上，不会随镜头移动
    // 在0~1之间会出现分层移动效果
    this.fixed = config.fixed || 0

    // 检查id是否填写
    if (this.id == null) {
        throw new Error('Sprite needs an id.')
    }
    // 检查id是否为纯数字
    if (this.id instanceof Number || !isNaN(Number(this.id))) {
        throw new Error('Sprite must start with a letter.')
    }

    // 暴露实例数据到this中
    for (var key in options.data) {
        this[key] = options.data[key]
    }

    // 暴露实例事件到this中
    for (var key in options.methods) {
        this[key] = options.methods[key]
    }

    // 初始化实例方法
    this.graphics = graphics(this)
    this.audio = audio(this)
    this.event = event(this)
    this.userEvent = userEvent(this)

    // 混入
    if (Sprite.mixins) {
        var sprite = this
        Sprite.mixins.forEach(function (mixin) {
            mixin.call(sprite)
        });
    }

    // 添加到游戏单位中
    Game.unit.add(this)

    // 单位创建后
    options.created && options.created.call(this)
}

export default Sprite