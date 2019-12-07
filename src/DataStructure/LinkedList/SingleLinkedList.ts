import BaseLinkedList, { BaseLinkedListNode } from './BaseLinkedList';

class SingleLinkedListNode<T> implements BaseLinkedListNode<T> {
    next: SingleLinkedListNode<T> | null = null;

    constructor(public value: T) { }
}

class SingleLinkedList<T> implements BaseLinkedList<T> {
    private head: SingleLinkedListNode<T> = null;
    private tail: SingleLinkedListNode<T> = null;

    private length: number = 0;

    addAtHead(value: T) {
        if (this.isEmpty()) {
            return this.addFirstNode(value);
        }
        const node = new SingleLinkedListNode(value);
        node.next = this.head;
        this.head = node;
        return this;
    }

    addAtTail(value: T) {
        if (this.isEmpty()) {
            return this.addFirstNode(value);
        }
        const node = new SingleLinkedListNode(value);
        this.tail.next = node;
        this.tail = node;
    }

    private addFirstNode(value: T) {
        const node = new SingleLinkedListNode(value);
        this.head = node;
        this.tail = node;
        return this;
    }

    deleteByValue(value: T) {
        if (this.isEmpty()) {
            return null;
        }
        if (this.head.value === value) {
            const node = this.head;
            this.head = this.head.next;
            node.next = null;
            return node;
        }
        let lastNode = this.head;
        let node = this.head.next;
        while (node !== null) {
            if (node.value === value) {
                lastNode.next === node.next;
                node.next = null;
                return node;
            }
        }
        return node;
    }

    isEmpty() {
        return this.length === 0;
    }

    getLength() {
        return this.length;
    }
}

export default SingleLinkedList;