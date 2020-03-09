export function remove<T>(array: T[], item: T) {
    const index = array.findIndex(a => a === item);

    if (index !== -1) {
        array.splice(index, 1);
    }
}