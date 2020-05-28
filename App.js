// core
import { Game, Stage, Sprite } from "./src/core/Potato.js";

// Title
import { title } from "./src/stages/Title.js";

// mixin
import { pox } from "./src/mixins/Pox.js";
import { potate } from "./src/mixins/Potate.js";


(function () {
    // 初始化Game类
    Game.init({
        el: 'app',
        // 设置宽高
        width: 320,
        height: 240,
        // 设置文件路径
        path: {
            image: './imgs/',
            audio: './audio/'
        },
        mode: 0
    })

    // 载入标题图片
    Game.asset.load({
        type: 'image',
        group: 'title',
        name: 'title',
        url: 'kings-and-pigs.png'
    })

    // 角色图片数据
    const roles = [
        {
            group: 'player',
            interval: 8,
            path: 'kingHuman/',
            animations: [
                {
                    url: 'Idle.png',
                    name: 'idle',
                    frame: 11
                },
                {
                    url: 'Walk.png',
                    name: 'walk',
                    frame: 8
                },
                {
                    url: 'Attack.png',
                    name: 'attack',
                    frame: 3
                },
                {
                    url: 'Hit.png',
                    name: 'hit',
                    frame: 2
                }
            ],
            images: [
                {
                    url: 'Jump.png',
                    name: 'jump'
                },
                {
                    url: 'Fall.png',
                    name: 'fall'
                },
                {
                    url: 'Ground.png',
                    name: 'ground'
                },
            ]
        },
        {
            group: 'pig',
            interval: 8,
            flip: true,
            path: 'pig/',
            animations: [
                {
                    url: 'Idle.png',
                    name: 'idle',
                    frame: 11
                },
                {
                    url: 'Walk.png',
                    name: 'walk',
                    frame: 6
                },
                {
                    url: 'Attack.png',
                    name: 'attack',
                    frame: 5
                },
                {
                    url: 'Hit.png',
                    name: 'hit',
                    frame: 2
                },
                {
                    url: 'Dead.png',
                    name: 'dead',
                    frame: 4
                }
            ],
            images: [
                {
                    url: 'Jump.png',
                    name: 'jump'
                },
                {
                    url: 'Fall.png',
                    name: 'fall'
                },
                {
                    url: 'Ground.png',
                    name: 'ground'
                },
            ]
        },
    ]

    // 载入角色图片
    roles.forEach(role => {
        role.animations.forEach(animation => {
            Game.asset.load({
                type: 'animation',
                group: role.group,
                name: animation.name,
                url: role.path + animation.url,
                frame: animation.frame,
                interval: role.interval,
                flip: role.flip
            })
        })
        role.images.forEach(image => {
            Game.asset.load({
                type: 'image',
                group: role.group,
                name: image.name,
                url: role.path + image.url,
            })
        })
    })

    // 载入场景图片
    Game.asset.load({
        type: 'image',
        group: 'bg',
        name: 'test',
        url: 'background/test.png'
    })

    // 调试模式
    Game.test = false

    // 全局player属性
    const player = {
        hp: 3,
        attack: 1,
        exp: 0,
        level: 1,
    }

    Game.mix(Sprite, pox({ deaths: 0, player }))
    Game.mix(Sprite, potate)

    // 创建场景
    new Stage(title())
})()