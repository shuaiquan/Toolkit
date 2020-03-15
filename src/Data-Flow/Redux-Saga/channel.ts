import { Matcher, wildcard } from './matcher';
import { AnyAction } from '../Redux/types';

/**
 * 最简单的版本定义 Taker 
 * 
 * cb: 一个监听函数
 * matcher: 一个匹配Action的方法
 */
interface Taker {
    cb: TakerFunc,
    matcher: Matcher;
}

interface TakerFunc {
    (action: AnyAction): void;
}

const END_TYPE = 'CLOSE_CHANNEL';
export const END = { type: END_TYPE };
export function isEnd(action: AnyAction) {
    return action.type === END_TYPE;
}

class MultiCastChannel {
    private takers: Taker[] = [];

    private closed: boolean = false;

    /**
     * 将监听函数添加到队列里
     */
    take(cb: TakerFunc, matcher: Matcher = wildcard) {
        if (this.closed) {
            cb(END);
        }

        this.takers.push({ cb, matcher });
    }

    /**
     * 找到匹配当前 Action 的监听函数并执行
     */
    put(action: AnyAction) {
        if (this.closed) {
            return;
        }

        if (isEnd(action)) {
            this.close();
        }

        this.takers.forEach(taker => {
            if (taker.matcher(action)) {
                taker.cb(action);
            }
        })
    }

    /**
     * 关闭了当前的 Channel
     */
    close() {
        this.closed = true;

        this.takers.forEach(taker => taker.cb(END));
    }
}

export default MultiCastChannel;
