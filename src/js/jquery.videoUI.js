/*!
 * videoUI 0.1
 * https://github.com/CNBruceLee/videoUI
 * @license CNBruceLee licensed
 */
(function (global, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function ($) {
            return factory($, global, global.document, global.Math);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'), global, global.document, global.Math);
    } else {
        factory(jQuery, global, global.document, global.Math);
    }
})(typeof window !== 'undefined' ? window : this, function ($, window, document, Math, undefined) {
    'use strict';

    // keeping central set of classnames and selectors
    var WRAPPER = 'video-ui-wrapper';

    // util
    var ENABLED = 'vui-enabled';
    var ACTIVE = 'br-active';


    var $window = $(window);
    var $document = $(document);

    $.fn.videoUi = function (options) {

        // common jQuery objects
        // let $htmlBody = $('html, body');
        let $container = $(this);
        let vui = $.fn.videoUi;

        //jqueryObj
        vui.$video = null;

        //内部使用变量
        let $play_btn;
        let $control_bottom;
        let $control_favorite;
        let $video_container;
        let $time_current;
        let $time_duration;
        let $progress_bar;
        let $progress_load;
        let $progress_play;
        let $browserFullscreen;
        let $windowFullscreen;
        let $pictureInPicture;
        let $voice_bar;
        let $voice_current;
        let $voice_icon;
        let $speed_contents;


        let video;//video Dom

        let control_areas_timer;//鼠标3s不移动因此控制栏定时器
        let progress_drag = false;
        let voice_br_drag = false;
        let browserFullscreenStatus = false;

        //对外提供的属性
        vui.duration = 0;
        vui.currentTime = 0;
        vui.durationFm1 = "00:00";
        vui.currentTimeFm1 = "00:00";
        vui.bufferTimes = 0;
        vui.volume = 0;

        options = $.extend({
            windowFullscreen: true,
            pictureInPicture: true,
            browserFullscreen: true,
            playbackRate: true,
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
            }, {
                name: "0.5X",
                value: "0.5",
                selected: false
            }],
        }, options);

        //TODO 待实现功能
        options = $.extend(options, {
            bulletAble: false,
            quality: [],
        });

        if ($(this).length) {
            init();
            bindEvents();
        }

        function init() {
            prepareDom();
        }

        function prepareDom() {
            // 添加最外层容器
            $video_container = $("<div></div>").appendTo($container).addClass("br_video_container br_not_select br_no_touch");

            //视频元素添加
            createVideoContainerDom();

            //底部控制栏添加
            createVideoControlsDom();

            //加载顶部最爱元素加载
            createVideofavoriteDom();
        }

        //视频元素添加
        function createVideoContainerDom() {
            let video_wrapper = $("<div></div>").appendTo($video_container).addClass("br_video_wrapper");
            vui.$video = $("<video></video>").appendTo(video_wrapper).addClass("br_video_content");
            video = vui.$video[0];//转为dom对象
            let video_source = $("<source></source>").appendTo(vui.$video).addClass("br_video_source");
            $("<p></p>").appendTo(vui.$video).addClass("br-video-error").html("To view this video please enable JavaScript, and consider upgrading to a web browser");
            vui.$video.prop("preload", "auto");
            if (options.poster) vui.$video.prop("poster", options.poster);
            if (options.source) {
                if (options.source.src) video_source.prop("src", options.source.src);
                if (options.source.type) video_source.prop("type", options.source.type);
            }
        }

        //底部控制栏添加
        function createVideoControlsDom() {
            $control_bottom = $("<div></div>").appendTo($video_container).addClass("br_video_controls");

            //左侧控制栏
            let control_left = $("<div></div>").appendTo($control_bottom).addClass("br_control_left br_display_flex");
            // 播放暂停
            let play_toggle = $("<div></div>").appendTo(control_left).addClass("br_play_toggle br_btn");
            $play_btn = $("<div></div>").appendTo(play_toggle).addClass("iconfont_br icon_br_play");
            $("<div></div>").appendTo(play_toggle).addClass("br_tip_text").html("播放");

            // 播放进度
            let time_display = $("<div></div>").appendTo(control_left).addClass("br_time_display br_display_flex");
            $time_current = $("<div></div>").appendTo(time_display).addClass("br_time_current br_display_flex").html("00:00");
            $("<div></div>").appendTo(time_display).addClass("br_time_separator br_display_flex").html("/");
            $time_duration = $("<div></div>").appendTo(time_display).addClass("br_time_duration br_display_flex").html("00:00");

            // 进度条设置
            $progress_bar = $("<div></div>").appendTo($control_bottom).addClass("br_progress_bar");
            $progress_load = $("<div></div>").appendTo($progress_bar).addClass("br_progress_load");
            $progress_play = $("<div></div>").appendTo($progress_bar).addClass("br_progress_play");

            // 右侧控制栏
            let control_right = $("<div></div>").appendTo($control_bottom).addClass("br_control_right br_display_flex");
            // 弹幕
            if (options.bulletAble) {
                let bullet_toggle = $("<div></div>").appendTo(control_right).addClass("br_bullet_toggle br_btn");
                $("<div></div>").appendTo(bullet_toggle).addClass("iconfont_br icon_br_bullet_on");
                $("<div></div>").appendTo(bullet_toggle).addClass("br_tip_text").html("弹幕");
            }
            // 视频质量
            if (options.quality && options.quality.items && options.quality.items.length > 0) {
                let quality_select = $("<div></div>").appendTo(control_right).addClass("br_quality_select br_selects");
                $("<div></div>").appendTo(quality_select).addClass("iconfont_br icon_br_quality");
                let quality_contents = $("<div></div>").appendTo(quality_select).addClass("br_tip_text");

                let select_list_wrap = $("<div></div>").appendTo(quality_contents).addClass("br_select_list_wrap");
                let select_list = $("<ul></ul>").appendTo(select_list_wrap).addClass("br_select_list");
                options.quality.items.forEach(function (item, index) {
                    if (options.quality.selected == index) $("<li></li>").appendTo(select_list).addClass("br_select_item br_active").html(item);
                    else $("<li></li>").appendTo(select_list).addClass("br_select_item").html(item);
                })

            }
            // 播放速度
            if (options.playbackRate && options.playbackRateData && options.playbackRateData.length > 0) {
                let speed_select = $("<div></div>").appendTo(control_right).addClass("br_speed_select br_selects");
                $("<div></div>").appendTo(speed_select).addClass("iconfont_br icon_br_speedometer");
                let speed_contents = $("<div></div>").appendTo(speed_select).addClass("br_tip_text");

                $speed_contents = $("<div></div>").appendTo(speed_contents).addClass("br_select_list_wrap");
                let select_list = $("<ul></ul>").appendTo($speed_contents).addClass("br_select_list");
                options.playbackRateData.forEach(function (item, index) {
                    let select_item = $("<li></li>").appendTo(select_list);
                    select_item.addClass("br_select_item");
                    select_item.attr("data-value", item.value);
                    select_item.html(item.name ? item.name : item.value);
                    if (item.selected) select_item.addClass("br_active");
                })
            }
            // 音量设置
            let voice_wrapper = $("<div></div>").appendTo(control_right).addClass("br_voice_wrapper br_btn");
            $voice_icon = $("<div></div>").appendTo(voice_wrapper).addClass("iconfont_br icon_br_voice_on");
            let voice_content = $("<div></div>").appendTo(voice_wrapper).addClass("br_tip_text");
            let voice_drag = $("<div></div>").appendTo(voice_content).addClass("br_voice_drag");
            $voice_bar = $("<div></div>").appendTo(voice_drag).addClass("br_voice_range");
            $voice_current = $("<div></div>").appendTo($voice_bar).addClass("br_voice_current");

            //网页全屏
            if (options.browserFullscreen) {
                let browser_fullscreen = $("<div></div>").appendTo(control_right).addClass("br_browser_fullscreen br_btn");
                $browserFullscreen = $("<div></div>").appendTo(browser_fullscreen).addClass("iconfont_br icon_br_arrows_expand");
                $("<div></div>").appendTo(browser_fullscreen).addClass("br_tip_text").html("网页全屏");
            }

            //系统全屏
            if (options.windowFullscreen) {
                let window_fullscreen = $("<div></div>").appendTo(control_right).addClass("br_window_fullscreen br_btn");
                $windowFullscreen = $("<div></div>").appendTo(window_fullscreen).addClass("iconfont_br icon_br_full_expand");
                $("<div></div>").appendTo(window_fullscreen).addClass("br_tip_text").html("全屏");
            }
        }

        //加载顶部最爱元素加载
        function createVideofavoriteDom() {
            $control_favorite = $("<div></div>").appendTo($video_container).addClass("br_favorite");
            let favorite_controls = $("<div></div>").appendTo($control_favorite).addClass("br_favorite_controls br_display_flex");
            if (options.pictureInPicture) {
                $pictureInPicture = $("<div></div>").appendTo(favorite_controls).addClass("br_pip_btn br_btn br_display_flex");
                $("<div></div>").appendTo($pictureInPicture).addClass("iconfont_br icon_br_pip");
                $("<div></div>").appendTo($pictureInPicture).addClass("br_tip_text").html("画中画");
            }
        }


        function bindEvents() {
            /*********************************video初始化*************************************/
            video.oncanplay = initVideo;

            /*********************************播放暂停事件*************************************/
            $play_btn.click(playStatusChange.bind($play_btn));
            vui.$video.click(playStatusChange.bind($play_btn));

            //添加播放与暂停播放时运行的事件处理、如系统蓝牙断开连接而暂停播放，可设置播放状态
            video.onpause = onpause;
            video.onplay = onplay;

            /******************************鼠标2s不移动因此控制台********************************/
            $video_container.mousemove(mouseNoMoveHiddenControlAreas);
            $video_container.mouseleave(mouseOutHiddenControlAreas);

            /******************************video播放事件********************************/
            video.ontimeupdate = ontimeupdate;//媒体播放进度改变事件
            video.onprogress = onBufferTimes;//媒体加载进度改变事件
            video.onended = playEnded;
            // video.onwaiting //当视频由于需要缓冲下一帧而停止时

            $progress_bar.click(jumpPlay);//点击跳播
            //鼠标拖拽改变进度实现，按下 拖拽 抬起或移出停止
            $progress_bar.mousedown(() => progress_drag = true);
            $progress_bar.mouseup(() => progress_drag = false);
            $progress_bar.mouseleave(() => progress_drag = false);//鼠标未抬起，但是出范围了也认为结束
            $progress_bar.mousemove(dragJumpPlay);

            /******************************video音量事件********************************/
            $voice_icon.click(voiceIconClick);//点击图标静音或者开启声音
            $voice_bar.click(voiceBarClick);//点击音量条设置音量

            //鼠标拖拽改音量，按下 拖拽 抬起或移出停止
            $voice_bar.mousedown(() => voice_br_drag = true);
            $voice_bar.mouseup(() => voice_br_drag = false);
            $voice_bar.mouseleave(() => voice_br_drag = false);//鼠标未抬起，但是出范围了也认为结束
            $voice_bar.mousemove(dragVoiceBar);

            /******************************倍速播放********************************/

            if ($speed_contents) $speed_contents.on("click", ".br_select_item", playbackRateClick);

            /******************************网页全屏********************************/
            $browserFullscreen.click(browserFullscreen);

            /******************************系统全屏********************************/
            $windowFullscreen.click(windowFullscreen);

            /******************************画中画********************************/
            $pictureInPicture.click(pictureInPicture);
            video.addEventListener("enterpictureinpicture", enterpictureinpicture);
            video.addEventListener("leavepictureinpicture", leavepictureinpicture);
        }

        function initVideo() {
            vui.duration = video.duration;
            vui.volume = video.volume * 100;//video音量最大为1,为方便计算转为百分制
            vui.durationFm1 = durationFm1(vui.duration);
            $time_duration.html(vui.durationFm1);
            onBufferTimes();
            initVolume();
            if ($speed_contents) iniPlaybackRate();//如果有倍速播放则初始化倍速
        }

        function ontimeupdate() {
            //1、更新当前播放时间，及更改当前进度条
            vui.currentTime = video.currentTime;
            vui.currentTimeFm1 = durationFm1(vui.currentTime);
            $time_current.html(vui.currentTimeFm1);

            // 2、实现播放进度条的自动变化 通过进度百分比实现进度条
            $progress_play.css("width", vui.currentTime / vui.duration * 100 + "%");
        }

        function initVolume() {
            // vui.volume
            if (vui.volume == 0) {//声音为0则是静音
                voiceMuteStyel();
            } else {
                voiceVocalStyle();
            }
            $voice_current.css("height", vui.volume + "%");
        }

        //初始化时设置播放的倍速
        function iniPlaybackRate() {
            if (options.playbackRateData && options.playbackRateData.length > 0) {
                let playbackRateSelect = options.playbackRateData.find(item => item.selected == true)
                if (playbackRateSelect && playbackRateSelect.value) {
                    video.playbackRate = playbackRateSelect.value;
                } else {
                    if (options.playbackRateData[0] && options.playbackRateData[0].value) {
                        video.playbackRate = options.playbackRateData[0].value;
                        $speed_contents.find(".br_select_item").first().addClass("br_active");
                    }

                }
            }

        }

        //视频加载事件
        function onBufferTimes() {
            var d = new Date();
            // console.log(d.getTime());
            //1、更新当前播放时间，及更改当前进度条
            if (video.buffered.length > 0) vui.bufferTimes = video.buffered.end(video.buffered.length - 1);
            // 2、实现播放进度条的自动变化 通过进度百分比实现进度条
            $progress_load.css("width", vui.bufferTimes / vui.duration * 100 + "%");
            // console.log(vui.bufferTimes / vui.duration * 100 + "%");
        }

        //播放结束时调用此方法
        function playEnded() {
            $play_btn.next(".br_tip_text").html("重新播放")
            $play_btn.addClass("icon_br_refresh").removeClass("icon_br_play");
        }

        //视频播放时长格式化 3730s -> 01:02:10s
        function durationFm1(num) {
            let hour = numFm1(Math.floor(num / 3600), 2);
            let minute = numFm1(Math.floor(num % 3600 / 60), 2)
            let second = numFm1(Math.floor(num % 60), 2);
            return hour === "00" ? minute + ":" + second : hour + ":" + minute + ":" + second;
        }

        //格式化 不足的补足，如：1->01
        function numFm1(num, length) {
            return (Array(length).join('0') + num).slice(-length);
        }

        function playStatusChange() {
            if (video.paused) {
                video.play();
                onplay()
            } else {
                video.pause();
                onpause();
            }
        }

        function showControlAreas() {
            $control_bottom.addClass("br_show").removeClass("br_hidden");
            $control_favorite.addClass("br_show").removeClass("br_hidden");
        }

        function hiddenControlAreas() {
            $control_bottom.addClass("br_hidden").removeClass("br_show");
            $control_favorite.addClass("br_hidden").removeClass("br_show");
        }

        /**
         * 播放状态下鼠标3s不移动因此控制栏
         */
        function mouseNoMoveHiddenControlAreas() {
            showControlAreas();
            if (control_areas_timer) {
                clearTimeout(control_areas_timer);
                control_areas_timer = null;
            }
            control_areas_timer = setTimeout(function () {
                if (!video.paused) {//只有播放状态下有效
                    hiddenControlAreas();
                }
            }, 3000);
        }

        function mouseOutHiddenControlAreas() {
            if (!video.paused) {//只有播放状态下有效
                hiddenControlAreas();
            }
        }

        //当播放暂停时更改样式
        function onpause() {
            $play_btn.next(".br_tip_text").html("播放")
            $play_btn.addClass("icon_br_play").removeClass("icon_br_pause");
            showControlAreas();
        }

        //当播放开始时更改样式
        function onplay() {
            $play_btn.next(".br_tip_text").html("暂停")
            $play_btn.addClass("icon_br_pause").removeClass("icon_br_play");
        }

        //跳播
        function jumpPlay(e) {
            let clientPointX = e.offsetX;
            let widthTotal = $progress_bar.width();
            // console.log(clientPointX + "  " + widthTotal);
            //2、计算点击位置的视频时长，并改变当前时长
            video.currentTime = clientPointX / widthTotal * vui.duration;
            ontimeupdate();
            if (video.paused) {//如果视频暂停了 拖动进度条后自动开始播放
                video.play();
                onplay()
            }
        }


        //拖拽跳播
        function dragJumpPlay(e) {
            if (progress_drag) {
                jumpPlay(e);
            }
        }

        //音量设置
        function voiceBarClick(e) {
            // let clientPointY = e.offsetY;//不能使用offsetY作为高度值，因为鼠标移动到子元素中后返回的为子元素值，不是希望的值
            let clientPointY = Math.round(e.pageY - $voice_bar.offset().top + 1);
            let heightTotal = $voice_bar.height();
            //限制范围 因头部样式防止超出量程
            clientPointY = clientPointY < 0 ? 0 : clientPointY;
            clientPointY = clientPointY > heightTotal ? heightTotal : clientPointY;
            video.volume = (heightTotal - clientPointY) / heightTotal;
            vui.volume = video.volume * 100;
            if (video.muted && vui.volume > 0) video.muted = false;//当点击音量条时解除影音
            initVolume();
        }

        //拖拽调整音量
        function dragVoiceBar(e) {
            if (voice_br_drag) {
                voiceBarClick(e);
            }
        }

        //播放速度选择
        function playbackRateClick(e) {
            // console.log($(e.target).data("value"));
            console.log($(this).data("value"));
            video.playbackRate = $(this).data("value");
            $speed_contents.find(".br_select_item").removeClass("br_active");
            $(this).addClass("br_active");
        }

        //点击图标静音或者开启音量
        function voiceIconClick() {
            if (video.muted) {//解除静音
                video.muted = false;
                voiceVocalStyle();//有声样式
            } else {//静音
                video.muted = true;
                voiceMuteStyel();//静音样式
            }
        }

        //静音样式
        function voiceMuteStyel() {
            $voice_icon.addClass("icon_br_voice_off").removeClass("icon_br_voice_on");
            $voice_current.css("height", "0%");
        }

        //有声样式
        function voiceVocalStyle() {
            $voice_icon.addClass("icon_br_voice_on").removeClass("icon_br_voice_off");
            $voice_current.css("height", vui.volume + "%");
        }

        function browserFullscreen() {
            if (browserFullscreenStatus) {//退出网页全屏
                $video_container.removeClass("br_fixed");
                $browserFullscreen.addClass("icon_br_arrows_expand").removeClass("icon_br_arrows_compress");
                $browserFullscreen.next(".br_tip_text").html("网页全屏")
                browserFullscreenStatus = false;
            } else {//网页全屏
                $video_container.addClass("br_fixed");
                $browserFullscreen.addClass("icon_br_arrows_compress").removeClass("icon_br_arrows_expand");
                $browserFullscreen.next(".br_tip_text").html("退出网页全屏")
                browserFullscreenStatus = true;
            }

        }

        function windowFullscreen() {
            if (document.fullscreenElement || //Chrome也跟着淘气了 screen 为小写
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenEnabled || //IE一如既往 screen 为小写 与Enabled后缀
                document.oFullScreenElement) {
                //使用能力测试 添加不通浏览器下的前缀
                if (document.cancelFullScreen) {//退出全屏时候只能使用document实现
                    document.cancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {// IE下 又搞特殊的事情了，拖出去斩了
                    document.msExitFullscreen();
                } else if (document.oCancelFullScreen) {
                    document.oCancelFullScreen();
                } else {
                    console.log("所在的浏览器不支持全屏")
                }
                $windowFullscreen.next(".br_tip_text").html("全屏");
                $windowFullscreen.removeClass("icon_br_full_compress").addClass("icon_br_full_expand");
            } else {//进入全屏
                //使用能力测试 添加不通浏览器下的前缀
                if ($video_container[0].requestFullscreen) {
                    $video_container[0].requestFullscreen();
                } else if ($video_container[0].webkitRequestFullScreen) {
                    $video_container[0].webkitRequestFullScreen();
                } else if ($video_container[0].mozRequestFullScreen) {
                    $video_container[0].mozRequestFullScreen();
                } else if ($video_container[0].msRequestFullscreen) {
                    $video_container[0].msRequestFullscreen();  // IE下 screen为小写  因此看出IE就算支持了也不标准，不规范
                } else if ($video_container[0].oRequestFullScreen) {
                    $video_container[0].oRequestFullScreen();
                } else {
                    console.log("所在的浏览器不支持全屏")
                }
                $windowFullscreen.next(".br_tip_text").html("退出全屏");
                $windowFullscreen.removeClass("icon_br_full_expand").addClass("icon_br_full_compress");
            }
        }

        function pictureInPicture() {
            if (!document.pictureInPictureElement) {//开启
                video.requestPictureInPicture().catch(error => {
                    // console.log(error, 'Video failed to enter Picture-in-Picture mode.');
                });
            } else {//关闭
                document.exitPictureInPicture().catch(error => {
                    // console.log(error, 'Video failed to leave Picture-in-Picture mode.');
                });
            }
        }

        function enterpictureinpicture() {
            $pictureInPicture.find(".br_tip_text").html("画中画使用中");
        }

        function leavepictureinpicture() {
            $pictureInPicture.find(".br_tip_text").html("画中画");
        }

        //对外提供的function
        vui.play = function () {
            video.play();
            // throw new Error(1, "aaaa");
            onplay();
            hiddenControlAreas();
        }
        vui.pause = function () {
            video.pause();
            onpause();
        }


        // 控制栏初始化
        if (video.paused) showControlAreas();
        else hiddenControlAreas();

        // 返回vui
        return vui;
    };
});