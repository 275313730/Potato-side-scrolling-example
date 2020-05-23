export function unit(Game) {
    let units = {}
    // 图层数组
    let layers = []
    // 排序
    function sort() {
        let newUnits = {}
        // 根据图层值排序
        layers.forEach(layer => {
            for (const key in units) {
                const unit = units[key]
                if (unit.layer === layer) {
                    newUnits[unit.id] = unit
                    delete units[key]
                }
            }
        })
        units = newUnits
    }

    return {
        // 添加
        add(newUnit) {
            // 检测id是否存在
            if (units[newUnit.id]) {
                throw new Error(`Sprite '${newUnit.id}' exists.`)
            }

            // Game和Stage的宽高(只读)
            Object.defineProperties(newUnit, {
                'game': {
                    value: {
                        width: Game.width,
                        height: Game.height
                    }
                },
                'stage': {
                    value: {
                        width: Game.stage.width,
                        height: Game.stage.height
                    }
                }
            })

            // 加入单位组
            units[newUnit.id] = newUnit

            // 如果图层值不在layers中则新增图层值并排序layers
            if (layers.indexOf(newUnit.layer) === -1) {
                layers.push(newUnit.layer)

                // 图层值排序
                layers.sort()
            }

            // 单位排序
            sort()

            return newUnit
        },
        // 删除
        del(id) {
            const unit = units[id]
            if (!unit) {
                throw new Error(`Unit ${id} doesn't exist`)
            }

            // 单位销毁前
            unit.beforeDestroy && unit.beforeDestroy()

            // 解绑单位用户事件
            delete Game.userEvents[id]

            // 解绑单位音频
            unit.audio.delAll()

            // 删除单位
            delete units[id]

            // 单位销毁后
            unit.destroyed && unit.destroyed()
        },
        // 删除所有
        delAll(includeGlobal) {
            if (includeGlobal) {
                for (const key in units) {
                    this.del(key)
                }
            } else {
                let unGlobal = this.filter(unit => {
                    return !unit.global
                })
                for (const key in unGlobal) {
                    this.del(key)
                }
            }
        },
        // 查找
        find(id) {
            return units[id]
        },
        // 过滤
        filter(callback) {
            let newUnits = {}

            for (const key in units) {
                const unit = units[key]
                if (callback(unit) === true) {
                    newUnits[key] = unit
                }
            }

            return newUnits
        },
        // 遍历
        travel(callback) {
            for (const key in units) {
                // 回调函数返回false时停止遍历
                if (callback(units[key]) === false) {
                    break
                }
            }
        },
    }
}