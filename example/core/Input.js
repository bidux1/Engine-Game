 

function Input()
{
	const TOUCH_NONE	=	1<<0;
	const TOUCH_UP		=	1<<1;
	const TOUCH_DOWN	=	1<<2;
	const TOUCH_MOVE	=	1<<3;
	const TOUCH_PRESS	=	1<<4;
	
	var rect = null;

	var state = 0;	
	var m_canvas = null;
	
	var m_touchX = 0;
	var m_touchY = 0;
	
	var m_touchDX = 0;
	var m_touchDY = 0;
	
	var m_currentDY = 0;
	
	var m_isTouchDevice = true;
	
	var m_scaleX = 1;
	var m_scaleY = 1;
	
	this.Init = function()
	{
		rect = Graphic.GetCanvas().getBoundingClientRect();
		var canvas = Graphic.GetCanvas();
		if(canvas != null)
		{
			canvas.addEventListener("mousedown", OnMouseDown, false);
			canvas.addEventListener("mousemove", OnMouseMove, false);
			canvas.addEventListener("mouseup", OnMouseUp, false);
			
			canvas.addEventListener("touchstart", OnMouseDown, false);
			canvas.addEventListener("touchmove", OnMouseMove, false);
			canvas.addEventListener("touchend", OnMouseUp, false);
            
            canvas.addEventListener("touchcancel", PreventDefault, false);
            canvas.addEventListener("touchleave", PreventDefault, false);
			
			Utility.log("Input init done...");
			
			this.m_canvas = canvas;
		}
		else Utility.log("Input init: Canvas is null");
		
		m_isTouchDevice = this.CheckTouchDevice();
	};
    
    function PreventDefault(e)
    {
        e.preventDefault();
    }
	
	this.CheckTouchDevice = function(){
	    return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
	};
	this.isTouchDevice = function(){
	    return m_isTouchDevice;
	};
	function OnMouseDown(e)
	{
		state = TOUCH_DOWN;
		GetMousePos(e);
		//GetMouseDelta(e);
        
		e.preventDefault();
	}
	
	function OnMouseUp(e)
	{
		state = TOUCH_UP;
		GetMousePos(e);
		//GetMouseDelta(e);
        
		e.preventDefault();
	}
	
	function OnMouseMove(e)
	{
		
		if((state & TOUCH_PRESS) != 0)
		{
			state |= TOUCH_MOVE;
			GetMouseDelta(e);
			
		}
		e.preventDefault();
	}
	
	function GetMousePos(e)
	{		
        
        m_touchDX = m_touchDY = 0;
        
		if(m_isTouchDevice)
		{
			var touches = e.changedTouches;
			if(touches && touches.length > 0)
			{
				m_touchX = touches[0].pageX - rect.left;
				m_touchY = touches[0].pageY - rect.top;
			}
		}
		else
		{
	        m_touchX = e.pageX - rect.left;
	        m_touchY = e.pageY - rect.top;
		}
        
        m_touchX *= m_scaleX;
        m_touchY *= m_scaleY;
        ///*
        if(!Graphic.IsPortrait())
        {
            var temp = m_touchX;
            m_touchX = m_touchY;
            m_touchY = temp;
            m_touchX = Graphic.RealHeight() - m_touchX;
        }
        
	};
	
	function GetMouseDelta(e)
	{
		var pageXVal = 0;
        var pageYVal = 0;
		if(m_isTouchDevice)
		{
			var touches = e.changedTouches;
			if(touches.length > 0)
			{
                if(!Graphic.IsPortrait())
                {
                    //m_touchDX = (touches[0].pageX - rect.left) - m_touchX/m_scaleX;
                    //m_touchDY = (touches[0].pageY - rect.top) - m_touchY/m_scaleY;
                    pageXVal = (touches[0].pageX - rect.top);
                    pageYVal = (touches[0].pageY - rect.top);
                    //m_touchDX = (pageYVal - rect.top) - m_touchX/m_scaleX;
                    //m_touchDY = (touches[0].pageX - rect.left) - m_touchY/m_scaleY;
                }
                else 
                {
                    m_touchDX = (touches[0].pageX - rect.left) - m_touchX/m_scaleX;
                    m_touchDY = (touches[0].pageY - rect.top) - m_touchY/m_scaleY;
                }
			}
		}
		else
		{
            if(!Graphic.IsPortrait())
            {
                m_touchDY = (e.pageY - rect.left) - m_touchX/m_scaleX;
                m_touchDX = (e.pageX - rect.top) - m_touchY/m_scaleY;
            }
            else 
            {
                m_touchDX = (e.pageX - rect.left) - m_touchX/m_scaleX;
                m_touchDY = (e.pageY - rect.top) - m_touchY/m_scaleY;
            }
		}
		
        
        ///*
        if(!Graphic.IsPortrait())
        {
            //m_touchDX *= m_scaleY;
            //m_touchDY *= m_scaleX;
            pageXVal *= m_scaleX; 
            pageYVal *= m_scaleY; 
            pageYVal = Graphic.RealHeight() - pageYVal;
            
            m_touchDX = pageYVal - m_touchX;
            m_touchDY = pageXVal - m_touchY;
        }
        else
        {
            m_touchDX *= m_scaleX;
            m_touchDY *= m_scaleY;
        }
        //*/
	}
	
	this.Update = function()
	{
		if((state & TOUCH_DOWN) != 0)
		{
			state &= ~TOUCH_DOWN;
			state |= TOUCH_PRESS;
		}
		
		if((state & TOUCH_MOVE) != 0)
		{
			state &= ~TOUCH_MOVE;
		}
		
		if((state & TOUCH_UP) != 0)
			state = TOUCH_NONE;
	};
    
    this.Draw = function()
    {
        if(DEBUG)
        {
            if(this.IsTouchPress())
            {
                var ctx = Graphic.GetContext();
                ctx.beginPath();
                ctx.arc(m_touchX + m_touchDX, m_touchY + m_touchDY, 20, 0, 2 * Math.PI, false);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
            }
        }
    };
	
	this.IsTouchDown = function() {
		return ((state & TOUCH_DOWN) != 0?true:false);
	};
	
	this.IsTouchUp = function() {
		return ((state & TOUCH_UP) != 0?true:false);
	};
	
	this.IsTouchMove = function() {
		return ((state & TOUCH_MOVE) != 0?true:false);
	};
	
	this.IsTouchPress = function() {
		return ((state & TOUCH_PRESS) != 0?true:false);
	};
	
	this.IsTouchInBounce = function(x, y, w, h) {
		
		var touchX = m_touchX;
		var touchY = m_touchY;

		if(
			touchX < x ||
			touchY < y ||
			touchX > (x + w) ||
			touchY > (y + h)
			)return false;
		
		return true;
	};
	
	this.GetDX = function()
	{
		return m_touchDX;
	}
	
	this.GetDY = function()
	{
		return m_touchDY;
	}
    
    this.GetTouch = function()
    {
        return {x:m_touchX, y:m_touchY};
    }
	
	this.SetScale = function(x, y)
	{
		m_scaleX = x;
		m_scaleY = y;
	}
}

var Input = new Input();