# videoUI 帮助文档

## 属性

| 名称              | 类型    | 默认     | 描述                   |
| ----------------- | ------- | -------- | ---------------------- |
| poster            | String  |          | 多媒体封面内容         |
| source            | Object  |          | 播放的数据源于格式     |
| windowFullscreen  | Boolean | true     | 是否显示全屏按钮       |
| pictureInPicture  | Boolean | true     | 是否显示画中画播放按钮 |
| browserFullscreen | Boolean | true     | 是否显示网页全屏按钮   |
| playbackRate      | Boolean | true     | 是否显示播放速率按钮   |
| playbackRateData  | Object  | json数组 | 播放速率自定义项       |



## 方法

| 名称  | 方法说明   |
| ----- | ---------- |
| play  | 播放多媒体 |
| pause | 暂停多媒体 |

## 案例

### 基础案例

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>videoUI</title>
    <link rel="stylesheet" href="../../components/iconfont-br/iconfont.css">
    <link rel="stylesheet" href="../../src/css/jquery.videoUI.css">
    <style>
        .container .video-ui {
            width: 720px;
            height: 480px;
            margin: 10px auto;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="video-ui"></div>
</div>

</body>
<script src="../../components/jquery/jquery-3.4.1.js"></script>
<script src="../../src/js/jquery.videoUI.js"></script>

<script>
    $(function () {
        let vui = $(".video-ui").videoUi({
            poster: "../../multimedia/images/poster_img.png",
            source: {
                src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
                // src: "http://vjs.zencdn.net/v/oceans.mp4",
                // src: "../../multimedia/videos/star.mp4",
                type: "video/mp4",
            },
        })
    });
</script>
</html>
```

![demo1](https://gitee.com/cnbrucelee/videoUI/raw/master/multimedia/images/demo1.png)

### 禁用播放速度

参数：playbackRate

值：true/false

```js
$(function () {
    let vui = $(".video-ui").videoUi({
        poster: "../../multimedia/images/poster_img.png",
        source: {
            src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
            // src: "http://vjs.zencdn.net/v/oceans.mp4",
            // src: "../../multimedia/videos/star.mp4",
            type: "video/mp4",
        },
        playbackRate: false,//设置显示播放速度按钮
    })
});
```

![demo2](https://gitee.com/cnbrucelee/videoUI/raw/master/multimedia/images/demo2.png)

### 自定义播放速度

参数：playbackRateData

值：json数组

```js
$(function () {
        let vui = $(".video-ui").videoUi({
            poster: "../../multimedia/images/poster_img.png",
            source: {
                src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
                // src: "http://vjs.zencdn.net/v/oceans.mp4",
                // src: "../../multimedia/videos/star.mp4",
                type: "video/mp4",
            },
            playbackRate: true,//设置true 自定义播放速度才能生效
            playbackRateData: [{
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
                selected: true
            }, {
                name: "0.75X",
                value: "0.75",
                selected: false
            }],
        })
    });
```

![demo3](https://gitee.com/cnbrucelee/videoUI/raw/master/multimedia/images/demo3.png)

### 音量调节

音量调节无需进行设置，样式如下：

![demo4](https://gitee.com/cnbrucelee/videoUI/raw/master/multimedia/images/demo4.png)

可通过滑动音量条来调节音量的大小。

### 网页全屏

参数：browserFullscreen

值：true/false

```js
$(function () {
    let vui = $(".video-ui").videoUi({
        poster: "../../multimedia/images/poster_img.png",
        source: {
            src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
            // src: "http://vjs.zencdn.net/v/oceans.mp4",
            // src: "../../multimedia/videos/star.mp4",
            type: "video/mp4",
        },
        browserFullscreen: true,//显示网页全屏播放按钮。
    })
});
```

网页全屏只占满浏览器窗口。

### 全屏播放

参数：windowFullscreen

值：true/false

```js
$(function () {
    let vui = $(".video-ui").videoUi({
        poster: "../../multimedia/images/poster_img.png",
        source: {
            src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
            // src: "http://vjs.zencdn.net/v/oceans.mp4",
            // src: "../../multimedia/videos/star.mp4",
            type: "video/mp4",
        },
        windowFullscreen: true,//显示全屏播放的按钮。
    })
});
```

### 画中画播放

参数：pictureInPicture

值：true/false

~~~js
$(function () {
    let vui = $(".video-ui").videoUi({
        poster: "../../multimedia/images/poster_img.png",
        source: {
            src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
            // src: "http://vjs.zencdn.net/v/oceans.mp4",
            // src: "../../multimedia/videos/star.mp4",
            type: "video/mp4",
        },
        pictureInPicture: true,//显示画中画播放按钮
    })
});
~~~

![demo5](https://gitee.com/cnbrucelee/videoUI/raw/master/multimedia/images/demo5.png)



### 播放方法

方法名：play

```js
$(function () {
    let vui = $(".video-ui").videoUi({
        poster: "../../multimedia/images/poster_img.png",
        source: {
            src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
            // src: "http://vjs.zencdn.net/v/oceans.mp4",
            // src: "../../multimedia/videos/star.mp4",
            type: "video/mp4",
        },
    })
});
vui.play();//播放多媒体
```



### 暂停方法

方法名：pause

```js
$(function () {
    let vui = $(".video-ui").videoUi({
        poster: "../../multimedia/images/poster_img.png",
        source: {
            src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
            // src: "http://vjs.zencdn.net/v/oceans.mp4",
            // src: "../../multimedia/videos/star.mp4",
            type: "video/mp4",
        },
    })
});
vui.pause();//暂停
```

