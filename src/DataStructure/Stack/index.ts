const EMPTY_LENGTH = 0;

class BaseStack<T> {
    private elements: T[] = [];

    push(ele: T) {
        this.elements.push(ele);
        return this;
    }

    pop() {
        const deleteArr = this.elements.splice(this.size() - 1, 1);
        return deleteArr[0];
    }

    size() {
        return this.elements.length;
    }

    isEmpty() {
        return this.size() === EMPTY_LENGTH;
    }
}

export default BaseStack;
