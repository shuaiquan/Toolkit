import { Reducer } from './types';

interface CombineParam {
    [key: string]: Reducer<any>;
}

export function combineReducers(reducers: CombineParam) {

}