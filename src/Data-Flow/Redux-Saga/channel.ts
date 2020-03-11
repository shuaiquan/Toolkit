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

class MultiCastChannel {
    private takers: Taker[] = [];

    /**
     * 将监听函数添加到队列里
     */
    take(cb: TakerFunc, matcher: Matcher = wildcard) {
        this.takers.push({ cb, matcher });
    }

    /**
     * 找到匹配当前 Action 的监听函数并执行
     */
    put(action: AnyAction) {
        this.takers.forEach(taker => {
            if (taker.matcher(action)) {
                taker.cb(action);
            }
        })
    }
}

export default MultiCastChannel;
