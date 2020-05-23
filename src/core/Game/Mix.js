export function mix(Class,func) {
    if (!Class['mixins']) {
        Class['mixins'] = []
    }
    Class['mixins'].push(func)
}