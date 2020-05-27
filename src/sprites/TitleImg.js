import { Stage } from "../core/Potato.js";
import { normal } from "../stages/Normal.js";

export function titleImg() {
    return {
        config: {
            id: 'titleImg',
        },
        data: {
            lastY: null
        },
        methods: {
            press() {
                if (this.y <= this.lastY) {
                    new Stage(normal())
                } else {
                    this.y = this.lastY
                }
            }
        },
        created() {
            this.graphics.image('title', 'title', true)
            this.x = (this.game.width - this.width) / 2
            this.y = this.game.height
            this.lastY = (this.game.height - this.height) / 3 + 20
            this.event.add('move', move)
            this.userEvent.watch('touchend', () => {
                this.press()
            })
            this.userEvent.watch("keydown", key => {
                if (key === " ") {
                    this.press()
                }
            })
        }
    }

    function move() {
        if (this.y >= this.lastY) {
            this.y -= 2
        } else {
            this.event.del('move')
            this.$pox.set('start', () => { return true })
        }
    }
}