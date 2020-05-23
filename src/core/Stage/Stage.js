"use strict"
import { Game } from "../Game/Game.js";
import { camera } from "./Camera.js";
import { event } from "./Event.js";
import { geometry } from "./Geometry.js";
import { execute } from "./Execute.js";

export class Stage {
    constructor(options) {
        Game.asset.allLoaded(() => {
            // 销毁场景
            Game.stage && Game.stage.execute.destory()

            // 初始化生命周期函数
            this.beforeCreate = options.beforeCreate
            this.created = options.created
            this.beforeUpdate = options.beforeUpdate
            this.updated = options.updated
            this.beforeDestroy = options.beforeDestroy
            this.destoryed = options.destoryed

            // 创建前函数
            this.beforeCreate && this.beforeCreate()

            // 清空按键
            Game.key = null

            // 改变当前场景
            Game.stage = this

            // 初始化场景数据
            const config = options.config
            this.width = (config && config.width) || Game.width
            this.height = (config && config.height) || Game.height

            // 初始化实例方法
            this.camera = camera(this)
            this.event = event(this)
            this.geometry = geometry()
            this.execute = execute(this)

            // 混入
            if (Stage.mixins) {
                Stage.mixins.forEach(mixin => {
                    mixin.call(this)
                });
            }

            // 创建后函数
            this.created && this.created.call(this)

            // 进入循环
            this.execute.loop()
        })
    }
}