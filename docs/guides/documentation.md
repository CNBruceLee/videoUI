# videoUI API

## 基础案例

~~~html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="shortcut icon" href="../media/images/favicon.ico" type="image/x-icon">
    <title>videoUI</title>
    <!-- 1、引入CSS -->
	<link href="../css/videoUI.css" rel="stylesheet"></head>
<body>
<div class="container">
    <!--2、video的容器 -->
    <div class="video-ui" style="width: 720px;height: 480px;margin: 10px auto"></div>
</div>
<!-- 3、引入JS -->
<script type="text/javascript" src="../js/videoUI.js"></script></body>
<script>
    //4、创建videoUI实例
    var vui = new VideoUI({//5、配置对象
        el: ".video-ui",
        qualityData: [{
            name: "4K",
            src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
            type: "video/mp4"
        }],
    });
</script>
</html>

~~~

![demo1](https://gitee.com/cnbrucelee/videoUI/raw/master/media/images/demo1.png)



## 开发环境

- H5+less
- webpack



## 支持浏览器

- Chrome浏览器
- IE11
- 其他待验证



## videoUI属性

| 名称              |   类型   |     默认     | 描述                               | 是否实现 |
| ----------------- | :------: | :----------: | ---------------------------------- | :------: |
| el                |  String  |              |                                    |    Y     |
| poster            |  String  |              | 多媒体封面内容                     |    Y     |
| language          |  String  | 系统自动匹配 | 语言以实现英文、中文简体、中文繁体 |    Y     |
| bulletAble        | Boolean  |              | 是否显示弹幕按钮                   |    N     |
| quality           | Boolean  |    false     | 是否显示清晰度按钮                 |    Y     |
| qualityData       |  Object  |   json数组   | 清晰度源，可配合quality使用        |    Y     |
| currentTime       |   int    |      0       | 初始化播放时间                     |    Y     |
| muted             | Boolean  |     true     | 静音                               |    Y     |
| volume            |   int    |      50      | 音量达效（0~100）                  |    Y     |
| playRate          | Boolean  |     true     | 显示播放速度按钮                   |    Y     |
| playRateData      |  Object  |   json数组   | 播放速率选项，可配合playRate使用   |    Y     |
| browserFullscreen | Boolean  |     true     | 是否显示网页全屏按钮               |    Y     |
| windowFullscreen  | Boolean  |     true     | 是否显示系统全屏按钮               |    Y     |
| browserFullscreen | Boolean  |     true     | 是否显示网页全屏按钮               |    Y     |
| pictureInPicture  | Boolean  |     true     | 是否显示画中画按钮                 |    Y     |
|                   | function |              | 加载完毕后                         |    N     |
|                   | function |              | 时长改变后                         |    N     |
|                   | function |              | 播放时                             |    N     |
|                   | function |              | 暂停时                             |    N     |
|                   | function |              | 播放结束                           |    N     |
|                   | function |              | 清晰度改变前                       |    N     |
|                   | function |              | 清晰度改变后                       |    N     |



## videoUI方法

| 名称   | 参数    | 方法说明   |
| ------ | ------- | ---------- |
| play   |         | 播放多媒体 |
| pause  |         | 暂停多媒体 |
| reload | options | 重新加载   |



## 案例

### 基础案例

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="shortcut icon" href="../media/images/favicon.ico" type="image/x-icon">
    <title>videoUI</title>
    <!-- 1、引入CSS -->
	<link href="../css/videoUI.css" rel="stylesheet"></head>
<body>
<div class="container">
    <!--2、video的容器 -->
    <div class="video-ui" style="width: 720px;height: 480px;margin: 10px auto"></div>
</div>
<!-- 3、引入JS -->
<script type="text/javascript" src="../js/videoUI.js"></script></body>
<script>
    //4、创建videoUI实例
    var vui = new VideoUI({//5、配置对象
        el: ".video-ui",
        qualityData: [{
            name: "4K",
            src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
            type: "video/mp4"
        }],
    });
</script>
</html>

```

![demo1](https://gitee.com/cnbrucelee/videoUI/raw/master/media/images/demo1.png)

### 设置初始化时画面

参数：playbackRate

值：true/false

```js

var vui = new VideoUI({//5、配置对象
    el: ".video-ui",
    //设置初始化时显示的画面
    poster: "../media/images/poster_img.png",
    qualityData: [{
        name: "4K",
        src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
        type: "video/mp4"
    }],
});
```

![demo2](https://gitee.com/cnbrucelee/videoUI/raw/master/media/images/demo2.png)

### 自定义播放速度

参数：playbackRateData

值：json数组

```js
var vui = new VideoUI({//5、配置对象
    el: ".video-ui",
    poster: "../media/images/poster_img.png",
    qualityData: [{
        name: "4K",
        src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
        type: "video/mp4"
    }],
    //自定义播放速度
    playRate: true,//显示选择播放速度按钮
    playRateData: [{
        name: "2.0X",
        value: "2.0",
        selected: false
    }, {
        name: "1.5X",
        value: "1.5",
        selected: false
    }, {
        name: "1.25X",
        value: "1.25",
        selected: false
    }, {
        name: "1.0X",
        value: "1.0",
        selected: true//当前选中的项目
    }, {
        name: "0.75X",
        value: "0.75",
        selected: false
    }, {
        name: "0.5X",
        value: "0.5",
        selected: false
    }],
});
```

![demo3](https://gitee.com/cnbrucelee/videoUI/raw/master/media/images/demo3.png)

### 音量调节

音量调节无需进行设置，样式如下：

![demo4](https://gitee.com/cnbrucelee/videoUI/raw/master/media/images/demo4.png)

可通过滑动音量条来调节音量的大小，也可以通过键盘左右键进行调节。

### 网页全屏

参数：browserFullscreen

值：true/false

```js
var vui = new VideoUI({//5、配置对象
    el: ".video-ui",
    //设置初始化时显示的画面
    poster: "../media/images/poster_img.png",
    qualityData: [{
        name: "4K",
        src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
        type: "video/mp4"
    }],
    browserFullscreen: true,//显示网页全屏按钮，默认为显示
});
```

网页全屏只占满浏览器窗口。

### 全屏播放

参数：windowFullscreen

值：true/false

```js

let vui = $(".video-ui").videoUi({
    el: ".video-ui",
    //设置初始化时显示的画面
    poster: "../media/images/poster_img.png",
    qualityData: [{
        name: "4K",
        src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
        type: "video/mp4"
    }],
    windowFullscreen: true,//显示全屏播放按钮，默认为显示
})

```

### 画中画播放

参数：pictureInPicture

值：true/false

~~~js
let vui = $(".video-ui").videoUi({
    el: ".video-ui",
    //设置初始化时显示的画面
    poster: "../media/images/poster_img.png",
    qualityData: [{
        name: "4K",
        src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
        type: "video/mp4"
    }],
    pictureInPicture: true,//显示画中画播放按钮，默认为显示
})

~~~

![demo5](https://gitee.com/cnbrucelee/videoUI/raw/master/media/images/demo5.png)



### 清晰度切换

参数：quality&qualityData

值：true/false

~~~js
let vui = $(".video-ui").videoUi({
    el: ".video-ui",
    //设置初始化时显示的画面
    poster: "../media/images/poster_img.png",
    quality: true,//显示清晰度选择按钮
    qualityData: [{//清晰度视频源
        name: "4K",
        src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
        type: "video/mp4",
        selected: false
    }, {
        name: "1080P 高清",
        src: "http://vjs.zencdn.net/v/oceans.mp4",
        type: "video/mp4",
        selected: true //当前选择项
    }, {
        name: "720P 高清",
        src: "https://media.w3.org/2010/05/sintel/trailer.mp4",
        type: "video/mp4",
        selected: false
    }]
})

~~~

![demo5](https://gitee.com/cnbrucelee/videoUI/raw/master/media/images/demo6.png)



### 设置语言

参数：language

值：zh-CN/zh-TW/en

~~~js
let vui = $(".video-ui").videoUi({
    el: ".video-ui",
    //设置初始化时显示的画面
    poster: "../media/images/poster_img.png",
    language: "en"//设置语言，默认根据系统环境自动匹配，已实现英文、中文简体、中文繁体
})

~~~

![demo5](https://gitee.com/cnbrucelee/videoUI/raw/master/media/images/demo7.png)



### 播放方法

方法名：play

```js
 let vui = new VideoUI({//5、配置对象
     el: ".video-ui",
     qualityData: [{
         name: "4K",
         src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
         type: "video/mp4"
     }],
 });
vui.play();//播放多媒体
```



### 暂停方法

方法名：pause

```js
let vui = new VideoUI({//5、配置对象
    el: ".video-ui",
    qualityData: [{
        name: "4K",
        src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
        type: "video/mp4"
    }],
 });
vui.pause();//暂停
```



### 重新加载

方法名：reload

```js
let vui = new VideoUI({//5、配置对象
    el: ".video-ui",
    qualityData: [{
        name: "4K",
        src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
        type: "video/mp4"
    }],
 });
vui.reload({
    poster: "../media/images/poster_img.png",
    qualityData: [{
        name: "4K",
        src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
        type: "video/mp4"
    }],
});
```



### 获取当前播放信息

方法名：reload

```js
var vui = new VideoUI({
    el: ".video-ui",
    poster: "../media/images/poster_img.png",
    qualityData: [{
        name: "4K",
        src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
        type: "video/mp4"
    }],
});
//视频加载完成后再获取
setTimeout(function () {
    console.log("当前播放进度：" + vui.currentTime);
    console.log("当前播放进度格式化后：" + vui.currentTimeFm1);
    console.log("总时长：" + vui.duration);
    console.log("总时长格式化：" + vui.durationFm1);
    console.log("当前音量：" + vui.volume);
}, 5000);

//-->输出
// 当前播放进度：3.845486
// 当前播放进度格式化后：00:03
// 总时长：60.095011
// 总时长格式化：01:00
// 当前音量：50
```

