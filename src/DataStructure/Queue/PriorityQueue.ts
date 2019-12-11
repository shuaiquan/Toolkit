export interface PriorityEle {
    priority: number;
}

const EMPTY_LENGTH = 0;

class PriorityQueue<T extends PriorityEle> {
    private elements: T[] = [];

    enQueue(ele: T) {
        const index = this.elements.findIndex(e => e.priority < ele.priority);
        if (index === -1) {
            this.elements.push(ele);
        } else {
            this.elements.splice(index, 0, ele);
        }
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

export default PriorityQueue;
