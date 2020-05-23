export function collie(player, blocks) {
    for (const key in blocks) {
        const block = blocks[key]
        switch (block.collieType) {
            case 8:
                if (this.geometry.above(player, block) && this.geometry.distance('y', player, block) < -player.vSpeed) {
                    player.collie = 8
                    player.y = block.y - player.height
                    if (player.$potate.getState() === 'fall') {
                        player.$potate.setState('ground')
                    }
                    return
                }
                break
            case 9:
                if (this.geometry.above(player, block)) {
                    if (this.geometry.distance('y', player, block) < -player.vSpeed) {
                        player.collie = 8
                        player.y = block.y - player.height
                        if (player.$potate.getState() === 'fall') {
                            player.$potate.setState('ground')
                        }
                        return
                    }
                } else {
                    if (this.geometry.intersect(player, block)) {
                        player.collie = 6
                        player.x = block.x + block.width
                    }
                }
                break
            case 6:
                if (this.geometry.intersect(player, block)) {
                    player.collie = 6
                    player.x = block.x + block.width
                }
                break
            case 3:
                if (player.collie === 2 && player.vSpeed >= 0) {
                    player.y = block.y + block.height
                    return
                }
                if (this.geometry.under(player, block)) {
                    if (this.geometry.distance('y', player, block) < player.vSpeed) {
                        player.collie = 2
                        player.y = block.y + block.height
                        return
                    }
                } else {
                    if (this.geometry.intersect(player, block)) {
                        player.collie = 6
                        player.x = block.x + block.width
                        return
                    }
                }
                break
            case 2:
                if (this.geometry.intersect(player, block)) {
                    player.collie = 2
                    player.y = block.y + block.height
                }
                break
        }
    }
    player.collie = null
}