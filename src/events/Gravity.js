export function gravity(player, blocks) {
    const state = player.$potate.getState()
    if (state === 'jump' || state === 'fall') { return }
    for (const key in blocks) {
        const block = blocks[key]
        if (this.geometry.tangent(player, block)) {
            return
        }
    }
    player.$potate.setState('fall')
}