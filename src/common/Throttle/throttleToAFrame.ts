import { PriorityQueue, PriorityEle } from '../../DataStructure/Queue';

interface QueueEle extends PriorityEle {
    fn: () => void;
}

const queue = new PriorityQueue<QueueEle>();

export function throttleToAFrame(fn: () => void, priority: number = 0) {
    if (queue.isEmpty()) {
        requestAnimationFrame(() => {
            let ele = queue.deQueue();
            while (ele) {
                ele.fn();
                ele = queue.deQueue();
            }
        });
    }
    queue.enQueue({ fn, priority });
}