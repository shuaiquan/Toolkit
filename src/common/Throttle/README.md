# throttle

参考：[lodash](https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L10304)

## 目标
```
debounce(func, wait, [options]);

- func: 用来节流的函数
- wait: 节流函数的调用时间.
- options:
    - leading: 在一次节流过程的开始调用
    - trailing: 在一次节流过程的结束调用
```

注意：当 `leading` 和 `trailing` 都设置为 `true` 时，只有节流函数被调用两次或两次以上，结束时的调用才会被触发。

注意：wait 为必填参数