export function titleText() {
    return {
        config: {
            id: 'titleText'
        },
        data: {
            count: 0,
        },
        methods: {
            draw() {
                const text = `press 'space' to start`
                this.graphics.draw(ctx => {
                    ctx.font = '12px pixel'
                    ctx.fillStyle = 'white'
                    ctx.fillText(text, (this.game.width - ctx.measureText(text).width) / 2, this.game.height / 3 * 2 + 10)
                })
            }
        },
        created() {
            this.$pox.watch('start', () => {
                this.draw()
                this.event.add('twinkling', twinkling)
            })
        }
    }

    function twinkling() {
        this.count++
        if (this.count >= 25) {
            this.alpha = this.alpha ? 0 : 1
            this.count = 0
        }
    }
}