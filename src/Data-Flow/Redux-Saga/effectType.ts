import { AnyAction } from "../Redux/types";

export enum EffectType {
    TAKE = 'take',
    PUT = 'put',
}

export const IO = Symbol('io');

export interface Effect<P> {
    // 这个字段表明这是一个 Effect
    [IO]: true,
    // 表明 effect 类型
    type: EffectType,
    // 不同 effect ，payload 不一致
    payload: P,
}

export type TakeEffect = Effect<string>;
export type PutEffect = Effect<AnyAction>;