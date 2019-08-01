function BufferLoader(context, urlList, callback, onerror)
{
	this.context = context;
	this.urlList = urlList;
	this.onload = callback;
	this.bufferList = new Array();
	this.loadCount = 0;
	this.OnError = onerror;
	
	BufferLoader.prototype.loadBuffer = function(url, index) {
	
	  // Load buffer asynchronously
	  var request = new XMLHttpRequest();
	  request.open("GET", url, true);
	  request.responseType = "arraybuffer";
        
      var loader = this;
	  
	  request.timeout = 10000;
	  request.ontimeout = function () { loader.OnError();};
	
	  
	
	  request.onload = function() {
	    // Asynchronously decode the audio file data in request.response
	    loader.context.decodeAudioData(
	      request.response,
	      function(buffer) {
	        if (!buffer) {
	          alert('error decoding file data: ' + url);
	          this.OnError();
	          return;
	        }
	        loader.bufferList[index] = buffer;
	        if (++loader.loadCount == loader.urlList.length)
	          loader.onload(loader.bufferList);
	      },
	      function(error) {
	        console.log('decodeAudioData error', error);
	        loader.OnError();
	      }
	    );
	  };
	
	  request.onerror = function() {
	    console.error('BufferLoader: XHR error '+request.readyState);
		loader.OnError();
	  };
	
	  request.send();
	};
	
	BufferLoader.prototype.load = function() {
	  for (var i = 0; i < this.urlList.length; ++i)
	  this.loadBuffer(SERVER_URL + this.urlList[i].file, i);
	};
}

function LoadSprite(url, sprite)
{
    var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "arraybuffer";
	request.timeout = 10000;
	request.ontimeout = function () { };

	request.onload = function() 
    {
        if(request.response)
        {
            sprite.parser(new Uint8Array(request.response));
        }
    };
	
    request.onerror = function() 
    {
        
    };
	
    request.send();
};

