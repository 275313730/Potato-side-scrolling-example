"use strict"
import Game from "../Game/Game.js";
import { camera } from "./Camera.js";
import { event } from "./Event.js";
import { geometry } from "./Geometry.js";
import { execute } from "./Execute.js";

function Stage(options) {
    var stage = this
    Game.asset.allLoaded(function () {
        // 销毁场景
        Game.stage && Game.stage.execute.destory()

        // 初始化生命周期函数
        stage.beforeCreate = options.beforeCreate
        stage.created = options.created
        stage.beforeUpdate = options.beforeUpdate
        stage.updated = options.updated
        stage.beforeDestroy = options.beforeDestroy
        stage.destoryed = options.destoryed

        // 创建前函数
        stage.beforeCreate && stage.beforeCreate()

        // 清空按键
        Game.key = null

        // 改变当前场景
        Game.stage = stage

        // 初始化场景数据
        var config = options.config
        stage.width = (config && config.width) || Game.width
        stage.height = (config && config.height) || Game.height

        // 初始化实例方法
        stage.camera = camera(stage)
        stage.event = event(stage)
        stage.geometry = geometry()
        stage.execute = execute(stage)

        // 混入
        if (Stage.mixins) {
            Stage.mixins.forEach(function (mixin) {
                mixin.call(stage)
            });
        }

        // 创建后函数
        stage.created && stage.created.call(stage)

        // 进入循环
        stage.execute.loop()
    })
}

export default Stage