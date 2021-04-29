const $ = require("jquery");
import keycode from 'keycode';

//导入语言包
const languages = (() => {
    const requireContext = require.context('/lang/', false, /\.json$/);
    const json = {};
    requireContext.keys().forEach((key) => {
        const obj = requireContext(key);
        const simpleKey = key.split('/').pop().split('.').shift();
        json[simpleKey] = obj;
    });
    return json;
})()

class VideoUI {

    constructor(options) {
        this.options = $.extend({
            windowFullscreen: true,
            pictureInPicture: true,
            browserFullscreen: true,
            language: navigator && (navigator.languages && navigator.languages[0] || navigator.userLanguage || navigator.language) || 'zh-CN',
            isPC: !(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)),
            quality: false,
            muted: true,
            playRate: true,
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
        $.extend(this.options, {
            bulletAble: false,
        });

        this.options.$el = $(this.options.el);
        init.call(this);
    }

    /*********************************对外提供的方法*************************************/

    /**
     * 播放
     */
    play() {
        videoPlay.call(this);
    }

    /**
     * 暂停
     */
    pause() {
        videoPause.call(this);
    }

    /**
     * 重新加载
     */
    reload(options) {
        reloadVideo.call(this, options);
    }

    //加载完毕后

    //时长改变后

    //播放时

    //暂停时

    //播放结束

    //清晰度改变前

    //清晰度改变后

    //获取时长

    //获取当前时间

    //获取音量


}


function init(callback, params) {
    if (this.options.el.length) {
        prepareDom.call(this);
        bindEvents.call(this);
    }
    commonCallback.call(this, callback, params);
}


function prepareDom() {

    // 添加最外层容器
    this.$videoContainer = $("<div></div>").appendTo(this.options.$el).addClass("br-video-container");
    this.$videoContainer.attr("tabindex", 0);

    //视频元素添加
    createVideoContainerDom.call(this);

    //弹幕元素添加
    createVideoBulletDom.call(this);

    //中部播放状态添加
    createVideoMidStateDom.call(this);


    //底部控制栏添加
    createVideoControlsDom.call(this);

    //加载顶部最爱元素加载
    createVideofavoriteDom.call(this);

    //信息提示栏
    createVideoMsgWrapper.call(this);
}


function bindEvents() {

    /*********************************video初始化*************************************/
    //不能使用 oncanplay 此方法在改变时长可以播放时候也会触发，因此还会执行initVideo
    this.video.onloadeddata = initVideo.bind(this);

    /*********************************播放暂停事件*************************************/
    this.$playBtn.click(playStatusChange.bind(this));
    // this.$video.click(playStatusChange.bind(this));
    this.$video.click(clickVideoDom.bind(this));//双击时发生2次单机事件，用定时器取代
    this.$videoMidState.click(playStatusChange.bind(this));

    // 添加播放与暂停播放时运行的事件处理、如系统蓝牙断开连接而暂停播放，可设置播放状态
    this.video.onpause = showPause.bind(this);
    this.video.onplay = showPlay.bind(this);

    /******************************鼠标2s不移动隐藏控制面板********************************/
    this.$videoContainer.mousemove(mouseNoMoveHiddenControlAreas.bind(this));
    this.$videoContainer.mouseleave(mouseOutHiddenControlAreas.bind(this));

    /******************************video播放事件********************************/
    this.video.ontimeupdate = videoCanplay.bind(this);//加载中屏幕显示加载图标 但是.oncanplay 有时不触发用ontimeupdate代替
    // this.video.ontimeupdate = videoTimeUpdate.bind(this);//媒体播放进度改变事件 使用定时器代替
    this.video.onprogress = onBufferTimes.bind(this);//媒体加载进度改变事件
    this.video.onended = playEnded.bind(this);//播放结束
    this.$progressRange.click(jumpPlay.bind(this));//点击跳播

    dragElement.call(this, this.$progressPlayDrag[0], this.$progressRange[0], "x", dragInProgress, dragEndProgress);//拖拽播放
    this.$progressBar.mousemove(showProgressPreview.bind(this));//鼠标放在进度条整显示预览及所处位置的播放时长

    /******************************video 正在加载事件********************************/
    this.video.onwaiting = videoWaiting.bind(this);//视频等待加载时触发
    this.video.oncanplay = videoCanplay.bind(this);//视频可以播放时触发

    /******************************清晰度选择********************************/
    if (this.$qualityContents) this.$qualityContents.on("click", ".br-select-item", qualityClick.bind(this));

    /******************************倍速播放********************************/
    if (this.$speedContents) this.$speedContents.on("click", ".br-select-item", playbackRateClick.bind(this));

    /******************************video音量事件********************************/
    this.$voiceIcon.click(voiceIconClick.bind(this));//点击图标静音或者开启声音
    this.$voiceRange.click(voiceRangeClick.bind(this));//点击音量条设置音量
    dragElement.call(this, this.$voiceDrag[0], this.$voiceRange[0], "y", dragInvoice);//鼠标拖拽改音量

    /******************************网页全屏********************************/
    this.$browserFullscreen.click(browserFullscreen.bind(this));

    /******************************系统全屏********************************/
    this.$windowFullscreen.click(windowFullscreen.bind(this));

    /******************************画中画********************************/
    this.$pictureInPicture.click(pictureInPicture.bind(this));
    this.video.addEventListener("enterpictureinpicture", enterpictureinpicture.bind(this));
    this.video.addEventListener("leavepictureinpicture", leavepictureinpicture.bind(this));


    /******************************绑定键盘按钮事件********************************/
    //要想让div监听键盘事件需具备2个要素 1、div中有tabindex属性  2、获取焦点(此处经验证可以省略，若获得焦点IE有黑框)
    // this.$videoContainer.click(() => this.$videoContainer.focus());
    this.$videoContainer.keydown(keydownListener.bind(this));

    /******************************鼠标双击全屏********************************/
    // this.$video.dblclick(windowFullscreen.bind(this));
    this.$video.dblclick(dbClickVideoDom.bind(this));
}

/**
 * 初始化时设置播放的倍速
 */
function initPlaybackRate() {
    this.playbackRate = 1;
    let rateSelectEl;
    let rateSelected = false;
    if (this.options.playRateData && this.options.playRateData.length) {
        rateSelected = this.options.playRateData.some(item => {//有匹配到所选元素
            if (item.selected === true) {
                this.playbackRate = item.value;
                rateSelectEl = $(".br-speed-select .br-active");
                return true;
            }
            return false;
        });

        if (rateSelected === false) {//未选到默认取第一个
            if (this.options.playRateData[0] && this.options.playRateData[0].value) {
                this.playbackRate = this.options.playRateData[0].value;
                rateSelectEl = $(".br-speed-select li").first();
            }
        }
    }
    setPlaybackRate.call(this, this.playbackRate, rateSelectEl);
}

function createVideoContainerDom() {

    let qualitySrc;
    let qualityType;
    let qualitySelected = false;
    if (this.options.qualityData && this.options.qualityData.length) {
        qualitySelected = this.options.qualityData.some(item => {//有匹配到所选元素
            if (item.selected === true) {
                qualitySrc = item.src;
                qualityType = item.type;
                return true;
            }
            return false;
        });

        if (isEmpty(qualitySrc)) {//未选到默认取第一个
            if (this.options.qualityData[0]) {
                qualitySrc = this.options.qualityData[0].src;
                qualityType = this.options.qualityData[0].type;
            }
        }
    }

    let videoWrapper = $("<div></div>").appendTo(this.$videoContainer).addClass("br-video-wrapper br-not-select br-no-touch");
    this.$video = $("<video></video>").appendTo(videoWrapper).addClass("br-video-content");
    this.video = this.$video[0];//转为dom对象
    this.$videoSource = $("<source></source>").appendTo(this.$video).addClass("br-video-source");
    $("<p></p>").appendTo(this.$video).addClass("br-video-error").html(getTextDesc.call(this, "Browser did not support"));
    this.$video.prop("preload", "auto");//auto none
    if (this.options.poster) this.$video.prop("poster", this.options.poster);

    if (!isEmpty(qualitySrc)) this.$videoSource.prop("src", qualitySrc);
    if (!isEmpty(qualityType)) this.$videoSource.prop("type", qualityType);
}

/**
 * 添加弹幕节点
 */
function createVideoBulletDom() {
    $("<div></div>").appendTo(this.$videoContainer).addClass("br-bullet-wrapper");
}

/**
 * 添加视频中间状态栏节点 用于显示loading与暂停按钮
 */
function createVideoMidStateDom() {
    this.$videoMidState = $("<div></div>").appendTo(this.$videoContainer).addClass("br-video-state");
    $("<div class='iconfont-br icon-br-play'></div>").appendTo(this.$videoMidState);
}


//底部控制栏添加
function createVideoControlsDom() {
    this.$controlBottom = $("<div></div>").appendTo(this.$videoContainer).addClass("br-video-controls");

    //左侧控制栏
    let controlLeft = $("<div></div>").appendTo(this.$controlBottom).addClass("br-control-left br-display-flex");
    // 播放暂停
    let playToggle = $("<div></div>").appendTo(controlLeft).addClass("br-play-toggle br-btn");
    this.$playBtn = $("<div></div>").appendTo(playToggle).addClass("iconfont-br icon-br-play");
    $("<div></div>").appendTo(playToggle).addClass("br-tip-text").html(getTextDesc.call(this, "Play"));

    // 播放进度
    let timeDisplay = $("<div></div>").appendTo(controlLeft).addClass("br-time-display br-display-flex br-not-select br-no-touch");
    this.$timeCurrent = $("<div></div>").appendTo(timeDisplay).addClass("br-time-current").html("00:00");
    $("<div></div>").appendTo(timeDisplay).addClass("br-time-separator").html("/");
    this.$timeDuration = $("<div></div>").appendTo(timeDisplay).addClass("br-time-duration").html("00:00");

    // 进度条设置
    this.$progressBar = $("<div></div>").appendTo(this.$controlBottom).addClass("br-progress-bar");
    this.$progressPreview = $("<div></div>").appendTo(this.$progressBar).addClass("br-progress-preview br-not-select br-no-touch");
    this.$progressPointTime = $("<div></div>").appendTo(this.$progressPreview).addClass("br-progress-point-time");

    this.$progressPlayDrag = $("<div></div>").appendTo(this.$progressBar).addClass("br-progress-play-drag");
    this.$progressRange = $("<div></div>").appendTo(this.$progressBar).addClass("br-progress-range");
    this.$progressLoad = $("<div></div>").appendTo(this.$progressRange).addClass("br-progress-load");
    this.$progressCurrent = $("<div></div>").appendTo(this.$progressRange).addClass("br-progress-current");

    // 右侧控制栏
    let controlRight = $("<div></div>").appendTo(this.$controlBottom).addClass("br-control-right br-display-flex");
    // 弹幕
    if (this.options.bulletAble) {
        let bulletToggle = $("<div></div>").appendTo(controlRight).addClass("br-bullet-toggle br-btn");
        $("<div></div>").appendTo(bulletToggle).addClass("iconfont-br icon-br-bullet-on");
        $("<div></div>").appendTo(bulletToggle).addClass("br-tip-text").html(getTextDesc.call(this, "bullet screen"));
    }
    // 视频质量
    if (this.options.quality && this.options.qualityData && this.options.qualityData.length > 0) {
        let qualitySelect = $("<div></div>").appendTo(controlRight).addClass("br-quality-select br-selects");
        $("<div></div>").appendTo(qualitySelect).addClass("iconfont-br icon-br-quality");
        this.$qualityContents = $("<div></div>").appendTo(qualitySelect).addClass("br-tip-text");

        let selectListWrap = $("<div></div>").appendTo(this.$qualityContents).addClass("br-select-list-wrap");
        let selectList = $("<ul></ul>").appendTo(selectListWrap).addClass("br-select-list br-not-select br-no-touch");
        this.options.qualityData.forEach(function (item, index) {
            let selectItem = $("<li></li>").appendTo(selectList);
            selectItem.addClass("br-select-item");
            selectItem.attr("data-src", item.src);
            selectItem.attr("data-type", item.type);
            selectItem.html(item.name ? item.name : item.src);
            if (item.selected) selectItem.addClass("br-active");
        })
        if (selectList.find(".br-select-item br-active")) {//未选到默认取第一个
            selectList.children(".br-select-item").first().addClass("br-active");
        }
    }
    // 播放速度
    if (this.options.playRate && this.options.playRateData && this.options.playRateData.length > 0) {
        let speedSelect = $("<div></div>").appendTo(controlRight).addClass("br-speed-select br-selects");
        $("<div></div>").appendTo(speedSelect).addClass("iconfont-br icon-br-speedometer");
        let speedContents = $("<div></div>").appendTo(speedSelect).addClass("br-tip-text");

        this.$speedContents = $("<div></div>").appendTo(speedContents).addClass("br-select-list-wrap");
        let selectList = $("<ul></ul>").appendTo(this.$speedContents).addClass("br-select-list br-not-select br-no-touch");
        this.options.playRateData.forEach(function (item, index) {
            let selectItem = $("<li></li>").appendTo(selectList);
            selectItem.addClass("br-select-item");
            selectItem.attr("data-value", item.value);
            selectItem.html(item.name ? item.name : item.value);
            if (item.selected) selectItem.addClass("br-active");
        })
    }
    // 音量设置
    let voiceBar = $("<div></div>").appendTo(controlRight).addClass("br-voice-bar br-btn");
    this.$voiceIcon = $("<div></div>").appendTo(voiceBar).addClass("iconfont-br icon-br-voice-on");
    let voiceContent = $("<div></div>").appendTo(voiceBar).addClass("br-tip-text");
    this.$voiceInfo = $("<div></div>").appendTo(voiceContent).addClass("br-voice-info br-not-select br-no-touch");
    this.$voiceRange = $("<div></div>").appendTo(voiceContent).addClass("br-voice-range");
    this.$voiceDrag = $("<div></div>").appendTo(this.$voiceRange).addClass("br-voice-drag");
    this.$voiceCurrent = $("<div></div>").appendTo(this.$voiceRange).addClass("br-voice-current");

    //网页全屏
    if (this.options.browserFullscreen) {
        let browserFullscreen = $("<div></div>").appendTo(controlRight).addClass("br-browser-fullscreen br-btn");
        this.$browserFullscreen = $("<div></div>").appendTo(browserFullscreen).addClass("iconfont-br icon-br-arrows-expand");
        $("<div></div>").appendTo(browserFullscreen).addClass("br-tip-text").html(getTextDesc.call(this, "Browser Fullscreen"));
    }

    //系统全屏
    if (this.options.windowFullscreen) {
        let windowFullscreen = $("<div></div>").appendTo(controlRight).addClass("br-window-fullscreen br-btn");
        this.$windowFullscreen = $("<div></div>").appendTo(windowFullscreen).addClass("iconfont-br icon-br-full-expand");
        $("<div></div>").appendTo(windowFullscreen).addClass("br-tip-text").html(getTextDesc.call(this, "Fullscreen"));
    }
}

//加载顶部最爱元素加载
function createVideofavoriteDom() {
    this.$controlFavorite = $("<div></div>").appendTo(this.$videoContainer).addClass("br-favorite");
    let favoriteControls = $("<div></div>").appendTo(this.$controlFavorite).addClass("br-favorite-controls br-display-flex");
    if (this.options.pictureInPicture) {
        this.$pictureInPicture = $("<div></div>").appendTo(favoriteControls).addClass("br-pip-btn br-btn br-display-flex");
        $("<div></div>").appendTo(this.$pictureInPicture).addClass("iconfont-br icon-br-pip");
        $("<div></div>").appendTo(this.$pictureInPicture).addClass("br-tip-text br-not-select br-no-touch").html(getTextDesc.call(this, "PIP"));
    }
}

function createVideoMsgWrapper() {
    this.$msgWrapper = $("<div></div>").appendTo(this.$videoContainer).addClass("br-msg-wrapper");
}


function initVideo() {


    initVideoProgress.call(this);

    //video音量最大为1,为方便计算转为百分制
    this.volume = isEmpty(this.options.volume) ? 50 : this.options.volume;
    initVideoVolume.call(this, this.volume); //初始化音量

    onBufferTimes.call(this);//更新进度条
    // if (this.$speedContents)
    initPlaybackRate.call(this);//如果有倍速播放则初始化倍速

    // 控制栏初始化
    this.video.paused ? showControlAreas.call(this) : hiddenControlAreas.call(this);
    this.video.paused ? showMinStateAreas.call(this, "icon-br-play") : hiddenMinStateAreas.call(this);

}


//视频加载事件
function onBufferTimes() {
    //1、更新当前播放时间，及更改当前进度条
    if (this.video.buffered.length > 0) this.bufferTimes = this.video.buffered.end(this.video.buffered.length - 1);
    // 2、实现播放进度条的自动变化 通过进度百分比实现进度条
    this.$progressLoad.css("width", this.bufferTimes / this.duration * 100 + "%");
    // console.log(vui.bufferTimes / vui.duration * 100 + "%");
    videoCanplay.call(this);
}

//播放结束时调用此方法
function playEnded() {
    this.$playBtn.next(".br-tip-text").html(getTextDesc.call(this, "Replay"))
    this.$playBtn.addClass("icon-br-refresh").removeClass("icon-br-play");
    this.$videoMidState.children().removeClass().addClass("iconfont-br icon-br-refresh");
    clearInterval(this.progressRefreshTime);
}

/**
 * 鼠标点击时跳播
 * @param ev
 */
function jumpPlay(ev) {
    ev = ev || event;
    let clientPointX = ev.offsetX;
    let widthTotal = this.$progressBar.width();
    // console.log(clientPointX + "  " + widthTotal);
    //2、计算点击位置的视频时长，并改变当前时长
    this.video.currentTime = (clientPointX / widthTotal * this.duration);
    updateProgressAndPlay.call(this);
}

function updateProgressAndPlay() {
    if (this.video.paused) {//如果视频暂停了 拖动进度条后自动开始播放
        playStatusChange.call(this)
        showPlay.call(this)
    }
}

/**
 * 拖拽进度条开始
 * 暂停播放、调整进度条样式 显示预览窗口
 * @param params
 */
function dragInProgress(params) {
    videoPause.call(this);
    let currentTime = (params[0] * this.duration / 100);
    dragShowProgressPreviewInfo.call(this, currentTime);
}

/**
 * 拖拽进度条结束
 * 开启播放、设置新的播放时间
 * @param params
 */
function dragEndProgress(params) {
    this.video.currentTime = (params[0] * this.duration / 100);
    videoTimeUpdate.call(this);
    if (this.video.paused) {//如果视频暂停了 拖动进度条后自动开始播放
        videoPlay.call(this);
    }
    hiddenProgressPreview.call(this);
}

/**
 * 初始化播放参数
 * 时长
 * 当前时间
 * 格式化显示
 */
function initVideoProgress() {
    this.duration = this.video.duration;
    this.volume = this.video.volume * 100;//video音量最大为1,为方便计算转为百分制
    this.durationFm1 = durationFm1(this.duration);
    this.$timeDuration.html(this.durationFm1);
    this.currentTime = (isEmpty(this.options.currentTime) || this.options.currentTime < 0) ? 0 : this.options.currentTime;
    this.currentTime = this.currentTime > this.duration ? this.duration : this.currentTime;
    this.video.currentTime = this.currentTime;
    videoTimeUpdateStyle.call(this, this.currentTime);
}

function initVideoVolume(volumeVal) {
    if (volumeVal === 0 || this.options.muted) {//声音为0则是静音
        adjustVideoVolume.call(this, 0);
    } else {
        adjustVideoVolume.call(this, volumeVal);
    }
}


function adjustVideoVolume(volumeVal) {
    if (volumeVal === 0) {//声音为0则是静音
        voiceMuteStyel.call(this);
    } else {
        voiceVocalStyle.call(this);
    }
    this.$voiceCurrent.css("height", volumeVal + "%");
    this.$voiceDrag.css("top", (100 - volumeVal) + "%");
    this.$voiceInfo.html(volumeVal);
    this.volume = volumeVal;
    this.video.volume = volumeVal / 100;
}


/**
 * 点击图标静音或者开启音量
 */
function voiceIconClick() {
    if (this.video.muted || this.video.volume === 0) {//解除静音
        adjustVideoVolume.call(this, 50);
    } else {//静音
        adjustVideoVolume.call(this, 0);
    }
}

/**
 * 点击音量条设置音量
 * @param e
 */
function voiceRangeClick(ev) {
    ev = ev || event;
    // let clientPointY = e.offsetY;//不能使用offsetY作为高度值，因为鼠标移动到子元素中后返回的为子元素值，不是希望的值
    let clientPointY = Math.round(ev.pageY - this.$voiceRange.offset().top);
    let heightTotal = this.$voiceRange.height();
    //限制范围 因头部样式防止超出量程
    clientPointY = clientPointY < 0 ? 0 : clientPointY;
    clientPointY = clientPointY > heightTotal ? heightTotal : clientPointY;
    let volumeVal = Math.round((heightTotal - clientPointY) / heightTotal * 100);
    adjustVideoVolume.call(this, volumeVal);
}

function dragInvoice(params) {
    let volumeVal = Math.round(100 - params[1]);
    adjustVideoVolume.call(this, volumeVal);
}

//静音样式
function voiceMuteStyel() {
    this.$voiceIcon.addClass("icon-br-voice-off").removeClass("icon-br-voice-on");
}

//有声样式
function voiceVocalStyle() {
    this.$voiceIcon.addClass("icon-br-voice-on").removeClass("icon-br-voice-off");
}

/**
 * 单击视频窗口触发暂停与播放
 */
function clickVideoDom() {
    //单机演延时300ms再触发
    clearTimeout(this.clickVideoTime);//清除单击是的定时器
    this.clickVideoTime = setTimeout(() => playStatusChange.call(this), 300);
}

/**
 * 双击视频窗口触发全屏
 */
function dbClickVideoDom() {
    clearTimeout(this.clickVideoTime);//清除单击是的定时器
    windowFullscreen.call(this);
}

/**
 * 视频的播放与暂停控制
 */
function playStatusChange() {
    if (this.video.paused) {
        videoPlay.call(this);
    } else {
        videoPause.call(this);
    }
}

function videoPlay() {
    try {
        this.video.play();
        clearInterval(this.progressRefreshTime);//开启定时器前先清除定时器
        this.progressRefreshTime = setInterval(videoTimeUpdate.bind(this), 10);
        showPlay.call(this);
    } catch (err) {
        showMsgBox.call(this, getTextDesc.call(this, "Try again later"));
    }
}

function videoPause() {
    try {
        this.video.pause();
        clearInterval(this.progressRefreshTime);
        showPause.call(this);
    } catch (err) {
        showMsgBox.call(this, getTextDesc.call(this, "Try again later"));
    }

}

function reloadVideo(options) {
    this.options = $.extend(this.options, options);
    //TODO 待实现功能
    $.extend(this.options, {
        bulletAble: false,
    });
    this.options.$el = $(this.options.el);
    this.options.$el.empty();
    init.call(this);
}


//当播放暂停时更改样式
function showPause() {
    this.$playBtn.next(".br-tip-text").html(getTextDesc.call(this, "Play"))
    this.$playBtn.addClass("icon-br-play").removeClass("icon-br-pause");
    showMinStateAreas.call(this, "icon-br-play");
    showControlAreas.call(this);
}

//当播放开始时更改样式
function showPlay() {
    this.$playBtn.next(".br-tip-text").html(getTextDesc.call(this, "Pause"))
    this.$playBtn.addClass("icon-br-pause").removeClass("icon-br-play");
    this.$videoMidState.removeClass("br-show");
    hiddenMinStateAreas.call(this);
}

function showControlAreas() {
    this.$controlBottom.addClass("br-show").removeClass("br-hidden");
    this.$controlFavorite.addClass("br-show").removeClass("br-hidden");
    this.$videoContainer.removeClass("br-cursor-hidden");
}

function hiddenControlAreas() {
    this.$controlBottom.addClass("br-hidden").removeClass("br-show");
    this.$controlFavorite.addClass("br-hidden").removeClass("br-show");
    this.$videoContainer.addClass("br-cursor-hidden");
}

function showMinStateAreas(claName) {
    this.$videoMidState.children().removeClass().addClass("iconfont-br " + claName)
    this.$videoMidState.addClass("br-show");
}

function hiddenMinStateAreas() {
    this.$videoMidState.removeClass("br-show");
}

/**
 * 播放状态下鼠标3s不移动隐藏控制面板
 */
function mouseNoMoveHiddenControlAreas() {
    //鼠标移动先显示控制面板
    showControlAreas.call(this);
    if (this.controlAreasTimer) {
        clearTimeout(this.controlAreasTimer);
        this.controlAreasTimer = null;
    }
    this.controlAreasTimer = setTimeout(function () {
        if (!this.video.paused) {//只有播放状态下有效
            hiddenControlAreas.call(this);
        }
    }.bind(this), 3000);
}

function mouseOutHiddenControlAreas() {
    if (!this.video.paused) {//只有播放状态下有效
        hiddenControlAreas.call(this);
    }
}

/**
 * 更新视频播放的时间
 */
function videoTimeUpdate() {
    videoTimeUpdateStyle.call(this, this.video.currentTime)
}

/**
 * 更新视频播放时候的样式
 * @param currentTime
 */
function videoTimeUpdateStyle(currentTime) {
    //1、更新当前播放时间，及更改当前进度条
    this.currentTime = currentTime;
    this.currentTimeFm1 = durationFm1(currentTime);
    this.$timeCurrent.html(this.currentTimeFm1);

    // 2、实现播放进度条的自动变化 通过进度百分比实现进度条
    this.$progressCurrent.css("width", currentTime / this.duration * 100 + "%");
    this.$progressPlayDrag.css("left", currentTime / this.duration * 100 + "%");
}

/**
 * 拖拽时显示 预览信息，此时需要强制显示
 * @param currentTime
 */
function dragShowProgressPreviewInfo(currentTime) {
    //显示预览窗口
    this.$progressPreview.addClass("br-show");
    updateProgressPreviewInfo.call(this, currentTime);

    // 2、实现播放进度条的自动变化 通过进度百分比实现进度条
    this.$progressCurrent.css("width", currentTime / this.duration * 100 + "%");
    this.$progressPlayDrag.css("left", currentTime / this.duration * 100 + "%");
}

/**
 * 鼠标在进度条上移动时显示 信息只显示 时间与预览画面
 */
function updateProgressPreviewInfo(currentTime) {
    //1、更新当前播放时间，及更改当前进度条
    this.currentTimeFm1 = durationFm1(currentTime);
    this.$progressPointTime.html(this.currentTimeFm1);
}

/**
 * 隐藏 预览框
 * @param currentTime
 */
function hiddenProgressPreview() {
    this.$progressPreview.removeClass("br-show");
}

function showProgressPreview(ev, callback) {
    ev = ev || event;

    //当前鼠标的相对位置
    let previewPoint = ev.clientX - this.$progressRange.offset().left;
    previewPoint = previewPoint < 0 ? 0 : previewPoint
    previewPoint = previewPoint > this.$progressRange.width() ? this.$progressRange.width() : previewPoint

    //可以移动时候的起始点与终止点
    let startMovePoint = this.$progressPreview.width() / 2;
    let endMovePoint = this.$progressRange.width() - this.$progressPreview.width() / 2;

    //判断移动范围，中间距离 跟随移动 两头固定值
    if (previewPoint >= startMovePoint && previewPoint <= endMovePoint) {
        this.$progressPreview.css("left", previewPoint - this.$progressPreview.width() / 2);
    } else if (previewPoint < startMovePoint) {
        this.$progressPreview.css("left", 0);
    } else if (previewPoint > endMovePoint) {
        this.$progressPreview.css("left", endMovePoint - this.$progressPreview.width() / 2);
    }

    let currentTime = (previewPoint / this.$progressRange.width() * this.duration);
    updateProgressPreviewInfo.call(this, currentTime);
}

//视频播放时长格式化 3730s -> 01:02:10s
function durationFm1(num) {
    num = isNaN(num) ? 0 : num;
    let hour = numFm1(Math.floor(num / 3600), 2);
    let minute = numFm1(Math.floor(num % 3600 / 60), 2)
    let second = numFm1(Math.floor(num % 60), 2);
    return hour === "00" ? minute + ":" + second : hour + ":" + minute + ":" + second;
}

/**
 * 当视频暂停加载数据事后触发
 */
function videoWaiting() {
    showMinStateAreas.call(this, "icon-br-loading");
}

/**
 * 当视频数据加载完毕后触发
 */
function videoCanplay() {
    if (this.video.paused) {
        showMinStateAreas.call(this, "icon-br-play");
    } else {
        hiddenMinStateAreas.call(this);
    }
}

function qualityClick(ev) {
    ev = ev || event;
    // setPlaybackRate.call(this, $(ev.target).data("value"), $(ev.target));
    setPlayQuality.call(this, $(ev.target).data("src"), $(ev.target).data("type"), $(ev.target).text(), $(ev.target));
}

function setPlayQuality(src, type, text, tarObj) {

    if (!isEmpty(src) && !isEmpty(type)) {
        showMsgBox.call(this, getTextDesc.call(this, "Switching clarity") + text);
        this.$videoSource.prop("src", src);
        this.$videoSource.prop("type", type);
        this.options.currentTime = this.currentTime;
        this.options.muted = this.video.muted;
        this.options.volume = this.volume;
        this.video.load();
        this.video.play();
        if (this.options.qualityData && this.options.qualityData.length && !isEmpty(tarObj)) {
            this.$qualityContents.find(".br-select-item").removeClass("br-active");
            tarObj.addClass("br-active");
            showMsgBox.call(this, getTextDesc.call(this, "Successfully switched clarity"));
        }
    }
}

/**
 * 播放速度选择
 * @param e
 */
function playbackRateClick(ev) {
    ev = ev || event;
    setPlaybackRate.call(this, $(ev.target).data("value"), $(ev.target));
}

function setPlaybackRate(playbackRate, tarObj) {
    if (!isEmpty(playbackRate)) {
        this.video.playbackRate = playbackRate;
        if (this.options.playRateData && this.options.playRateData.length && !isEmpty(tarObj)) {
            this.$speedContents.find(".br-select-item").removeClass("br-active");
            tarObj.addClass("br-active");
        }
    }

}


/**
 * 根据语言 获取界面文本提示内容
 * @param code
 * @returns {string}
 */
function getTextDesc(code) {
    let testDesc = ""
    if (!(code === undefined) && !(languages === undefined)) {
        if (languages.hasOwnProperty(this.options.language)) {
            testDesc = languages[this.options.language][code];
        } else {
            testDesc = languages["zh-CN"][code];
        }
    }
    return testDesc === undefined ? "" : testDesc;
}

/**
 * 判断是否为function
 * @param obj
 * @returns {boolean}
 */
function isFunction(obj) {
    return typeof obj === "function" && typeof obj.nodeType !== "number" && typeof obj.item !== "function";
};


function commonCallback(callback, params) {
    if (isFunction(callback)) {
        callback.call(this, params)
    }
}

//格式化 不足的补足，如：1->01
function numFm1(num, length) {
    return (Array(length).join('0') + num).slice(-length);
}


/**
 * 拖拽
 * @param el 被拖拽元素
 * @param refEl 参照元素
 * @param direct 方向 x/y/both
 * @param callback 回调函数
 */
function dragElement(el, refEl, direct, startCallback, endCallback) {
    direct = direct === undefined ? "BOTH" : direct.toUpperCase();

    //抽象元素一开始的位置
    let elStarPoint = {x: 0, y: 0};
    let cursorStartPoint = {x: 0, y: 0};
    let elEndPoint = {x: 0, y: 0};
    let cursorEndPoint = {x: 0, y: 0};
    let elPersentPoint = {left: 0, top: 0};

    var limit = false;

    el.onmousedown = (ev) => {
        ev = ev || event;
        if (el.setCapture) {
            el.setCapture();
        }

        elStarPoint.x = el.offsetLeft;
        elStarPoint.y = el.offsetTop;

        cursorStartPoint.x = ev.clientX;
        cursorStartPoint.y = ev.clientY;

        document.onmousemove = (ev) => {
            ev = ev || event;

            cursorEndPoint.x = ev.clientX;
            cursorEndPoint.y = ev.clientY;

            elEndPoint.x = elStarPoint.x + (cursorEndPoint.x - cursorStartPoint.x);
            elEndPoint.y = elStarPoint.y + (cursorEndPoint.y - cursorStartPoint.y);

            elPersentPoint.left = elEndPoint.x / refEl.offsetWidth * 100;
            elPersentPoint.top = elEndPoint.y / refEl.offsetHeight * 100;

            elPersentPoint.left = elPersentPoint.left < 0 ? 0 : elPersentPoint.left;
            elPersentPoint.left = elPersentPoint.left > 100 ? 100 : elPersentPoint.left;

            elPersentPoint.top = elPersentPoint.top < 0 ? 0 : elPersentPoint.top
            elPersentPoint.top = elPersentPoint.top > 100 ? 100 : elPersentPoint.top;

            if (direct === "BOTH") {
                $(el).css("left", elPersentPoint.left + "%");
                $(el).css("top", elPersentPoint.top + "%");
            } else if (direct === "X") {
                $(el).css("left", elPersentPoint.left + "%");
            } else if (direct === "Y") {
                $(el).css("top", elPersentPoint.top + "%");
            }

            commonCallback.call(this, startCallback, [elPersentPoint.left, elPersentPoint.top]);
        }

        document.onmouseup = (ev) => {
            ev = ev || event;

            document.onmousemove = document.onmouseup = null;
            if (document.releaseCapture) {
                document.releaseCapture();
            }
            commonCallback.call(this, endCallback, [elPersentPoint.left, elPersentPoint.top]);
        }
    }
    //去掉拖拽事件，解决有些时候,在鼠标松开的时候,元素仍然可以拖动;
    document.ondragstart = function (ev) {
        ev = ev || event;
        ev.preventDefault();
    };
    document.ondragend = function (ev) {
        ev = ev || event;
        ev.preventDefault();
    };
    return false;
}

/**
 * 判断字符串是否为空
 * @param obj
 * @returns {boolean}
 */
function isEmpty(obj) {
    if (typeof obj === "undefined" || obj === null || obj === "") {
        return true;
    } else {
        return false;
    }
}


/**
 * 网页全屏
 */
function browserFullscreen() {
    if (this.browserFullscreenStatus) {//退出网页全屏
        this.$videoContainer.removeClass("br-fixed");
        this.$browserFullscreen.addClass("icon-br-arrows-expand").removeClass("icon-br-arrows-compress");
        this.$browserFullscreen.next(".br-tip-text").html(getTextDesc.call(this, "Browser Fullscreen"));
        this.browserFullscreenStatus = false;
    } else {//网页全屏
        this.$videoContainer.addClass("br-fixed");
        this.$browserFullscreen.addClass("icon-br-arrows-compress").removeClass("icon-br-arrows-expand");
        this.$browserFullscreen.next(".br-tip-text").html(getTextDesc.call(this, "Browser Non-Fullscreen"));
        this.browserFullscreenStatus = true;
    }
}

/**
 * 系统全屏
 */
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
            showMsgBox.call(this, getTextDesc.call(this, "Browser did not support"));
            return false;
        }

        outFullscreenStyle.call(this);
    } else {//进入全屏
        //使用能力测试 添加不通浏览器下的前缀
        if (this.$videoContainer[0].requestFullscreen) {
            this.$videoContainer[0].requestFullscreen();
        } else if (this.$videoContainer[0].webkitRequestFullScreen) {
            this.$videoContainer[0].webkitRequestFullScreen();
        } else if (this.$videoContainer[0].mozRequestFullScreen) {
            this.$videoContainer[0].mozRequestFullScreen();
        } else if (this.$videoContainer[0].msRequestFullscreen) {
            this.$videoContainer[0].msRequestFullscreen();  // IE下 screen为小写  因此看出IE就算支持了也不标准，不规范
        } else if (this.$videoContainer[0].oRequestFullScreen) {
            this.$videoContainer[0].oRequestFullScreen();
        } else {
            showMsgBox.call(this, getTextDesc.call(this, "Browser did not support"));
            return false;
        }

        inFullscreenStyle.call(this);
    }
}

