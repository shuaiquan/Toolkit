# debounce

参考：[lodash](https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L10304)

## 目标
```
debounce(func, wait, [options]);

- func: 用来防抖的函数
- wait: 防抖函数的调用时间.
- options:
    - leading: 在一次防抖过程的开始调用
    - trailing: 在一次防抖过程的结束调用
```

注意：当 `leading` 和 `trailing` 都设置为 `true` 时，只有防抖函数被调用两次或两次以上，结束时的调用才会被触发。

注意：wait 为必填参数

### 没有实现什么
`lodash` 中的 `options.maxWait` 没有实现。 

`options.maxWait` 使用其实就是 `throttle`, 考虑到分开实现的逻辑更调理一些，故没有实现