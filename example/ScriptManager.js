//script file use in project
var InGameScriptFile = [
    //script use in game
    "js/game/MainGame.js",
];
var MainScriptFile = [
    "js/game/define.js",
    "js/game/ScreenDefine.js",
    "js/core/Utility.js",
    "js/core/Object.js",
    "js/core/Input.js",
    "js/core/Graphic.js",
    "js/core/BReader.js",
    "js/core/ASprite.js",
    "js/core/Animation.js",
    "js/core/buffer-loader.js",
    "js/core/SoundManager.js",
    "js/core/AudioManager.js",
    "js/core/Button.js",
    "js/core/sprite.js",
    "js/states/MainState.js",
    "js/GameCore.js",
    "js/main.js"
];

var scriptLoaded = false;

function ScriptManager() {
    //function
    this.loadScript = loadScript;
    this.Load = Load;

    var index;
    var scriptList = null;

    /*
     * implement
     */

    function Load(list) {
        scriptLoaded = false;

        //load script in file list
        scriptList = list;
        index = 0;
        loadScriptIndex(index);
    }

    this.IsLoaded = function () {
        return scriptLoaded;
    }

    function loadScriptIndex() {
        if (index < scriptList.length) {
            loadScript(scriptList[index], LoadScriptCallBack);
            index++;
        } else {
            scriptLoaded = true;
            Utility.log("Finish load js file...");
        }
    }

    function loadScript(url, callback) {

        //console.log("Load file: "+url);

        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.charset = 'UTF-8';

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        if (callback != null) {
            script.onreadystatechange = callback;
            script.onload = callback;
        }
        // Fire the loading
        head.appendChild(script);
    }

    function LoadScriptCallBack() {
        loadScriptIndex();
    }

    this.Require = function (url, callback) {
        loadScript(url, callback);
    };
}

var ScriptManager = new ScriptManager();
ScriptManager.Load(MainScriptFile);