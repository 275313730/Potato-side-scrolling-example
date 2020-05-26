export function geometry() {
    function getData(unit1, unit2) {
        var x1 = unit1.x
        var y1 = unit1.y
        var w1 = unit1.width
        var h1 = unit1.height

        var x2 = unit2.x
        var y2 = unit2.y
        var w2 = unit2.width
        var h2 = unit2.height

        return { x1, y1, w1, h1, x2, y2, w2, h2 }
    }
    return {
        // 在上面
        above(unit1, unit2) {
            var { x1, y1, w1, h1, x2, y2, w2 } = getData(unit1, unit2)

            if (y1 + h1 <= y2 && x1 + w1 >= x2 && x1 <= x2 + w2) {
                return true
            }
            return false
        },
        // 包含
        contain(unit1, unit2) {
            var { x1, y1, w1, h1, x2, y2, w2, h2 } = getData(unit1, unit2)

            if (w1 < w2 && h1 < h2 &&
                (x1 <= x2 || x1 + w1 >= x2 + w2) &&
                (y1 <= y2 || y1 + h1 >= y2 + h2)) {
                return false
            }
            return true
        },
        // 距离
        distance(type, unit1, unit2) {
            var { x1, y1, w1, h1, x2, y2, w2, h2 } = getData(unit1, unit2)

            if (type === 'y') {
                if (y2 > y1 + h1) {
                    return y2 - (y1 + h1)
                } else if (y1 > y2 + h2) {
                    return y1 - (y2 + h2)
                } else {
                    return 0
                }
            }
            if (type === 'x') {
                if (x2 > x1 + w1) {
                    return x2 - (x1 + w1)
                } else if (x1 > x2 + w2) {
                    return x1 - (x2 + w2)
                } else {
                    return 0
                }
            }
        },
        // 相交
        intersect(unit1, unit2) {
            var { x1, y1, w1, h1, x2, y2, w2, h2 } = getData(unit1, unit2)

            if (x1 >= x2 + w2 ||
                x1 + w1 <= x2 ||
                y1 >= y2 + h2 ||
                y1 + h1 <= y2) {
                return false
            }
            return true
        },
        // 在右边
        onRight(unit1, unit2) {
            var { x1, y1, h1, x2, y2, w2, h2 } = getData(unit1, unit2)

            if (x1 >= x2 + w2 && y1 + h1 >= y2 && y1 <= y2 + h2) {
                return true
            }
            return false
        },
        // 在左边
        onLeft(unit1, unit2) {
            var { x1, y1, w1, h1, x2, y2, h2 } = getData(unit1, unit2)

            if (x1 + w1 <= x2 && y1 + h1 >= y2 && y1 <= y2 + h2) {
                return true
            }
            return false
        },
        // 相切
        tangent(unit1, unit2) {
            var { x1, y1, w1, h1, x2, y2, w2, h2 } = getData(unit1, unit2)

            if (x1 > x2 + w2 ||
                x1 + w1 < x2 ||
                y1 > y2 + h2 ||
                y1 + h1 < y2) {
                return false
            }
            return true
        },
        // 在下面
        under(unit1, unit2) {
            var { x1, y1, w1, x2, y2, w2, h2 } = getData(unit1, unit2)

            if (y1 >= y2 + h2 && x1 + w1 >= x2 && x1 <= x2 + w2) {
                return true
            }
            return false
        },
    }
}