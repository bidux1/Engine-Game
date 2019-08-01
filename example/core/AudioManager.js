/**
 * 
 */


function AudioManager() {
	var m_context = null;

	var m_gain = [];
	
	var m_source = [];
    
	var m_soundbuffer = [];
	var m_soundBufferLoader = null;
	
	var m_useAudioAPI = true;
	
	var m_isSoundLoaded = false;
	
	
	
	function CreateAudioGain() {
		
		var gainNode = null;
		
		//create gain node
		if (!m_context.createGain)
			m_context.createGain = m_context.createGainNode;
		gainNode = m_context.createGain();
		
		// Connect gain node to destination
		gainNode.connect(m_context.destination);
		
		return gainNode;
	};
    
    this.IsSupportAudioAPI = function()
    {
        return m_useAudioAPI;
    }
	
	this.Load = function() {
    
        //only load when support AudioAPI
        try 
          {
            //do something here
            var buffer = m_context.createBuffer(2, 4410, 44100);;
            for(var i=0; i < SOUND_FILES.length; i++)
            {
                m_soundbuffer[i] = buffer;
                m_gain[i] = CreateAudioGain();
                m_source[i] = null;

                setVolume(i, SOUND_FILES[i].volume);
                
                
            }
            document.addEventListener('touchstart', ShouldCheckSound);

            //load sound data
            m_soundBufferLoader = new BufferLoader(
                    m_context,
                    SOUND_FILES,
                    SoundFinishedLoading,
                    LoadSimpleSound
                    );

            m_soundBufferLoader.load();
          }
          catch(e) 
          {
            Utility.log('load sound error: '+e.message);

            //SetLog("basic audio: "+e.message);

            
            LoadSimpleSound();  
          }	 
	};
	
	function ShouldCheckSound()
	{
		document.removeEventListener('touchstart', ShouldCheckSound);

		for(var i=0; i < m_source.length; i++)
		{
			playSound(i, false);
			stopSound(i);
		}
	}
	
	function LoadSimpleSound() 
	{
        m_useAudioAPI = false;
        
		SoundManager.Init(SOUND_FILES);
        //FlashPlayer.Init(SOUND_FILES);
	}
    
    this.Init = function()
    {
        // Fix up for prefixing
        window.AudioContext  = window.AudioContext ||window.webkitAudioContext ;

        m_useAudioAPI = (typeof (window.AudioContext || window.webkitAudioContext)) != 'undefined' ;

        if(m_useAudioAPI)
        {
            // Fix up for prefixing
            m_context = new AudioContext ();
            
            this.Load();            
        }
        else
        {
            Utility.log('Web Audio API is not supported');
            LoadSimpleSound();
        }
    }
    
    function test()
    {
    }

	function SoundFinishedLoading(bufferList) 
	{
        
		for(var i=0; i < bufferList.length; i++)
		{
			m_soundbuffer[i] = bufferList[i];
		}
		
		m_isSoundLoaded = true;
		
		//play and pause it once
		//document.addEventListener('touchstart', ShouldCheckSound);
	}
	
	this.IsLoaded = function(time) 
    {
        
        if(m_useAudioAPI)
		{
		  return m_isSoundLoaded;
        }
        else
        {
            return SoundManager.IsLoaded(time);
            //return FlashPlayer.IsLoaded();
        }
	};
	
	function loadSound(index, url) 
	{
	  var request = new XMLHttpRequest();
	  request.open('GET', url, true);
	  request.responseType = 'arraybuffer';

	  // Decode asynchronously
	  request.onload = function() 
	  {
	    m_context.decodeAudioData(request.response, function(buffer) 
	    {
	    	m_soundbuffer[index] = buffer;
	    }, onError);
	  };
	  request.send();
	}
	
	function setVolume(index, value)
    {
		if(m_useAudioAPI)
		{
			GetAudioGain(index).gain.value = value;
		}
		else
		{
			SoundManager.SetVolume(index, value);
            //FlashPlayer.SetVolume(index, value);
		}
	};
	
	this.SetVolume = function(index, value) 
    {
		setVolume(index, value);
	};

	function IsMusic(index)
	{
		return  true == (index < SOUND_MUSIC_COUNT);
	}
	
	function GetAudioGain(index)
	{
		return m_gain[index];
	}
    
    this.GetCurrentTimeMS = function(index)
    {
        if(m_useAudioAPI)
        {
            return m_context.currentTime;
        }
        else
        {
            return SoundManager.GetCurrentTimeMS(index);
        }
    };
	
	function playSound(index, loop) 
	{
		if(m_useAudioAPI)
		{
			//try
			{
				m_source[index] = m_context.createBufferSource(); 	// creates a sound source
				// Connect source to a gain node
				m_source[index].connect(GetAudioGain(index));
				//source.connect(m_context.destination);       	// connect the source to the m_context's destination (the speakers)
				m_source[index].buffer = m_soundbuffer[index];                    		// tell the source which sound to play
				
				m_source[index].loop = loop;
				if(!m_source[index].start)
					m_source[index].start = m_source[index].noteOn;
				m_source[index].start(0);                           	// play the source now
			}
            //catch(e)
			//{
			//}

		}else
		{
			SoundManager.Play(index, loop);
            //FlashPlayer.Play(index);
		}	
	}
	
	function stopSound(index)
	{
		if(m_useAudioAPI)
		{
			try
			{
				if (!m_source[index].stop)
					m_source[index].stop = m_source[index].noteOff;
				m_source[index].stop(0);
			}
            catch(e)
			{
				Utility.log("stop Sound: "+e);
			}
		}
        else
        {
            SoundManager.Stop(index);
            //FlashPlayer.Stop(index);
        }
	}
	
	this.Play = function(index, loop) 
	{
        playSound(index, loop);
	};
	
	this.Pause = function(index) {
		stopSound(index);
	};
	
	this.Stop = function(index) {
		stopSound(index);
	};
	
	this.Pause = function(index)
	{
        if(m_useAudioAPI)
		{
        }
        else
        {
            SoundManager.Pause(index);
        }
	};
	
	this.Resume = function()
	{

	};
}

var AudioManager = new AudioManager();