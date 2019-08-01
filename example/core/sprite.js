 

function sprite (image, w, h, nframe) {
						
    this.width = w;
    this.height = h;
    this.image = image;
    
    this.Scale = 1;
    var angle = 0;
    var anchor = NONE;
    var autoAlign = NONE;
    
    var m_frameIndex = 0;
    var m_tickCount = 0;
    var m_ticksPerFrame = 1;
    var m_numberOfFrames = nframe;

    this.Loop = false;
    
    var m_isPlay = false;
    
    var m_posX = 0;
    var m_posY = 0;
    
    this.SetPos = function(x, y) {
    	m_posX = x;
    	m_posY = y;
	};
    
    this.SetAutoAlign = function(autoAlign)
    {
        this.autoAlign = autoAlign;
    }
    
    this.render = function () {
    	if(m_isPlay)
    	{
             
    		var ctx = Graphic.GetContext();
    		
    		var angleInRad = angle * Math.PI / 180;
			
			var hw = this.width/2;
			var hh = this.height/2;
			
			var xx = m_posX;
			var yy = m_posY;
    		
    		
    		if((anchor & H_CENTER) == 0)
				xx = xx + hw * this.Scale;
			if((anchor & V_CENTER) == 0)
				yy = yy + hh * this.Scale;
    		
            xx += Graphic.GetOffsetRatio();
    		ctx.save();
    		
    		ctx.translate(xx, yy);
			ctx.scale(this.Scale, this.Scale);
			ctx.rotate(angleInRad);
    		
	        // Draw the animation
    		ctx.drawImage(
	           this.image,
	           m_frameIndex * this.width,
	           0,
	           this.width,
	           this.height,
	           -hw,
	           -hh,
	           this.width,
	           this.height);
    		
    		ctx.restore();

	        this.update();
    	}
    };
    
    this.update = function () {

        m_tickCount += 1;
			
        if (m_tickCount > m_ticksPerFrame) {
        
        	m_tickCount = 0;
        	
            // Go to the next frame
        	// If the current frame index is in range
            if (m_frameIndex < m_numberOfFrames - 1) {	
                // Go to the next frame
            	m_frameIndex += 1;
            }
            else 
            {
            	if(this.Loop)
            	{
            		m_frameIndex = 0;
            	}
            	else
            	{
            		m_isPlay = false;
            	}
            }
        }
    };
    
    this.IsEndAnimation = function()
    {
    	return !m_isPlay;
    };
    
    this.Play = function() {
    	m_frameIndex = 0;
    	m_isPlay = true;
	};
	this.Stop = function() {
    	m_isPlay = false;
	};
}