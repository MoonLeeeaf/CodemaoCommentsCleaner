### 清理评论.js

#### 使用

安装 Node.js 18.0.0+，因为本项目依赖的库需要 fetch API

然后输入
```bash
node main.js <你Cookie中的authorization项的值> <作品ID 或者 --user=你的训练师编号>
```
以运行评论清理

提示：为了防止误删，暂时只有一个规则，可以修改 main.js 的代码以应用任意正则表达式规则
例如：
```JavaScript
// ...
// 下面这条将匹配 以“[任意字符]自动”开头的评论
const reg = /^.?自动.*/
// ...
```

#### 制作背景

> 实际上我是不反对自动评论的，反对的是它的泛滥，现在评论区到处都是了，我也不例外（删了）
> 我知道，现在社区这么动荡，还有现在上首页的作品很多都是跑酷或者一些水作等等
> 这就导致我们必须用特殊手段获取流量
> 而自动化，就是当下最普遍的选择
> 我承认，我也用过，但是我想尽可能地不带来不必要的麻烦
> 因此，我只用了自动点赞
> 希望各位能合理使用这个工具，毕竟，评论区对于作者来说还是很重要的

故本人开发了这个小工具

#### 协议

本作品使用了基于 Apache License 2.0 协议的 [moon-codemao-api](https://github.com/MoonLeeeaf/moon-codemao-api/)

本项目也基于 Apache License 2.0 进行开源

请各位有使用并修改了本项目代码的同志在任意可见位置标注我的信息，谢谢！
