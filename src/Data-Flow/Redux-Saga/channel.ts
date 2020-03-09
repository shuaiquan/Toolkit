import { Matcher } from './matcher';
import { remove } from './util';

interface Taker {
    cb: Function,
    matcher: Matcher;
    cancel: () => void;
}

class MultiCastChannel {
    private takers: Taker[] = [];

    take(cb: Function, matcher: Matcher) {

    }

    put(input) {

    }
}

export default MultiCastChannel;
