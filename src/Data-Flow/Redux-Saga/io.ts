import { EffectType, IO, TakeEffect, PutEffect } from "./effectType";
import { AnyAction } from "../Redux/types";

function makeEffect(type: EffectType, payload: any) {
    return {
        [IO]: true,
        type,
        payload,
    };
}

export function take(pattern: string = '*') {
    return makeEffect(EffectType.TAKE, pattern) as TakeEffect;
}

export function put(action: AnyAction) {
    return makeEffect(EffectType.PUT, action) as PutEffect;
}
