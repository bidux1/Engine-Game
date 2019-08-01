/**
 * hung.phamviet@gameloft.com
 */
const NONE		=	1 << 0;
const LEFT		=	1 << 1;
const RIGHT		=	1 << 2;
const TOP		=	1 << 3;
const DOWN		=	1 << 4;
const H_CENTER	=	1 << 5;
const V_CENTER	=	1 << 6;
	
function Graphic() {
    var graphic_scale = 1;
	var m_userBuffer = true;
	var canvas = null;
	var m_buffer = null;
	var m_bufferCtx = null;
	var ctx = null;
	var m_font = "Arial";
    var m_offsetRatio = 0;
    var m_autoAlign = NONE;
	//public
	this.width = 0;
	this.height = 0;
    var realWidth = 0;
	var realHeight = 0;
    
    var isPortrait = true;

	//function
	this.Init = function() {
        var size = GetDeviceSize();
        
        InitScreenDefine(size.width, size.height);
        
		//created canvas
        /*
		canvas = document.createElement('canvas');
		canvas.id = "canvas";
		
		var gameDiv = document.createElement('div');
		gameDiv.id = 'gameDiv';
		gameDiv.appendChild(canvas);
		
		document.body.appendChild(gameDiv);
        */
        
        //screen.orientation.lock('portrait')
        
        canvas = document.getElementById('canvas');
		
        /*
		if(DEBUG)
        {
            window.onresize = OnResize;
        }
        */
        
		//canvas.width = this.realWidth;
		//canvas.height = this.realHeight;
        
        this.width = ScreenDefine.WIDTH;
        this.height = ScreenDefine.HEIGHT;
		
		if(canvas != null)
		{
			ctx = canvas.getContext('2d');
			
		}
		else Utility.log("Can not find canvas!");
		
		OnResize();

		
		Utility.log("Graphic init done...");
	};
	
    this.IsPortrait = function()
    {
        return isPortrait;
    };
	
	function OnResize()
	{
        
        var size = GetDeviceSize();
        
        //detect 
        
        if(DEBUG)
        {
            isPortrait = window.matchMedia("(orientation: portrait)").matches;
        }
        else
        {
            isPortrait = size.width < size.height;
        }
        
        realWidth = size.width;
        realHeight = size.height;

        /*
        canvas.width = size.width;
		canvas.height = size.height;
        */
        canvas.width = size.width*ScreenDefine.devicePixelRatio;
		canvas.height = size.height*ScreenDefine.devicePixelRatio;
        canvas.style.width = size.width+"px";
		canvas.style.height = size.height+"px";
        
        
        var scale = ScreenDefine.SCALE;
        var input_scale = ScreenDefine.SCALE;
        
        if(isPortrait)
        {
            scale = canvas.height / ScreenDefine.HEIGHT;
            m_offsetRatio =  (canvas.width - ScreenDefine.WIDTH * scale)/2/scale;
            
            input_scale = scale;
        }
        else
        {
            scale = canvas.width / ScreenDefine.HEIGHT;
            m_offsetRatio =  (canvas.height - ScreenDefine.WIDTH * scale)/2/scale;
            
            input_scale =  scale;
        }
        
		Input.SetScale(ScreenDefine.devicePixelRatio/input_scale, ScreenDefine.devicePixelRatio/input_scale);
        
        graphic_scale = scale;
        realWidth = size.width/scale;
        realHeight = size.height/scale;
        
        if(!isPortrait)
        {
            ctx.translate(0, canvas.height);
            ctx.scale(scale, scale);
            ctx.rotate(-90*Math.PI/180);
        }
        else
        {
            ctx.translate(0, 0);
            ctx.scale(scale, scale);
            ctx.rotate(0);
        }

		//Utility.log("Graphic OnResize..."+size.width+"  "+size.height);
	}
	
	function GetDeviceSize() 
    {
		
		var gameDiv = document.getElementById("gameDiv");

         return {
                width: gameDiv.offsetWidth,
                height: gameDiv.offsetHeight
            };
	}
	
	this.Clear = function() {
		ctx.fillStyle="#000000";
		
		//use hack
		//canvas.width = canvas.width;
		//clear
        if(isPortrait)
        {
            ctx.fillRect(0, 0,  this.RealWidth(),  this.RealHeight()); 
        }else
        {
            ctx.fillRect(0, 0,  this.RealHeight(),  this.RealWidth()); 
        }
	};
	
	this.FillTransparent = function(alpha) {
		ctx.fillStyle="black";
		ctx.globalAlpha=alpha;
        if(isPortrait)
        {
            ctx.fillRect(0, 0, this.RealWidth(), this.RealHeight());
        }else
        {
            ctx.fillRect(0, 0, this.RealHeight(), this.RealWidth());
        }
		
		ctx.globalAlpha=1.0;
	};
    
    this.DrawRect = function(x, y, w, h, color) 
    {
        ctx.beginPath();
		ctx.fillStyle=color;
		
        if(isPortrait)
        {
            ctx.rect(x, y, w, h);
        }else
        {
            ctx.rect(y, x, h, w);
        }
		
		ctx.stroke();
	};
	
	this.Available = function() {
		return (canvas != null && ctx != null);
	}; 
	
	this.GetContext = function()
	{
		return ctx;
	};
	
	this.GetCanvas = function()
	{
		return canvas;
	};
    
    this.GetOffsetRatio = function ()
    {
        return m_offsetRatio;
    }
    
    this.GetScale = function()
    {
        return graphic_scale;
    }
    
    this.RealWidth = function()
    {
        return realWidth * ScreenDefine.devicePixelRatio;
    }
    
    this.RealHeight = function()
    {
        return realHeight * ScreenDefine.devicePixelRatio;
    }
	
	this.Draw = function(img, x, y, anchor, angle, scaleX, scaleY, alpha, autoAlign)
	{
        x += m_offsetRatio;
		if(typeof angle == "undefined")angle = 0;
		if(typeof scaleX == "undefined")scaleX = 1;
		if(typeof scaleY == "undefined")scaleY = 1;
		if(typeof anchor == "undefined")anchor = NONE;
		if(typeof autoAlign == "undefined")autoAlign = NONE;
		if(typeof alpha == "undefined")alpha = 1;
		
		if(ctx != null && img != null)
		{
			var angleInRad = angle * Math.PI / 180;
			
			var hw = (img.width >> 1);
			var hh = (img.height >> 1);
			
			var xx = x;
			var yy = y;
			
			if((autoAlign & LEFT) != 0)
				xx = xx + m_offsetRatio;
			if((autoAlign & RIGHT) != 0)
				xx = xx - m_offsetRatio;
			
			if((anchor & H_CENTER) == 0)
				xx = xx + hw * scaleX;
			if((anchor & V_CENTER) == 0)
				yy = yy + hh * scaleY;
            
			ctx.save();
	
			try
			{
				ctx.translate(xx, yy);
				ctx.scale(scaleX, scaleY);
				ctx.rotate(angleInRad);
				ctx.globalAlpha = alpha;
				ctx.drawImage(img, -hw, -hh);
			}
			catch(e)
			{
				
			}
            
			ctx.restore();
		}
	};
    
    
	
    var m_last_size = 0;
	var m_last_text_width = 0;
	this.DrawString = function(string, x, y, color, size, anchor, autoAlign, is90) {
		if(typeof anchor == "undefined")anchor = NONE;
		if(typeof autoAlign == "undefined")autoAlign = NONE;
		if(typeof is90 == "undefined") is90 = false;
		
		if(m_last_size != size)
        {
            ctx.font = size+'px "'+m_font+'"';
            m_last_size = size;
        }
		
		ctx.save();
        x += m_offsetRatio;
		ctx.fillStyle = color;

		if((autoAlign & LEFT) != 0)
			x -= m_offsetRatio;
		if((autoAlign & RIGHT) != 0)
			x += m_offsetRatio;
        
		if((anchor & H_CENTER) != 0)
			x -= (ctx.measureText(string).width >> 1);
		if((anchor & RIGHT) != 0)
			x -= ctx.measureText(string).width;
		
		var angleInRad = (is90 ? 90 : 0) * Math.PI / 180;
		ctx.translate(x, y);
		ctx.rotate(angleInRad);
		ctx.fillText(string, 0, 0);
		
		ctx.restore();
		
	};
    
    this.WrapText = function(text, maxWidth, lineHeight, font_size) 
    {
        
        if(m_last_size != font_size)
        {
            ctx.font = font_size+'px "'+m_font+'"';
            m_last_size = font_size;
        }
        
        var words = text;
        var lines = new Array();
        var line_counter = 0;
        var lastIndex = 0;
        var line = '';
        var lastBreakLine = 0;
        
        for(var n = 0; n < words.length; n++) 
        {
            if(words[n] == ' ' || words[n] == '\n')
            {
                lastBreakLine = n;
            }
            line += words[n];
            var metrics = ctx.measureText(line);
            if (metrics.width >= maxWidth || n == words.length - 1) 
            {
                if(words[n] != ' ' && words[n] != '\n' && n != words.length - 1)
                {
                    line = words.substring(lastIndex, lastBreakLine);
                    n = lastBreakLine++;
                }
                
                lines[line_counter] = line;
                line_counter++;
                lastIndex = n;
                line = '';
            }
        }
        
        return {
            NumberLine:     line_counter,
            LineHeight:     lineHeight,
            Height:         lineHeight*line_counter,
            StringValue:    lines,
        };
    };
    
    this.DrawPage = function(page_text, x, y, color, size, anchor, autoAlign)
    {
		if((anchor & V_CENTER) != 0)
			y -= page_text.Height/2;
        
        var linex,liney;
        
        for(var n = 0; n < page_text.NumberLine; n++) 
        {
            linex = x;
            liney = y;

            liney = y + page_text.LineHeight*n
            
            this.DrawString(page_text.StringValue[n], linex, liney, color, size, anchor, autoAlign) ;
        }
    };
	
	this.SetFont = function(font) {
		m_font = font;
	};
	
	this.GetTextWidth = function(string, size) {
	
		ctx.save();
		ctx.font = size+'px "'+m_font+'"';
		
		m_last_text_width = Math.round(ctx.measureText(string).width);
		ctx.restore();
		return m_last_text_width;
	};
}

var Graphic = new Graphic(); 