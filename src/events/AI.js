export function ai(player, pigs) {
    pigs.forEach(pig => {
        if (pig.$potate.getState() === "die") {
            return 
        }
        if (pig.stay && this.geometry.distance("o", pig, player) <= 50) {
            pig.stay = false
            pig.$potate.setState("walk")
        }
        if (!pig.stay) {
            pig.direction = player.x < pig.x ? "left" : "right"
            if (this.geometry.distance("o", pig, player) <= 60) {
                if (this.geometry.distance("o", pig, player) <= 20) {
                    pig.$potate.setState("attack")
                } else {
                    pig.$potate.setState("walk")
                }
            } else {
                pig.stay = true
                pig.$potate.setState("stop")
            }
        }
    })
}