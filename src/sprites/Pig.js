export function pig(id, x, y, direction) {
    return {
        config: {
            id: "pig" + id,
            x,
            y,
            width: 19,
            height: 18,
            offsetLeft: -10,
            offsetTop: -10,
            direction,
            layer: 2
        },
        data: {
            type: "enemy",
            hp: 2,
            speed: 1,
            stay: true,
            hitting: false,
            dead: false
        },
        methods: {
            stop() {
                this.graphics.animation("pig", "idle")
            },
            walk() {
                this.graphics.animation("pig", "walk")
            },
            attack() {
                this.graphics.animation("pig", "attack")
            },
            hit() {
                if (this.hitting || this.hp === 0) { return }
                this.hitting = true
                this.hp--
                this.graphics.animation("pig", "hit")
                    .onComplete = () => {
                        this.event.add("wait", wait(16, () => {
                            this.hitting = false
                            if (this.hp === 0) {
                                this.$potate.setState("die")
                            } else {
                                this.$potate.setState("stop")
                            }
                        }))
                    }
            },
            die() {
                this.graphics.animation("pig", "dead")
                    .onComplete = () => {
                        this.dead = true
                    }
            },
        },
        created() {
            this.$potate.addState("stop", this.stop)
            this.$potate.addState("walk", this.walk)
            this.$potate.addState("hit", this.hit, () => {
                if (this.hitting) {
                    return false
                } else {
                    return true
                }
            })
            this.$potate.addState("attack", this.attack)
            this.$potate.addState("die", this.die, () => {
                return false
            })
            this.$potate.setState("stop")
            this.event.add("move", move)
        },
        destroyed() {
            this.$pox.set("deaths", value => { return value + 1 })
        }
    }

    function wait(interval, callback) {
        let count = 0
        return function wait() {
            count++
            if (count === interval) {
                this.event.del("wait")
                callback()
            }
        }
    }

    function move() {
        const state = this.$potate.getState()
        if (state === "walk") {
            this.x += this.direction === "right" ? 1 : -1
        }
    }
}