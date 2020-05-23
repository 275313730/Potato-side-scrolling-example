export function pig(id, x, y, direction) {
    return {
        config: {
            id: 'pig' + id,
            x,
            y,
            width: 19,
            height: 18,
            offsetLeft: -10,
            offsetTop: -10,
            direction
        },
        data: {
            type: 'enemy',
            hp: 2,
            hitting: false,
            dead: false
        },
        methods: {
            stop() {
                this.graphics.animation('pig', 'idle')
            },
            hit() {
                if (this.hitting || this.hp === 0) { return }
                this.hitting = true
                this.hp--
                this.graphics.animation('pig', 'hit')
                    .onComplete = () => {
                        this.event.add('wait', wait(16, () => {
                            this.hitting = false
                            if (this.hp === 0) {
                                this.die()
                            } else {
                                this.stop()
                            }
                        }))
                    }
            },
            die() {
                this.graphics.animation('pig', 'dead')
                    .onComplete = () => {
                        this.dead = true
                    }
            },
        },
        created() {
            this.stop()
        },
        destroyed() {
            this.$pox.set('deaths', value => { return value + 1 })
        }
    }

    function wait(interval, callback) {
        let count = 0
        return function wait() {
            count++
            if (count === interval) {
                this.event.del('wait')
                callback()
            }
        }
    }
}