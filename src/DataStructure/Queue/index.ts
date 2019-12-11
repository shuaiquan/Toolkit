import PriorityQueue, { PriorityEle } from './PriorityQueue';

const EMPTY_LENGTH = 0;

class BaseQueue<T> {
    private elements: T[] = [];

    enQueue(ele: T) {
        this.elements.push(ele);
        return this;
    }

    deQueue() {
        return this.elements.shift();
    }

    size() {
        return this.elements.length;
    }

    isEmpty() {
        return this.size() === EMPTY_LENGTH;
    }
}

export default BaseQueue;
export {
    PriorityQueue,
    PriorityEle
};
