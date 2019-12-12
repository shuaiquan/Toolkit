export enum ReadyState {
    UNSET = 'unset',
    OPENED = 'opened',
    HEADERS_RECEIVED = 'headers_received',
    LOADING = 'loading',
    DONE = 'done',
}

const ReadyStateMap: Map<number, ReadyState> = new Map([
    [0, ReadyState.UNSET],
    [1, ReadyState.OPENED],
    [2, ReadyState.HEADERS_RECEIVED],
    [3, ReadyState.LOADING],
    [4, ReadyState.DONE],
]);

interface ReadyStateListener {
    (readyState: ReadyState): void;
}

interface ErrorListener {
    (err: Error): void;
}

export enum Method {
    GET = 'get',
    POST = 'post',
}

export interface XHRConfig {
    method: Method;
    url: string;
    data?: Document | BodyInit | null;
    header?: {
        [key: string]: string;
    }
}

export interface Response {
    data: any;
    status: number;
    statusText: string;
}

export default class XHRHelper {
    private xhr: XMLHttpRequest = new XMLHttpRequest();

    private readyState: ReadyState = ReadyState.UNSET;
    private readyStateListener: ReadyStateListener = null;

    private error: Error = null;
    private errorListener: ErrorListener = null;

    private timeoutErr: Error = null
    private timeoutListener: ErrorListener = null;

    constructor(config: XHRConfig) {
        this.xhr.onreadystatechange = this.readyStateChange;
        this.xhr.onerror = this.onError;
        this.xhr.ontimeout = this.onTimeout;

        this.excute(config);
    }

    private excute(config: XHRConfig) {
        const {
            method,
            url,
            data = null
        } = config;
        this.setRequestHeader(config);
        this.xhr.open(method, url);
        this.xhr.send(data)
    }

    private setRequestHeader(config: XHRConfig) {
        const { header } = config;
        if (header) {
            Object.keys(header).forEach(key => {
                this.xhr.setRequestHeader(key, header[key]);
            });
        }
    }

    private readyStateChange = () => {
        // 存储 readyState 状态
        this.readyState = ReadyStateMap.get(xhr.readyState);
        // 如果存在传入的 readyStateListener , 则执行
        if (this.readyStateListener) {
            this.readyStateListener(this.readyState);
        }
    }

    private onError = () => {
        this.error = new Error('somethind wrong');
        if (this.errorListener) {
            this.errorListener(this.error);
        }
    }

    private onTimeout = () => {
        this.timeoutErr = new Error('this request is timeout');
        if (this.timeoutListener) {
            this.timeoutListener(this.timeoutErr);
        }
    }

    /**
     * 调用方设置 readyStateListener 监听函数
     */
    setReadyStateListener = (fn: ReadyStateListener) => {
        // 如果 readyState 已为 done , 不会再改变，则直接执行 readyStateListener
        if (this.readyState === ReadyState.DONE) {
            fn(this.readyState);
        } else {
            // 成功设置 readyStateListener ，错过的 readyState 状态变化无法再监听到
            this.readyStateListener = fn;
        }
    }

    setErrorListener = (fn: ErrorListener) => {
        if (this.error) {
            fn(this.error);
        } else {
            this.errorListener = fn;
        }
    }

    setTimeoutListener = (fn: ErrorListener) => {
        if (this.timeoutErr) {
            fn(this.timeoutErr);
        } else {
            this.timeoutListener = fn;
        }
    }

    getResponse = () => {
        return {
            data: this.xhr.response,
            status: this.xhr.status,
            statusText: this.xhr.statusText,
        } as Response;
    }
}