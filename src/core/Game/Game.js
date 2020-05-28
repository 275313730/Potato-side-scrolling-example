"use strict"
import { asset } from "./Asset.js";
import { unit } from "./Unit.js";

// 检查是否为移动端
function isMobile() {
    var inBrowser = typeof window !== "undefined";
    var UA = inBrowser && window.navigator.userAgent.toLowerCase();
    var isAndroid = (UA && UA.indexOf("android") > 0);
    var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA));
    if (isAndroid || isIOS) {
        return true;
    } else {
        return false;
    }
}

var Game = {};

Game.init = function (options) {
    // 游戏画布
    this.canvas = document.getElementById(options.el);
    // 宽度
    this.width = options.width;
    // 高度
    this.height = options.height;
    // 缩放
    this.scale = this.canvas.clientHeight / this.height;
    // 键盘状态
    this.key = null;
    // 用户事件
    this.userEvents = {};
    // 动画间隔帧(每隔n帧绘制下一个关键帧)
    this.animationInterval = options.animationInterval || 16;
    // 测试(显示单位外框)
    this.test = false;
    // 是否移动端
    this.isMobile = isMobile();
    // 图片路径
    this.imagePath = options.path ? options.path.image : "";
    // 音频路径
    this.audioPath = options.path ? options.path.audio : "";

    // 初始化实例方法
    this.asset = asset(this);
    this.unit = unit(this);
    this.mix = function (Class, func) {
        if (!Class["mixins"]) {
            Class["mixins"] = [];
        }
        Class["mixins"].push(func);
    }

    // 设置canvas宽高
    this.canvas.setAttribute("width", this.width + "px");
    this.canvas.setAttribute("height", this.height + "px");

    var addEventListener = window.addEventListener;

    // 键盘事件
    addEventListener("keydown", function (e) {
        e.stopPropagation();
        e.preventDefault();
        var key = e.key;
        if (Game.key !== key) {
            Game.key = key;
            executeUserEvents("keydown", key);
        }
    });
    addEventListener("keyup", function (e) {
        e.stopPropagation();
        e.preventDefault();
        var key = e.key;
        if (Game.key === key) {
            Game.key = null;
        }
        executeUserEvents("keyup", key);
    });

    // 鼠标事件
    ["mousedown", "mouseup"].forEach(function (eventType) {
        addEventListener(eventType, function (e) {
            e.stopPropagation();
            e.preventDefault();
            if (!Game.isMobile) {
                executeUserEvents(eventType, calMouse(e));
            }
        });
    });

    // 触屏事件
    ["touchstart", "touchmove", "touchend"].forEach(function (eventType) {
        addEventListener(eventType, function (e) {
            executeUserEvents(eventType, calTouch(e));
        });
    });

    // 禁用右键菜单
    window.oncontextmenu = function () {
        return false;
    }
}

// 执行用户事件
function executeUserEvents(eventType, data) {
    var units = Game.userEvents;
    for (var key in units) {
        var unit = units[key];
        if (unit[eventType]) {
            unit[eventType](data);
        }
    }
}

// 计算鼠标数据
function calMouse(e) {
    var canvas = Game.canvas;
    // 计算画面缩放比例
    var scale = Game.scale;
    // 简化事件属性
    return {
        x: (e.clientX - canvas.offsetLeft) / scale,
        y: (e.clientY - canvas.offsetTop) / scale,
        button: e.button
    };
}

// 计算触控数据
function calTouch(e) {
    var canvas = Game.canvas;
    var scale = Game.scale;
    var touches = [];
    for (var i = 0; i < e.targetTouches.length; i++) {
        var touch = e.targetTouches[i];
        touches.push({
            x: (touch.clientX - canvas.offsetLeft) / scale,
            y: (touch.clientY - canvas.offsetTop) / scale,
            id: touch.identifier,
            type: e.type
        });
    }
    return touches;
}

export default Game