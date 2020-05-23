export function block(type, options) {
    if (type === 'block') {
        return {
            config: {
                id: 'block' + Math.random(),
                x: options[1] * 32,
                y: options[2] * 32,
                layer: 1,
                width: options[3] * 32,
                height: options[4] * 32
            },
            data: {
                type,
                collieType: options[0]
            }
        }
    } else {
        return {
            config: {
                id: 'flat' + Math.random(),
                x: options[0] * 32,
                y: options[1] * 32,
                layer: 1,
                width: options[2] * 32,
                height: 10
            },
            data: {
                type,
                collieType: 8
            }
        }
    }
}