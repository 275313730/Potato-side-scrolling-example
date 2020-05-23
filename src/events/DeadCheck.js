import { Game } from "../core/Potato.js"

export function deadCheck() {
    const pigs = Game.unit.filter(unit => { return unit.type === 'enemy' })
    for (const key in pigs) {
        const pig = pigs[key]
        if (pig.dead === true) {
            Game.unit.del(pig.id)
        }
    }
}