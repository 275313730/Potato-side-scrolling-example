export function touch() {
    return {
        config: {
            id: 'touch',
            x: 45,
            width: 70,
            height: 70,
            fixed: 1,
            layer: 5
        },
        data: {
            moveTouchId: null,
            touchX: 0,
            touchY: 0,
            moveRange: null,
            attackRange: null,
            jumpRange: null,
            walk: null
        },
        methods: {
            calTouches(touches) {
                let touchMove = false
                for (const touch of touches) {
                    if (touch.type === 'touchstart') {
                        if (this.moveTouchId === null && inRange(touch, this.moveRange)) {
                            this.moveTouchId = touch.id
                            this.setTouch(touch)
                        } 

                        if (this.moveTouchId !== null) {
                            touchMove = true
                        }

                        if (this.$pox.get('attack') !== true && inRange(touch, this.attackRange)) {
                            this.$pox.set('attack', () => { return true })
                        }

                        if (this.$pox.get('jump') !== true && inRange(touch, this.jumpRange)) {
                            this.$pox.set('jump', () => { return true })
                        }
                    }

                    if (touch.type === 'touchmove' && this.moveTouchId === touch.id) {
                        touch.x = Math.min(touch.x, this.x + this.width / 2)
                        touch.x = Math.max(touch.x, this.x - this.width / 2)
                        touch.y = Math.min(touch.y, this.y + this.height / 2)
                        touch.y = Math.max(touch.y, this.y - this.height / 2)
                        touchMove = true
                        this.setTouch(touch)
                    }

                    if (touch.type === 'touchend' && touch.id === this.moveTouchId) {
                        touchMove = true
                    }
                }
                if (!touchMove) {
                    this.moveTouchId = null
                    this.walk = null
                    this.touchX = this.x
                    this.touchY = this.y
                    this.$pox.set('walk', () => { return null })
                }
            },
            setTouch(touch) {
                this.touchX = touch.x
                this.touchY = touch.y
                if (this.touchX > this.x) {
                    this.walk = 'right'
                } else {
                    this.walk = 'left'
                }
                if (this.$pox.get('walk') !== this.walk) {
                    this.$pox.set('walk', () => { return this.walk })
                }
            }
        },
        created() {
            this.y = this.game.height - this.height + 25
            this.touchX = this.x
            this.touchY = this.y
            this.moveRange = {
                x: this.x,
                y: this.y,
                radius: 35
            }
            this.attackRange = {
                x: this.game.width - 65,
                y: this.y + 14,
                radius: 18
            }
            this.jumpRange = {
                x: this.game.width - 25,
                y: this.y + 14,
                radius: 18
            }
            this.graphics.draw(draw)
            this.$pox.watch('touch', value => {
                this.calTouches(value)
            })
        }
    }

    function draw(ctx) {
        drawArc(this.moveRange, 0.2)
        drawArc({ x: this.touchX, y: this.touchY, radius: 15 }, 0.7)
        drawArc(this.attackRange, 0.7)
        drawText(this.game.width - 81, this.y + 14, 'attack')
        drawArc(this.jumpRange, 0.7)
        drawText(this.game.width - 37, this.y + 14, 'jump')

        function drawArc(range, alpha) {
            ctx.fillStyle = 'white'
            ctx.globalAlpha = alpha
            ctx.beginPath();
            ctx.arc(range.x, range.y, range.radius, 0, 2 * Math.PI)
            ctx.fill()
            ctx.closePath();
        }

        function drawText(x, y, text) {
            ctx.font = '10px pixel'
            ctx.fillStyle = 'red'
            ctx.fillText(text, x, y)
        }
    }

    function inRange(touch, range) {
        return Math.pow(touch.x - range.x, 2) + Math.pow(touch.y - range.y, 2) <= Math.pow(range.radius, 2)
    }
}