/**
 * 进入全屏时 显示退出全屏样式
 */
function inFullscreenStyle() {
    this.$windowFullscreen.next(".br-tip-text").html(getTextDesc.call(this, "Non-Fullscreen"));
    this.$windowFullscreen.removeClass("icon-br-full-expand").addClass("icon-br-full-compress");
}

/**
 * 退出全屏，显示全屏样式
 */
function outFullscreenStyle() {
    this.$windowFullscreen.next(".br-tip-text").html(getTextDesc.call(this, "Fullscreen"));
    this.$windowFullscreen.removeClass("icon-br-full-compress").addClass("icon-br-full-expand");
}


function showMsgBox(texVal) {
    this.$msgWrapper.html(texVal);
    this.$msgWrapper.css("opacity", 0.5);
    this.$msgWrapper.addClass("br-show");
    clearTimeout(this.showMsgTimeout);//防止多个定时器重叠，在开启新的前，先清除以前的
    this.showMsgTimeout = setTimeout(() => hiddenMsgBox.call(this), 3000)
}

function hiddenMsgBox() {
    this.$msgWrapper.css("opacity", 0);
    setTimeout(() => {
            this.$msgWrapper.html("");
            this.$msgWrapper.removeClass("br-show");
        }, 500
    )

}

/**
 * 画中画
 */
