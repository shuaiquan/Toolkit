export interface BaseLinkedListNode<T> {
    value: T;
    next: BaseLinkedListNode<T> | null;
}

abstract class BaseLinkedList<T> {

    abstract addAtHead(value: T): this;
    abstract addAtTail(value: T): this;

    abstract deleteByValue(value: T): BaseLinkedListNode<T>;
    // abstract deleteByIndex(index: number): BaseLinkedListNode<T>;
    // abstract deleteByNode(node: BaseLinkedListNode<T>): BaseLinkedListNode<T>;

    abstract isEmpty(): boolean;
    abstract getLength(): number;
}

export default BaseLinkedList;
