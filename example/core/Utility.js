 

function Utility() {
    
		window.navigator.vibrate = window.navigator.vibrate || window.navigator.webkitVibrate || window.navigator.mozVibrate || window.navigator.msVibrate;
	
	this.log = function(str) {
	
		if(typeof console === "undefined")
		{
			  console = {};
		}
        console.log(str);
	};
    this.Alert = function(str)
    {
        if(DEBUG)
        {
            alert(str);
        }
    };
	
	this.load_binary_resource = function(url) 
	{
	    var request;
	    if (window.XMLHttpRequest) {
	        // IE7+, Firefox, Chrome, Opera, Safari
	        request = new XMLHttpRequest();
	    } else {
	        // code for IE6, IE5
	        request = new ActiveXObject('Microsoft.XMLHTTP');
	    }
	    // load
	    request.overrideMimeType('text/plain; charset=x-user-defined');
	    request.open('GET', url, false);
	    request.send();
	    return request.responseText;
	};
	
	this.Rand = function(a, b) {
		return Math.floor((Math.random()*(b + 1)) + a);
	};
	
	this.Vibrate = function() {
		if (window.navigator && window.navigator.vibrate) {
		    // vibration API supported
			
			// vibrate for one second
			window.navigator.vibrate(100);
		}
	};
	this.requestAnimationFrame = function(callback) {
	    var lastTime = 0;
	    var vendors = ['ms', 'moz', 'webkit', 'o'];
	    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
	                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
	    }
	 
	    if (!window.requestAnimationFrame)
	        window.requestAnimationFrame = function(callback, element) {
	            var currTime = new Date().getTime();
	            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
	              timeToCall);
	            lastTime = currTime + timeToCall;
	            return id;
	        };
	 
	    if (!window.cancelAnimationFrame)
	        window.cancelAnimationFrame = function(id) {
	            clearTimeout(id);
	        };
	};
	
	this.OpenURL = function(a_tag, url) {
		//window.open(url, '_system');
	};
    
    this.FormatText = function(str, param)
    {
        var result = str;
        
        for(var i=0; i < param.length; i++)
        {
            result = result.replace('{'+i+'}', param[i]);
        }
        return result;
    }
    
    this.CreateImageRGB = function(w, h, argb)
    {

        var canvasRGB = document.createElement("canvas");
        canvasRGB.width = w;
        canvasRGB.height = h;

        var ctxRGB = canvasRGB.getContext("2d");
        ctxRGB.putImageData(argb, 0, 0);

        // image is _slightly_ faster then canvas for this, so convert
        var img = new Image();
        img.src = canvasRGB.toDataURL();
        return img;
    }
}
//make static instance
var Utility = new Utility();