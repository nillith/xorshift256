# XorShift256
一个轻量的随机数发生器，主要用来处理Math.random()不能指定种子的问题。

*其他语言版本: [English](README.md), [简体中文](README.zh-cn.md).*

### 用法

    npm install xorshift256

在旧浏览器中使用需要polyfill.

Node.js

    const XorShift256 = require('xorshift256');

    const rng = XorShift256(Math.random());

构造函数的参数即为种子。这个参数是可选的，如果不传参，则会使用`XorShift256.defaultSeed`作为种子. 你可以传入任何类型的值作为种子，推荐传入数值数组。

你也可以在构造完成后重新设置种子:

    rng.seed(some-seed);

生成 [0, 1) 之间的浮点数:

    rng();
    // 或者
    rng.uniform01();

生成 [-1, 1) 之间的浮点数:

    rng.uniform11();

生成 [min, max) 之间的浮点数:

    rng.uniform(min, max);
    // or:
    const generate = rng.uniformGenerator(min, max);
    generate();

生成32位无符型整数:

    rng.uint32();

生成32位整数:

    rng.int32();

生成 [min, max) 之间的整数:

    rng.uniformInt(min, max);
    // 或者
    const generate = rng.uniformIntGenerator(min, max);
    generate();

生成 [0, 255] 之间的整数:

    rng.byte();

生成一组随机字节:

    rng.bytes(length);
    // 或者
    const arr = new Array(length);
    rng.bytes(arr);

生成 uuid v4 :

    rng.uuid4();

洗牌:

    rng.shuffle(array);

跳过指定数量的值:

    rng.discard(100);

复制发生器:

    const clone = rng.clone();

确定发生器是否相同

    clone.equals(rng)

保存发生器的状态:

    const data = rng.serialize(); // data 的类型是字符串

恢复之前保存的发生器的状态:

    rng.deserialize(data);
    // 或者
    const rng2 = XorShift256.deserialize(data);


## 许可证

Nillith, 2018. Licensed under an [MIT](LICENSE.txt) license.
