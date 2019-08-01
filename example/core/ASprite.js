function Rect()
{
    this.x   =   0;
    this.y  =   0;
    this.width    =   0;
    this.height   =   0;
    
    this.clone = function()
    {
        var rect = new Rect();
        rect.x = this.x;
        rect.y = this.y;
        rect.width = this.width;
        rect.height = this.height;
        return rect;
    };
};
function ASprite()
{
    function Module()
    {
        this.id = -1;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }
    function FModule()
    {
        this.id = -1;
        this.module_id = 0;
        this.ox = 0;
        this.oy = 0;
        this.angle = 0;
        this.scalex = 0;
        this.scaley = 0;
    }
    function Frame()
    {
        this.id = -1;
        this.list_fmodule = [];
        this.rect = null;
    }
    function AFrame()
    {
        this.id = -1;
        this.frame_id = 0;
        this.time = 0;
        this.ox = 0;
        this.oy = 0;
        this.angle = 0;
        this.scalex = 0;
        this.scaley = 0;
    }
    function Animation()
    {
        this.id = -1;
        this.name = "";
        this.list_aframe = [];
    }
    
    var image       = null;
    
    var m_modules   = [];
    var m_frames    = [];
    var m_anim      =[];
    
    var m_finishLoad = false;
    var m_finishLoadImage = false;
    
    this.GetAniamtionInfo = function()
    {
        return m_anim;
    };
    
    this.load = function(sprite_url, image_url)
    {
        image = new Image();
        image.src = HostSpritePath() + image_url;
        image.onload = ImageLoaded;
        //load sprite info
        LoadSprite(HostSpritePath() + sprite_url, this);
    };
    
    function ImageLoaded()
    {
        m_finishLoadImage = true;
    }
    
    this.IsLoaded = function()
    {
        return m_finishLoad && m_finishLoadImage;
    };
    
    this.parser = function(bytearray)
    {
        
        var index = 0;
        //load modules
        var size = BReader.ReadInit32(bytearray, index);
        index+=4;
        
            //Utility.log("Number module: "+size);
        
        for(var i=0; i < size; i++)
        {
            m_modules[i]        = new Module();
            m_modules[i].id     = BReader.ReadInit32(bytearray, index + 0);
            m_modules[i].x      = BReader.ReadInit32(bytearray, index + 4);
            m_modules[i].y      = BReader.ReadInit32(bytearray, index + 8);
            m_modules[i].width  = BReader.ReadInit32(bytearray, index + 12);
            m_modules[i].height = BReader.ReadInit32(bytearray, index + 16);
            index += 20;
            
            //Utility.log("module id: "+m_modules[i].id);
        }
        
        //load frame
        size = BReader.ReadInit32(bytearray, index);
        index+=4;
        
        //Utility.log("Number frame: "+size);
        
        for(var i=0; i < size; i++)
        {
            m_frames[i]        = new Frame();
            m_frames[i].id     = BReader.ReadInit32(bytearray, index);
            index+=4;
            var nfmodule       = BReader.ReadInit32(bytearray, index);
            index+=4;
            
            var framerect = new Rect();
            var fmodule = null;

            for(var j=0; j < nfmodule; j++)
            {
                fmodule = new FModule();
                
                
                fmodule.id          = BReader.ReadInit32(bytearray, index + 0);
                fmodule.module_id   = BReader.ReadInit32(bytearray, index + 4);
                fmodule.ox          = BReader.ReadInit32(bytearray, index + 8);
                fmodule.oy          = BReader.ReadInit32(bytearray, index + 12);
                fmodule.angle       = BReader.ReadInit32(bytearray, index + 16);
                fmodule.scalex      = BReader.ReadInit32(bytearray, index + 20) / 100;
                fmodule.scaley      = BReader.ReadInit32(bytearray, index + 24) / 100;
                index += 28;
                
                
                //calc rect
                var module = this.GetModule(fmodule.module_id);
                if(framerect.x > fmodule.ox)
                    framerect.x = fmodule.ox;
                if(framerect.y > fmodule.oy)
                    framerect.y = fmodule.oy;
                if(framerect.width < module.width)
                    framerect.width = module.width;
                if(framerect.height < module.height)
                    framerect.height = module.height;
                
                m_frames[i].list_fmodule[j] = fmodule;
            }
            
            m_frames[i].rect = framerect;
        }
        
        //load anim
        size = BReader.ReadInit32(bytearray, index);
        index+=4;
        
        //Utility.log("Number anim: "+size);
        
        for(var i=0; i < size; i++)
        {
            m_anim[i]           = new Animation();
            m_anim[i].id        = BReader.ReadInit32(bytearray, index);
            index+=4;
            var naframe        = BReader.ReadInit32(bytearray, index);
            index+=4;
            
            //
            //Utility.log("Anim "+m_anim[i].id+": Number aframe: "+naframe);
            for(var j=0; j < naframe; j++)
            {
                m_anim[i].list_aframe[j] = new AFrame();
                
                m_anim[i].list_aframe[j].id         = BReader.ReadInit32(bytearray, index + 0);
                m_anim[i].list_aframe[j].frame_id   = BReader.ReadInit32(bytearray, index + 4);
                m_anim[i].list_aframe[j].time       = BReader.ReadInit32(bytearray, index + 8);
                m_anim[i].list_aframe[j].ox         = BReader.ReadInit32(bytearray, index + 12);
                m_anim[i].list_aframe[j].oy         = BReader.ReadInit32(bytearray, index + 16);
                m_anim[i].list_aframe[j].angle      = BReader.ReadInit32(bytearray, index + 20);
                m_anim[i].list_aframe[j].scalex     = BReader.ReadInit32(bytearray, index + 24) / 100;
                m_anim[i].list_aframe[j].scaley     = BReader.ReadInit32(bytearray, index + 28) / 100;
                index += 32;
                
                //Utility.log("anim frame id: "+m_anim[i].list_aframe[j].frame_id);
            }
        }
        m_finishLoad = true;
    };
    
    

    this.PaintModule = function(ctx, moduleid, x, y, scalex, scaley, angle, alpha, align)
    {
        var md = this.GetModule(moduleid);

        if(md)
        {
            ctx.save();
            
            var hw = md.width/2;
            var hh = md.height/2;

            ctx.translate(x + hw * scalex, y + hh * scaley);
            ctx.scale(scalex, scaley);
            ctx.rotate(angle * Math.PI / 180);
            ctx.globalAlpha = alpha;

            ctx.drawImage(image, 
                          md.x, 
                          md.y, 
                          md.width, 
                          md.height, 
                          -hw, 
                          -hh, 
                          md.width, 
                          md.height);

            ctx.restore();
        }
    };
    
    this.PaintFrame = function(ctx, frameid, x, y, scalex, scaley, angle, alpha)
    {
        var frame = this.GetFrame(frameid);
        
        if(frame)
        {
            var size = frame.list_fmodule.length;
            
            for(var i=0; i < size; i++)
            {
                var fmodule = frame.list_fmodule[i];
                this.PaintModule(ctx, fmodule.module_id, x + fmodule.ox * scalex, y + fmodule.oy*scaley, scalex * fmodule.scalex, scaley * fmodule.scaley, angle + fmodule.angle, alpha);
            }
            
        }
    };
    
    var m_currentAnimID = -1;
    var m_currentAFrame = 0;
    var m_currentTime = 0;
    
    this.SetAnim = function(animid)
    {
        m_currentAnimID = animid;
    }
    
    this.Render = function(ctx, x, y, scalex, scaley, angle, alpha)
    {
        var anim = this.GetAmin(m_currentAnimID);

        if(anim)
        {
            var size = anim.list_aframe.length;
            
            if(m_currentAFrame < size)
            {
                var aframe = anim.list_aframe[m_currentAFrame];                
                this.PaintFrame(ctx, aframe.frame_id, x + aframe.ox, y + aframe.oy, scalex * aframe.scalex, scaley * aframe.scaley, angle + aframe.angle, alpha);
                
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
            }
        }
    };
    
    this.GetModule = function(moduleid)
    {
       var md = null;

        for(var i=0; i <m_modules.length; i++)
        {
            if(m_modules[i].id == moduleid)
            {
                md = m_modules[i];
                break;
            }
        }
        return md;
    };
    
    this.GetFrame = function(frameid)
    {
       var frame = null;
        for(var i=0; i <m_frames.length; i++)
        {
            if(m_frames[i].id == frameid)
            {
                frame = m_frames[i];
                break;
            }
        }
        return frame;
    };
    
    this.GetAmin = function(animid)
    {
       var anim = null;
        for(var i=0; i <m_anim.length; i++)
        {
            if(m_anim[i].id == animid)
            {
                anim = m_anim[i];
                break;
            }
        }
        return anim;
    };
    
    this.GetFrameRect = function(animID, aframeID)
    {
        var anim = this.GetAmin(animID);
        if(anim != null)
        {
            if(aframeID < anim.list_aframe.length)
            {
                
                return this.GetFrame(anim.list_aframe[aframeID].frame_id).rect;
            }
        }
        return new Rect();
    };
}