function pictureInPicture() {
    if (!document.pictureInPictureElement) {//开启
        this.video.requestPictureInPicture().catch(error => showMsgBox.call(this, getTextDesc.call(this, "Video failed to enter PIP")));
    } else {//关闭
        document.exitPictureInPicture().catch(error => showMsgBox.call(this, getTextDesc.call(this, "Video failed to leave PIP")));
    }
}

/**
 * 进入画中画时触发此事件
 */
function enterpictureinpicture() {
    outFullscreenStyle.call(this);//如果全屏时，点击画中画，会自动退出全屏，因此关闭全屏样式
    this.$pictureInPicture.find(".br-tip-text").html(getTextDesc.call(this, "Exit Picture-in-Picture"));
}

/**
 * 退出画中画时触发此事件
 */
function leavepictureinpicture() {
    this.$pictureInPicture.find(".br-tip-text").html(getTextDesc.call(this, "PIP"));
    videoPlay.call(this);
}

function commoncatch() {
    try {
    } catch (err) {
        showMsgBox.call(this, getTextDesc.call(this, "Try again later"));
    }
}


/******************************系统全屏********************************/

window.keycode = keycode
// window.addEventListener('keydown', keydown);

/**
 * 注册键盘事件
 * @type {{left: keyboardDownMpa.left, up: keyboardDownMpa.up, right: keyboardDownMpa.right, down: keyboardDownMpa.down}}
 */
