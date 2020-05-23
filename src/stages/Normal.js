// modules
import { Sprite } from "../core/Potato.js";

// sprites
import { bgImg } from "../sprites/BgImg.js";
import { player } from "../sprites/Player.js";
import { block } from "../sprites/Block.js";
import { exp } from "../sprites/Exp.js";
import { touch } from "../sprites/Touch.js";

// events
import { collie } from "../events/Collie.js";
import { gravity } from "../events/Gravity.js";
import { pig } from "../sprites/Pig.js";
import { hit } from "../events/Hit.js";
import { deadCheck } from "../events/DeadCheck.js";

export function normal() {
    return {
        created() {
            // 创建背景图片
            const newBG = new Sprite(bgImg('test'))
            this.width = newBG.width
            this.height = newBG.height

            // 阻挡物
            let blocks = []

            // 创建墙壁和地板
            const blocksData = [
                [8, 0, 3, 5, 1],
                [9, 5, 3, 1, 1],
                [6, 5, 4, 1, 7],
                [8, 6, 11, 5, 1],
                [9, 11, 11, 1, 1],
                [6, 11, 11, 1, 4],
                [3, 11, 15, 1, 1],
                [2, 0, 15, 11, 1],
                [8, 0, 19, 20, 1]
            ]
            blocksData.forEach(data => {
                blocks.push(new Sprite(block('block', data)))
            })

            // 创建跳台
            const flatsData = [
                [7, 4, 3],
                [11, 5, 1],
                [9, 7, 3],
                [7, 9, 3],
                [13, 12, 1],
                [13, 14, 1],
                [13, 16, 3],
                [17, 17, 1]
            ]
            flatsData.forEach(data => {
                blocks.push(new Sprite(block('flat', data)))
            })

            // 创建玩家
            const newPlayer = new Sprite(player())
            this.camera.follow(newPlayer)

            //  创建经验条
            new Sprite(exp())

            // 创建猪
            const pigsData = [
                [1, 150, 78, 'left'],
                [2, 200, 334, 'right'],
                [3, 280, 590, 'right']
            ]
            pigsData.forEach(data => {
                new Sprite(pig(...data))
            })

            new Sprite(touch())

            // 添加场景事件
            this.event.add(collie, newPlayer, blocks)
            this.event.add(gravity, newPlayer, blocks)
            this.event.add(hit(newPlayer))
            this.event.add(deadCheck)
        }
    }
}