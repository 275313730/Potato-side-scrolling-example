export function asset(Game) {
    var imagePath = Game.imagePath;
    var audioPath = Game.audioPath;
    var loadings = [];
    var assets = {};

    return {
        // new Stage()时会自动调用该函数
        allLoaded(callback) {
            if (loadings.length > 0) {
                Promise.all(loadings)
                    .then(function () { callback() });
            } else {
                callback();
            }
        },
        // 获取资源
        get(group, name) {
            return assets[group][name];
        },
        // 载入资源
        load(options) {
            var type = options.type;
            var group = options.group;
            var name = options.name;
            var url = options.url;

            if (!assets[group]) { assets[group] = {} }
            if (assets[group][name]) { return };

            if (type === 'image') {
                var image = new Image();
                loadings.push(new Promise(function (resolve) {
                    image.onload = function () {
                        assets[group][name] = image;
                        resolve(true);
                    }
                }))
                image.src = imagePath + url;
                return;
            }

            if (type === 'animation') {
                var image = new Image();
                loadings.push(new Promise(function (resolve) {
                    image.onload = function () {
                        switch (Game.mode) {
                            case 0:
                                assets[group][name] = {
                                    image,
                                    frame: options.frame,
                                    interval: options.interval,
                                    flip: options.flip
                                };
                                break;
                            case 1:
                                assets[group][name] = { image };
                                break;
                        }
                        resolve(true);
                    }
                }));
                image.src = imagePath + url;
                return;
            }

            if (type === 'audio') {
                assets[group][name] = new Audio(audioPath + url);
            }
        },
    }
}