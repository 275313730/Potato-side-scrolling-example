import Game from "../Game/Game.js"

export function audio(sprite) {
    var music = { audio: null }
    var sounds = []

    return {
        // 更新音频
        update() {
            // 判断是否绑定音频
            if (!music.audio && sounds.length === 0) {
                return
            }

            // 计算相对距离
            var relX = sprite.relX
            var relY = sprite.relY
            var distance = Math.sqrt(relX ** 2 + relY ** 2)

            // 音乐
            if (music.audio && music.range > 0) {
                var range = music.range
                var audio = music.audio
                setVolume(audio, range, music.defalutVolume, distance)
            }

            // 音效
            for (var i = 0; i < sounds.length; i++) {
                var sound = sounds[i]
                var range = sound.range
                var audio = sound.audio
                // 移除播放完的音效
                if (audio.ended === true) {
                    sounds.splice(i, 1)
                    audio.remove()
                    i--
                    continue
                }
                setVolume(audio, range, sound.defalutVolume, distance)
            }

            // 设置音量
            function setVolume(audio, range, defalutVolume, distance) {
                if (range) {
                    if (distance >= range) {
                        audio.volume = 0
                    } else {
                        audio.volume = defalutVolume * ((range - distance) / range)
                    }
                }
            }
        },
        // 播放
        play(options) {
            var type = options.type
            var group = options.group
            var name = options.name
            var range = options.range || 0
            var volume = options.volume || 1
            var startTime = options.startTime || 0
            var loop = options.loop || true
            var newAudio = Game.asset.get(group, name)

            // 当类型为音效时，克隆一个独立节点来播放
            if (type === 'sound') {
                var newSound = newAudio.cloneNode()

                newSound.volume = volume
                newSound.currentTime = startTime
                newSound.play()

                sounds.push({
                    audio: newSound,
                    defalutVolume: volume,
                    range
                })

                return
            }

            // 当类型为音乐时，默认循环播放
            if (type === 'music') {
                if (music.audio !== newAudio) {
                    music.audio = newAudio
                    music.defalutVolume = volume
                    music.range = range

                    newAudio.currentTime = startTime
                    newAudio.volume = volume
                    newAudio.loop = loop
                }
                newAudio.play()
            }
        },
        // 停止
        stop() {
            music.pause()
            music.currentTime = 0
        },
        clear() {
            if (music.audio) {
                music.audio.remove()
            }
            sounds.forEach(function (sound) {
                sound.audio.remove()
            })
        }
    }
}