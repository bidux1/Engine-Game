 


function Button(sprite, animID) 
{
    var anim = null;
    var x = 0;
    var y = 0;
    var w = 0;
    var h = 0;
    
    var rect = new Rect();
    
    if(typeof(sprite) != 'undefined' && sprite != null)
    {
        anim = new Animation(sprite);
        anim.SetAnim(animID);
    }
    
	this.Draw = function() 
    {
		if(anim != null)
        {
			anim.Render();
        }
        
        if(DEBUG)
        {
            if(anim != null)
                rect = anim.GetRect();
            Graphic.DrawRect(rect.x, rect.y, rect.width, rect.height, "#ff00ff");
        }
	};
    
    this.Update = function()
    {
    };
    
    this.SetPos = function(xx, yy)
    {
        if(anim != null)
        {
            anim.SetPos(xx, yy);
        }
        else
        {
            x = xx;
            y = yy;
            
            rect.x = x;
            rect.y = y;
        }
    };
    
    this.SetSize = function(ww, hh)
    {
        if(anim == null)
        {
            w = ww;
            h = hh;

            rect.width = w;
            rect.height = h;
        }
    };
    
    this.IsClick = function() {
		if(Input.IsTouchDown())
		{
            if(anim != null)
            {
                rect = anim.GetRect();
                return Input.IsTouchInBounce(rect.x, rect.y,  rect.width,  rect.height);
            }
            else
            {
                return Input.IsTouchInBounce(x, y,  w,  h);
            }
		}
		return false;
	};
	
	
	
	this.IsRelease = function() {
		if(Input.IsTouchUp())
		{
            if(anim != null)
            {
                rect = anim.GetRect();
                return Input.IsTouchInBounce(rect.x, rect.y,  rect.width,  rect.height);
            }
            else
            {
                return Input.IsTouchInBounce(x, y,  w,  h);
            }
		}
		return false;
	};
	
	
	
	this.IsPress = function() 
    {
		if(Input.IsTouchPress())
		{
            if(anim != null)
            {
                rect = anim.GetRect();
                return Input.IsTouchInBounce(rect.x, rect.y,  rect.width,  rect.height);
            }
            else
            {
                return Input.IsTouchInBounce(x, y,  w,  h);
            }
		}
		return false;
	};
}