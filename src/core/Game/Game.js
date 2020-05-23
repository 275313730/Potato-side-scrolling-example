"use strict"
import { asset } from "./Asset.js";
import { unit } from "./Unit.js";
import { mix } from "./Mix.js";

export class Game {
    // 初始化Game类
    static init(options) {
        Object.defineProperties(this, {
            // canvas
            canvas: {
                value: document.getElementById(options.el)
            },
            // canvas上下文
            context: {
                value: document.getElementById(options.el).getContext('2d')
            },
            // 宽度
            width: {
                value: options.width
            },
            // 高度
            height: {
                value: options.height
            },
            // 键盘状态
            key: {
                value: null,
                writable: true
            },
            userEvents: {
                value: {}
            },
            // 动画间隔帧(每隔n帧绘制下一个关键帧)
            animationInterval: {
                value: options.animationInterval || 16,
                writable: true
            },
            // 测试(显示精灵外框)
            test: {
                value: false,
                writable: true
            },
            isMobile: {
                value: check()
            },
            // 图片路径
            imagePath: {
                value: options.path ? options.path.image : '',
                writable: true
                // 音频路径
            },
            audioPath: {
                value: options.path ? options.path.audio : '',
                writable: true
            }
        })

        // 初始化实例方法
        this.asset = asset(this.imagePath, this.audioPath)
        this.unit = unit(Game)
        this.mix = mix

        // 设置canvas宽高
        this.canvas.setAttribute('width', this.width + 'px')
        this.canvas.setAttribute('height', this.height + 'px')

        // 执行用户事件
        function executeUserEvents(eventType, data) {
            const units = Game.userEvents
            for (const key in units) {
                const unit = units[key]
                if (unit[eventType]) {
                    unit[eventType](data)
                }
            }
        }

        // 键盘事件
        window.addEventListener('keydown', e => {
            e.stopPropagation()
            e.preventDefault()
            if (Game.key !== e.key) {
                Game.key = e.key
                executeUserEvents('keydown', e.key)
            }
        })
        window.addEventListener('keyup', e => {
            e.stopPropagation()
            e.preventDefault()
            if (Game.key === e.key) {
                Game.key = null
            }
            executeUserEvents('keyup', e.key)
        })

        // 鼠标事件
        window.addEventListener('mousedown', e => {
            e.stopPropagation()
            e.preventDefault()
            if (!Game.isMobile) {
                executeUserEvents('mousedown', calMouse(e))
            }
        })
        window.addEventListener('mouseup', e => {
            e.stopPropagation()
            e.preventDefault()
            if (!Game.isMobile) {
                executeUserEvents('mousedown', calMouse(e))
            }
        })

        // 触屏事件
        window.addEventListener('touchstart', e => {
            executeUserEvents('touchstart', calTouch(e))
        })
        window.addEventListener('touchmove', e => {
            executeUserEvents('touchmove', calTouch(e))
        })
        window.addEventListener('touchend', e => {
            executeUserEvents('touchend', calTouch(e))
        })

        // 禁用右键菜单
        window.oncontextmenu = function () {
            return false;
        }
    }
}

// 检查是否为移动端
function check() {
    var browser = {
        versions: function () {
            var u = navigator.userAgent;
            return {//移动终端浏览器版本信息   
                trident: u.indexOf('Trident') > -1, //IE内核  
                presto: u.indexOf('Presto') > -1, //opera内核  
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核  
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核  
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端  
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端  
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器  
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器  
                iPad: u.indexOf('iPad') > -1, //是否iPad    
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部  
                weixin: u.indexOf('MicroMessenger') > -1, //是否微信   
                qq: u.match(/\sQQ/i) == " qq" //是否QQ  
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }

    if (browser.versions.mobile || browser.versions.ios || browser.versions.android ||
        browser.versions.iPhone || browser.versions.iPad) {
        return true
    } else {
        return false
    }
}

// 计算鼠标数据
function calMouse(e) {
    const canvas = Game.canvas

    // 计算画面缩放比例
    const scale = canvas.clientHeight / Game.height

    // 简化事件属性
    return {
        x: (e.clientX - canvas.offsetLeft) / scale,
        y: (e.clientY - canvas.offsetTop) / scale,
        button: e.button
    }
}

// 计算触控数据
function calTouch(e) {
    const canvas = Game.canvas
    const scale = canvas.clientHeight / Game.height
    let touches = []
    for (let i = 0; i < e.targetTouches.length; i++) {
        const touch = e.targetTouches[i];
        touches.push({
            x: (touch.clientX - canvas.offsetLeft) / scale,
            y: (touch.clientY - canvas.offsetTop) / scale,
            id: touch.identifier,
            type: e.type
        })
    }
    return touches
}

