var ScreenPixelRatio2 = {
    IMG: 'img',
    SPRITE: 'sprites',
    devicePixelRatio: 1,
    SCALE: 0.5,
    WIDTH: 750,
    HEIGHT: 1334,
    FONT_SIZE_NORMAL: 50,
    FONT_SIZE_45: 45,
    FONT_SIZE_MAX: 60,
    FONT_SIZE_MIN: 25,
    FONT_SIZE_TUTORIAL: 25,
    FONT_SIZE_25: 25,
    FONT_SIZE_120: 160,
};

var DEVICE_OS = {
    IOS: 0,
    ANDROID: 1,
    WP8: 2
};

var DEVICE_INFO = {
    OS: 0,
};

var ScreenDefine = ScreenPixelRatio2;

function InitScreenDefine(width, height) {
    Utility.log("User Agent: " + navigator.userAgent);

    var iOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);
    if (iOS) {
        if (navigator.userAgent.indexOf('iPad') != -1) {
            ScreenDefine = ScreenPixelRatio2;
            ScreenDefine.devicePixelRatio = 1;
        }
        DEVICE_INFO.OS = DEVICE_OS.IOS;
    } else if (navigator.userAgent.indexOf('Mac OS X') != -1) //ipad intel cpu
    {
        DEVICE_INFO.OS = DEVICE_OS.IOS;
        ScreenDefine = ScreenPixelRatio2;
        ScreenDefine.devicePixelRatio = window.devicePixelRatio;
    } else if (navigator.userAgent.indexOf('Android') != -1) {


        DEVICE_INFO.OS = DEVICE_OS.ANDROID;
        //force devicePixelRatio to 1
        ScreenDefine = ScreenPixelRatio2;

        if (width * height == 383 * 640) //temp fix bug on samsung edge: window.devicePixelRatio randome 2 or 4=> check ads server
        {
            ScreenDefine.devicePixelRatio = 1.5; //should 1.5 not 2 => improved fps
        } else if (window.devicePixelRatio > 3) {
            ScreenDefine.devicePixelRatio = 1; //1 not 2 => improved fps
        } else {
            ScreenDefine.devicePixelRatio = 1;
        }

        var value = navigator.userAgent.match(/Android\s([0-9\.]*)/);
        if (value.length > 0) {
            Utility.log("Android version: " + value[1]);
            if (value[1] < '5') {

            }
        }
    } else {
        DEVICE_INFO.OS = DEVICE_OS.WP8;
        ScreenDefine = ScreenPixelRatio2;
        ScreenDefine.devicePixelRatio = 1;
    }

}

function HostImagePath() {
    return SERVER_URL + ScreenDefine.IMG + '/';
}

function HostSpritePath() {
    return SERVER_URL + ScreenDefine.SPRITE + '/';
}