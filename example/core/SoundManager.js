 

function SoundManager()
{	
    
    const HAVE_NOTHING = 0;// - no information whether or not the audio/video is ready
    const HAVE_METADATA = 1;//- metadata for the audio/video is ready
    const HAVE_CURRENT_DATA = 2;// - data for the current playback position is available, but not enough data to play next frame/millisecond
    const HAVE_FUTURE_DATA = 3;// - data for the current and at least the next frame is available
    const HAVE_ENOUGH_DATA = 4;// - enough data available to start playing
    
    
	var sounds = null;
    var m_files = null;
	
	var sound_support_mp3 = false;
	var sound_support_ogg = false;
	var sound_support_mp4 = false;
	var m_loadCount = 0;
    
    var MAX_LOAD_TIME       =   6; //6sec
    var load_time_counter = 0;
	
    var count = 0;
	
	this.Init = function(music_files) {
        
        m_files = music_files;
		
		this.CheckSupportType();

		sounds = [];
		
		for(var i=0; i < music_files.length; i++)
		{
			sounds[i] = document.createElement('audio');
            //document.body.appendChild(sounds[i]);
            
            sounds[i].volume = 0;
			sounds[i].setAttribute('src', SERVER_URL + music_files[i].file);
            //sounds[i].onloadeddata=IsLoaded;
            
            //sounds[i].addEventListener('loadeddata', IsLoaded);
            
            sounds[i].load();
		}
        
        //play and pause it once
        document.addEventListener('touchstart', ShouldPlayMuteSound);
	};
    
    this.CheckLoadStatus = function(index)
    {
        if(sounds[index] != null)
        {
            try
            {
                var total_time = 0;
                var sound_duration = sounds[index].duration;//reduce 1 sec
                for(var i = 0; i < sounds[index].buffered.length; i++)
                {
                    total_time += sounds[index].buffered.end(i);
                }
                
                
                /*if(index==1)
                {
                    SetLog(index + " : " + total_time+"   "+sound_duration);
                    Utility.log(index + " : "+total_time+"   "+sound_duration);
                }
                */
                
                if(total_time >= sound_duration)
                {
                     return true;
                }
            }
            catch(e)
            {
                return true == (sounds[index].readyState == HAVE_ENOUGH_DATA);
            }
        }
        return false;
    };
    
    this.GetCurrentTimeMS = function(index)
    {
        if(sounds[index] != null)
        {
            return sounds[index].currentTime*1000;
        }
        return 0;
    };
    
    this.IsLoaded = function(time)
    {
        load_time_counter += time;
        for(var i=0; i < m_files.length; i++)
		{
			if(!this.CheckLoadStatus(i))return false;
		}
        
        return load_time_counter > MAX_LOAD_TIME;
    };
    
    function ShouldPlayMuteSound()
	{
        document.removeEventListener('touchstart', ShouldPlayMuteSound);
        
		for(var i=0; i < sounds.length; i++)
		{
            try
            {
                play(i, false);
                stop(i);
            }catch(e)
            {
            }
		}
        
        
	}
	
	this.CheckSupportType = function() {
		var test = new Audio();
		if (test.canPlayType) {
            // CanPlayType returns maybe, probably, or an empty string.
            var playMsg = test.canPlayType('audio/mpeg');
            if ( "" != playMsg) {
            	sound_support_mp3 = true;
            }
            playMsg = test.canPlayType('audio/ogg'); 
            if ( "" != playMsg){
            	sound_support_ogg = true;
            }

            playMsg = test.canPlayType('audio/mp4');
            if ( "" != playMsg){
            	sound_support_mp4 = true;
            }
        }
        else {
        	sound_support_type = "";         
        }
	};
	
	this.GetSupportAudioType = function() {
		if(sound_support_mp3)return ".mp3";
		if(sound_support_ogg)return ".ogg";
	};
    
    this.SetVolume = function(index, value)
    {
        sounds[index].volume = value;
    };
    
    function play(index, loop)
    {
        sounds[index].currentTime = 0;
        sounds[index].loop= loop;
		sounds[index].play();
    }
	
	this.Play = function(index, loop) {
		play(index, loop);
	};
	
    function stop(index)
    {
        sounds[index].pause();
		sounds[index].currentTime = 0;
    }
    
	this.Stop = function(index) {
		stop(index);
	};
	
	this.Pause = function(index) {
		sounds[index].pause();
	};
}

var SoundManager = new SoundManager();