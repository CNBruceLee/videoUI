# videoUI
HTML5 Video是现在HTML5 最流行的功能之一，得到了大多数最新版本的浏览器支持（包括IE9），也正是如此，在不同浏览器提供了不同的视频样式，在不同浏览器访问时样式不统一，我们制作自定义视频控件为了在所有的浏览器中有一个相同的视频控件而不受默认视频控件的控制。

videoUI是一个轻量级的前端控件，在不同浏览器下提供统一样式与操作。



## 样式

![demo0](https://gitee.com/cnbrucelee/videoUI/raw/master/multimedia/images/demo0.png)



## 实现的内容

- 视频的播放/暂停
- 时长与当前进度
- 播放速度
- 音量调节
- 网页全屏
- 全屏
- 画中画播放

## 样例

~~~ html
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
~~~

注：需要引入JQuery与字体库。详细说明参考帮助文档。

[帮助文档 GitHub](https://github.com/CNBruceLee/videoUI/blob/master/docs/guides/documentation.md)

[帮助文档 Gitee](https://gitee.com/cnbrucelee/videoUI/blob/master/docs/guides/documentation.md)

## 问题反馈列表

若使用过程中有优化建议可反馈在问题清单中，videoUI功能会不定期更新与完善，你们的问题就是我的动力。

[问题反馈 GitHub](https://github.com/CNBruceLee/videoUI/blob/master/问题清单.md)

[问题反馈 Gitee](https://gitee.com/cnbrucelee/videoUI/blob/master/问题清单.md)

## 相关资源

[源码 GitHub](https://github.com/CNBruceLee/videoUI)

[源码 Gitee](https://gitee.com/cnbrucelee/videoUI)

喜欢的点赞、收藏，你的支持就是我的动力！！！

