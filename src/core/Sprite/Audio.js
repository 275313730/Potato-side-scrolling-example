import { Game } from "../Game/Game.js"

export function audio(unit) {
    let music = { audio: null }
    let sounds = []

    return {
        // 计算音量
        cal() {
            if (!music.audio && sounds.length === 0) {
                return
            }

            const relX = unit.relX
            const relY = unit.relY
            const distance = Math.sqrt(relX * relX + relY * relY)

            if (music.audio && music.range > 0) {
                const range = music.range
                const audio = music.audio

                setVolume(audio, range, music.defalutVolume, distance)
            }

            for (let i = 0; i < sounds.length; i++) {
                const sound = sounds[i]
                const range = sound.range
                const audio = sound.audio

                if (audio.ended === true) {
                    sounds.splice(i, 1)
                    audio.remove()
                    i--
                    continue
                }

                setVolume(audio, range, sound.defalutVolume, distance)
            }

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
            const type = options.type
            const group = options.group
            const name = options.name
            const range = options.range || 0
            const volume = options.volume || 1
            const startTime = options.startTime || 0
            const loop = options.loop || true
            const newAudio = Game.asset.get(group, name)

            if (type === 'sound') {
                const newSound = newAudio.cloneNode()

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
        delAll() {
            if (music.audio) {
                music.audio.remove()
            }
            sounds.forEach(sound => {
                sound.audio.remove()
            })
        }
    }
}