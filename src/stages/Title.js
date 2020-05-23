import { Sprite } from "../core/Potato.js";
import { titleImg } from "../sprites/TitleImg.js";
import { titleText } from "../sprites/TitleText.js";

export function title() {
    return {
        created() {
            new Sprite(titleImg())
            new Sprite(titleText())
        }
    }
}