const keyboardDownMpa = {
    up: keyboardDownUp,
    down: keyboardDownDown,
    left: keyboardDownLeft,
    right: keyboardDownRight,
};


function keydownListener(ev) {
    ev = ev || event;
    // console.log((ev.which || ev.keyCode) + ': ' + keycode(ev.which || ev.keyCode));
    let keyboardAction = keyboardDownMpa[keycode(ev.which || ev.keyCode)]
    if (isFunction(keyboardAction)) {
        keyboardAction.call(this);
    }
}

/**
 * 上键声音+5
 * @param ev
 */
function keyboardDownUp(ev) {
    ev = ev || event;
    ev.preventDefault();

    if (this.video) {
        let volumeVal = this.volume || Math.round(this.video.volume * 100);
        volumeVal += 5;
        volumeVal = volumeVal >= 100 ? 100 : volumeVal;
        adjustVideoVolume.call(this, volumeVal);
        showMsgBox.call(this, getTextDesc.call(this, "Current Volume") + ":" + volumeVal);
    }
}

/**
 * 下键声音-5
 * @param ev
 */
function keyboardDownDown(ev) {
    ev = ev || event;
    ev.preventDefault();

    if (this.video) {
        let volumeVal = this.volume || Math.round(this.video.volume * 100);
        volumeVal -= 5;
        volumeVal = volumeVal <= 0 ? 0 : volumeVal;
        adjustVideoVolume.call(this, volumeVal);
        showMsgBox.call(this, getTextDesc.call(this, "Current Volume") + ":" + volumeVal);
    }
}

/**
 * 左键进度-5
 * @param ev
 */
function keyboardDownLeft(ev) {
    ev = ev || event;
    ev.preventDefault();
    if (this.video) {
        let currentTime = this.currentTime || this.video.currentTime;
        currentTime -= 5;
        currentTime <= 0 ? 0 : currentTime;
        this.video.currentTime = currentTime;
        updateProgressAndPlay.call(this)
        showMsgBox.call(this, getTextDesc.call(this, "Current Time") + ":" + durationFm1(currentTime));
    }
}

/**
 * 右键进度+5
 * @param ev
 */
function keyboardDownRight(ev) {
    ev = ev || event;
    ev.preventDefault();
    if (this.video) {
        let currentTime = this.currentTime || this.video.currentTime;
        let duration = this.duration || this.video.duration;
        currentTime += 5;
        currentTime >= duration ? duration : currentTime;
        this.video.currentTime = currentTime;
        updateProgressAndPlay.call(this);
        showMsgBox.call(this, getTextDesc.call(this, "Current Time") + ":" + durationFm1(currentTime));
    }
}


window.VideoUI = VideoUI;
export default VideoUI;
