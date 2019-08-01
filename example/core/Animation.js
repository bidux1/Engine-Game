function Animation(asprite)
{
    
    this.x = 0;
    this.y = 0;
    
    var scalex = 1;
    var scaley = 1;
    
    var angle = 0;
    var alpha = 1;
    
    var sprite = asprite;

    var m_currentAnimID = -1;
    var m_currentAFrame = 0;
    var m_currentTime = 0;
    var m_isFinish = false;
    
    this.IsLoaded = function()
    {
        if(asprite)
            return asprite.IsLoaded();
        return false;
    };
    
    this.IsFinish = function()
    {
        return m_isFinish;
    };
    
    this.SetAnim = function(animid)
    {
        m_currentAnimID = animid;
        this.Reset();
    };
    
    this.SetPos = function(x, y)
    {
        this.x = x + Graphic.GetOffsetRatio();
        this.y = y;
    };
    
    this.SetScale = function(x, y)
    {
        scalex = x;
        scaley = y;
    };
    
    this.SetAlpha = function(value)
    {
        alpha = value;
    };
    
    this.SetRotate = function(value)
    {
        angle = value;
    };
    
    this.Render = function()
    {
        var anim = null;
        var animInfo = sprite.GetAniamtionInfo();
        
        for(var i=0; i <animInfo.length; i++)
        {
            if(animInfo[i].id == m_currentAnimID)
            {
                anim = animInfo[i];
                break;
            }
        }
        if(anim)
        {
            var size = anim.list_aframe.length;
            
            if(m_currentAFrame < size)
            {
                var aframe = anim.list_aframe[m_currentAFrame];    

                sprite.PaintFrame(Graphic.GetContext(), aframe.frame_id, this.x + aframe.ox, this.y + aframe.oy, scalex * aframe.scalex, scaley * aframe.scaley, angle + aframe.angle, alpha);
                
                m_currentTime++;
                
                if(m_currentTime >= aframe.time)
                {
                    m_currentTime = 0;
                    m_currentAFrame++;
                }
            }
            //reset
            if(m_currentAFrame >= size)
            {
                m_currentAFrame = 0;
                m_isFinish = true;
            }
        }
        
        
    };
    
    this.GetRect = function()
    {
        var rect = sprite.GetFrameRect(m_currentAnimID, m_currentAFrame).clone();
        rect.x += this.x;
        rect.y += this.y;
        return rect;
    }
    
    this.IsBegin = function()
    {
        return !m_isFinish && m_currentAFrame == 0;
    };
    
    this.Reset = function()
    {
        m_isFinish = false;
        m_currentAFrame = 0;
    };
}