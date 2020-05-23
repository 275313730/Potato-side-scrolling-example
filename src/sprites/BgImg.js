export function bgImg(id) {
    return {
        config: {
            id,
        },
        created() {
            this.graphics.image('bg', id, true)
        }
    }
}