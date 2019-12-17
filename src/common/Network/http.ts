import XHRHelper, { ReadyState, Response, XHRConfig } from './xhrHelper';
import { buildUrl, isObject, isUrlSearchParams } from './common';

interface Params {
    [key: string]: any;
}

enum Method {
    GET = 'get',
    POST = 'post',
}

class Http {
    create() {
        return new Http();
    }

    get(url: string, params?: Params) {
        return this.makeXHR({
            method: Method.GET,
            url: buildUrl(url, params),
        });
    }

    post(url: string, data?: Params) {
        return this.makeXHR({
            method: Method.POST,
            url: buildUrl(url),
            data: data && String(data),
        });
    }

    request(url: string, config?: XHRConfig) {
        return this.makeXHR({
            method: Method.GET,
            ...config,
            url,
        });
    }

    private makeXHR = (config: XHRConfig) => {
        return new Promise((resolve: (response: Response) => void, reject: (err: Error) => void) => {
            const xhrHelper = new XHRHelper(config);

            xhrHelper.setReadyStateListener((readyState: ReadyState) => {
                if (readyState === ReadyState.DONE) {
                    resolve(xhrHelper.getResponse());
                }
            });

            xhrHelper.setErrorListener(err => {
                reject(err);
            })
        });
    }
}

export default new Http();
