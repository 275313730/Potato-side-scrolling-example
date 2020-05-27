export function player(isMobile) {
    return {
        config: {
            id: "player",
            x: 10,
            y: 66,
            width: 28,
            height: 30,
            offsetLeft: -19,
            offsetTop: -13,
            direction: "right",
            layer: 1,
        },
        data: {
            exp: 0,
            collie: null,
            state: "stop",
            speed: 2,
            waiting: false,
            attacking: false,
            walkDirection: null,
            vSpeed: 0,
        },
        methods: {
            walk() {
                this.direction = this.walkDirection
                this.graphics.animation(this.id, "walk")
            },
            stop() {
                this.walkDirection = null
                this.graphics.animation(this.id, "idle")
            },
            attack() {
                this.event.add("wait", this.wait(4, () => {
                    this.attacking = true
                    this.graphics.animation(this.id, "attack")
                        .onComplete = () => {
                            this.restore()
                        }
                }))
            },
            jump() {
                this.graphics.image(this.id, "jump")
                this.vSpeed = 8
            },
            fall() {
                this.jumpTop = this.y
                this.graphics.image(this.id, "fall")
            },
            ground() {
                this.vSpeed = 0
                if (this.y - this.jumpTop > 32 * 3) {
                    this.graphics.image(this.id, "ground")
                    this.event.add("wait", this.wait(6, () => {
                        this.restore()
                    }))
                } else {
                    this.restore()
                }
            },
            hit() {
                this.graphics.animation(this.id, "hit")
                    .onComplete = () => {
                        this.event.add("wait", this.wait(8, () => {
                            this.restore()
                        }))
                    }
            },
            restore() {
                this.waiting = false
                this.attacking = false
                this.$pox.set("jump", () => { return false })
                this.$pox.set("attack", () => { return false })
                if (this.walkDirection) {
                    this.$potate.setState("walk")
                } else {
                    this.$potate.setState("stop")
                }
            },
            wait(interval, callback) {
                let count = 0
                this.waiting = true

                return () => {
                    count++
                    if (count >= interval) {
                        this.event.del("wait")
                        callback()
                    }
                }
            }
        },
        created() {
            init.call(this)
            initState.call(this)
            initPox.call(this, isMobile)
        }
    }

    function init() {
        if (isMobile) {
            this.userEvent.watch("touchstart", touch)
            this.userEvent.watch("touchmove", touch)
            this.userEvent.watch("touchend", touch)
        } else {
            this.userEvent.watch("keydown", keydown)
            this.userEvent.watch("keyup", keyup)
            this.userEvent.watch("mousedown", mousedown)
        }
        this.event.add("walkMove", walkMove)
        this.event.add("jumpMove", jumpMove)
    }

    function initState() {
        const addState = this.$potate.addState

        addState("stop", this.stop)
        addState("walk", this.walk)
        addState("ground", this.ground, nextState => {
            if (this.waiting) { return false }
            if (nextState === "stop" || nextState === "walk") { return true }
        })
        addState("attack", this.attack, nextState => {
            if (this.waiting) { return false }
            if (nextState === "stop" || nextState === "walk") { return true }
        })
        addState("jump", this.jump, nextState => {
            if (nextState === "fall") { return true }
        })
        addState("fall", this.fall, nextState => {
            if (nextState === "ground") { return true }
        })
        addState("hit", this.hit, nextState => {
            if (nextState === "stop") { return true }
        })

        this.$potate.setState("stop")
    }

    function initPox(isMobile) {
        const watch = this.$pox.watch
        const setState = this.$potate.setState
        const getState = this.$potate.getState

        watch("deaths", () => {
            this.$pox.set("player.exp", value => {
                return value + 1
            })
        })
        if (isMobile) {
            watch("walk", value => {
                this.walkDirection = value
                if (value !== null) {
                    if (getState() === "walk") {
                        this.direction = value
                    } else {
                        setState("walk")
                    }
                } else {
                    if (getState() === "walk") {
                        setState("stop")
                    }
                }
            })
            watch("jump", value => {
                value && setState("jump")
            })
            watch("attack", value => {
                value && setState("attack")
            })
        }
    }

    function touch(e) {
        this.$pox.set("touch", () => {
            return e
        })
    }

    function keydown(key) {
        const state = this.$potate.getState()
        switch (key) {
            case "d":
                this.walkDirection = "right"
                if (state === "walk" || state === "jump" || state === "fall") {
                    this.direction = this.walkDirection
                } else {
                    this.$potate.setState("walk")
                }
                break;
            case "a":
                this.walkDirection = "left"
                if (state === "walk" || state === "jump" || state === "fall") {
                    this.direction = this.walkDirection
                } else {
                    this.$potate.setState("walk")
                }
                break;
            case " ":
                this.$potate.setState("jump")
                break;
        }
    }

    function keyup(key) {
        switch (key) {
            case "a":
                if (this.direction === "left" && this.walkDirection === "left") {
                    this.walkDirection = null
                    this.$potate.setState("stop")
                }
                break;
            case "d":
                if (this.direction === "right" && this.walkDirection === "right") {
                    this.walkDirection = null
                    this.$potate.setState("stop")
                }
                break;
        }
    }

    function mousedown() {
        this.$potate.setState("attack")
    }

    function walkMove() {
        const state = this.$potate.getState()
        if (!this.walkDirection || state === "attack" || state === "ground") { return }
        if (this.direction === "right" && this.x < this.stage.width - this.width) {
            this.x += this.speed
        } else if (this.direction === "left" && this.x > 0) {
            this.x -= this.speed
        }
    }

    function jumpMove() {
        const state = this.$potate.getState()
        if (state !== "jump" && state !== "fall") { return }
        this.y -= this.vSpeed
        if (this.vSpeed > -4) {
            this.vSpeed -= 0.5
            if (this.vSpeed === 0) {
                this.$potate.setState("fall")
            }
        }
    }
}