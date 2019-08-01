 

function Object() {
	this.anchor = NONE;
    this.autoAlign = NONE;
	this.scaleX = 1;
	this.scaleY = 1;
	this.rotate = 0;
	this.alpha = 1;
	//public
	this.m_id = -1;
	//private
	this.img = null;
	this.m_x = 0;
	this.m_y = 0;
    
    var m_loaded = false;
    
	
	this.Load = function(url)
	{
		this.img = new Image();
        this.img.onload = loaded;
		this.img.src = url;
	};
    
    this.Unload = function()
    {
        this.img = null;
    }
    
    this.SetImage = function(image)
    {
        m_loaded = true;
        img =image;
    }
    
    function loaded()
    {
        m_loaded = true;
    }
    
    this.IsLoaded = function()
    {
        return m_loaded;
    }
	
	this.Draw = function() {
		if(this.img != null)
			Graphic.Draw(this.img, this.m_x, this.m_y, this.anchor, this.rotate, this.scaleX, this.scaleY, this.alpha, this.autoAlign);
	};
	
	this.Update = function()
	{
		
	};
	
	this.SetAnchor = function(anchor)
	{
		this.anchor = anchor;
	};
    
    this.SetAutoAlign = function(autoAlign)
    {
        this.autoAlign = autoAlign;
    }
	
	this.SetScale = function(x, y)
	{
		this.scaleX = x;
		this.scaleY = y;
	};
	
	this.SetRotate = function(value) {
		this.rotate = value;
	};
	
	this.SetPos = function(x, y)
	{
		this.m_x = x;
		this.m_y = y;
	};
	
	this.IsClick = function() {
       
		if(Input.IsTouchDown())
		{
			var x = this.m_x + Graphic.GetOffsetRatio();
			var y = this.m_y;
			if((this.anchor & H_CENTER) != 0)
				x = x - (this.img.width/2);
			if((this.anchor & V_CENTER) != 0)
				y = y - (this.img.height/2);
            if((this.autoAlign & LEFT) != 0)
				x = x + Graphic.GetOffsetRatio();
			if((this.autoAlign & RIGHT) != 0)
				x = x - Graphic.GetOffsetRatio();

			return Input.IsTouchInBounce(x, y,  this.img.width,  this.img.height);
		}
		return false;
	};
	
	
	
	this.IsRelease = function() {
		if(Input.IsTouchUp())
		{
			var x = this.m_x + Graphic.GetOffsetRatio();
			var y = this.m_y;
			if((this.anchor & H_CENTER) != 0)
				x = x - (this.img.width >> 1);
			if((this.anchor & V_CENTER) != 0)
				y = y - (this.img.height >> 1);
            if((this.autoAlign & LEFT) != 0)
				x = x + Graphic.GetOffsetRatio();
			if((this.autoAlign & RIGHT) != 0)
				x = x - Graphic.GetOffsetRatio();
            
			return Input.IsTouchInBounce(x, y,  this.img.width,  this.img.height);
		}
		return false;
	};
	
	
	
	this.IsPress = function() {
		if(Input.IsTouchPress())
		{
			var x = this.m_x;
			var y = this.m_y;
			
			if((this.anchor & H_CENTER) != 0)
			{
				x = x - (this.img.width >> 1) * this.scaleX;
			}
			if((this.anchor & V_CENTER) != 0)
			{
				y = y - (this.img.height >> 1) * this.scaleY;
			}
            if((this.autoAlign & LEFT) != 0)
				x = x + Graphic.GetOffsetRatio();
			if((this.autoAlign & RIGHT) != 0)
				x = x - Graphic.GetOffsetRatio();

			return Input.IsTouchInBounce(x, y,  this.img.width* this.scaleX,  this.img.height * this.scaleY);
		}
		return false;
	};
	
	
	
	this.IsDrag = function() {
		if(Input.IsTouchMove())
		{
			var x = this.m_x + Graphic.GetOffsetRatio();
			var y = this.m_y;
			if((this.anchor & H_CENTER) != 0)
				x = x - (this.img.width >> 1);
			if((this.anchor & V_CENTER) != 0)
				y = y - (this.img.height >> 1);
            if((this.autoAlign & LEFT) != 0)
				x = x + Graphic.GetOffsetRatio();
			if((this.autoAlign & RIGHT) != 0)
				x = x - Graphic.GetOffsetRatio();

			return Input.IsTouchInBounce(x, y,  this.img.width,  this.img.height);
		}
		return false;
	};
	
	this.PosX = function() {
		return this.m_x;
	};
	this.PosY = function() {
		return this.m_y;
	};
};