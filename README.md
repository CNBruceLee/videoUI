# videoUI
HTML5 Video是现在HTML5 最流行的功能之一，得到了大多数最新版本的浏览器支持，也正是如此，在不同浏览器提供了不同的视频样式，在不同浏览器访问时样式不统一，我们制作自定义视频控件为了在所有的浏览器中有一个相同的视频控件而不受默认视频控件的控制。

videoUI是一个轻量级的前端控件，在不同浏览器下提供统一样式与操作。

[![AUR](https://img.shields.io/badge/license-Apache%20License%202.0-blue.svg)](https://gitee.com/cnbrucelee/videoUI/blob/master/LICENSE)


## 样式

![demo0](https://gitee.com/cnbrucelee/videoUI/raw/master/media/images/demo0.gif)



## 实现的内容

- 视频的播放/暂停
- 时长与当前进度
- 清晰度切换
- 播放速度
- 音量调节
- 网页全屏
- 全屏
- 画中画播放
- 语言选择
- 键盘左右键快进
- 键盘上下键调节音量
- 加载中显示加载图标
- 消息提示

2021-06-06更新
- 键盘空格键暂停与播放

  
## 样例

~~~ html
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



[帮助文档 GitHub](https://github.com/CNBruceLee/videoUI/blob/master/docs/guides/documentation.md)

[帮助文档 Gitee](https://gitee.com/cnbrucelee/videoUI/blob/master/docs/guides/documentation.md)



## 相关资源

[源码 GitHub](https://github.com/CNBruceLee/videoUI)

[源码 Gitee](https://gitee.com/cnbrucelee/videoUI)

喜欢的点赞、收藏，你的支持就是我的动力！！！

