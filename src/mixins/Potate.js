export function potate() {
    let states = {}
    let currState = null
    const unit = this
    this.$potate = {
        addState(state, action, condition) {
            states[state] = { action, condition }
        },
        setState(nextState) {
            if (currState === nextState) {
                return false
            }
            if (currState != null) {
                const condition = states[currState].condition
                if (condition && !condition(nextState)) {
                    return false
                }
            }
            currState = nextState
            const action = states[currState].action
            action && action.call(unit)
            return true
        },
        getState() {
            return currState
        }
    }
}