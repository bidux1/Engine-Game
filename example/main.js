/**
 * Author: hung.phamviet@gameloft.com
 */

const MAIN_STATE_INIT		=	1 << 0;
const MAIN_STATE_COMPLETED	=	1 << 1;

var state = MAIN_STATE_INIT;

var m_log = "";
this.SetLog = function(str)
{
    m_log = str;
};

//Init graphic
function Init()
{
	//document.addEventListener('pageshow',PageShow, false);

	//document.addEventListener('pagehide',PageHide, false);
    
    //window.onfocus = PageShow;
    
    //window.onblur = PageHide;
	
	//init graphic
	Graphic.Init(false);
	
	//set default font
	Graphic.SetFont('AGENCY');
	
	
	Input.Init();
	GameCore.Init();
}

function PageShow()
{
	//GameCore.Show();
}
function PageHide()
{
	//GameCore.Hide();
}

function OnResize()
{
	
};

//update game function
function update(time) {
	
	//update game
	GameCore.Update(time);
	
	//update input
	Input.Update();
	
}

//Main render
function render() {
	
	if(Graphic.Available())
	{
		//clear screen first
		Graphic.Clear();
		
		//render game
		GameCore.Render();
		
		//draw fps
        if(DEBUG)
            Graphic.DrawString("fps: " + fps.toFixed(0), Graphic.width - 10, 30, "#FF0000", 30, RIGHT);
		
        //draw debug
        if(DEBUG)
            Graphic.DrawString(VERSION + " " + m_log, 10, 30, "#FFFFFF", 20, LEFT);
        
        //draw input
        Input.Draw();
		
	}
	
}

var time, fps;
var fps_limit = 60;
var interval = 1000 / fps_limit;
var total_fps = 0;
var average_fps = 0;
var cur_frame = 0;

function SetLimitFps(value)
{
    fps_limit = value;
    interval = 1000 / fps_limit;
}

//Main loop
function run() {
	var now = new Date().getTime();
    var dt = now - (time || now);
	fps = 1000 / dt;
	time = now;
    
    /*
    cur_frame++;
    total_fps += fps;
    average_fps = total_fps / cur_frame;
    */

	switch(state)
	{
	case MAIN_STATE_INIT:
		var x = document.readyState;
		if(x == "complete")
		{
            var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
            var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
            if(w * h > 0)//fix back screen
            {
                Init();
                state = MAIN_STATE_COMPLETED;
            }
		}
		break;
	case MAIN_STATE_COMPLETED:
		
		update(dt/1000);
	    render();
		break;
	}
	
    
	now = new Date().getTime();
	dt = now - time;
	
	if(dt < interval)
		dt = interval - dt;
    else dt = 0;
    
	setTimeout( run, dt);
    
    //SetLog(""+dt);
}

function load_binary_resource(url) 
{
	var req = new XMLHttpRequest();
	req.open('GET', url, false);
	
	req.overrideMimeType('text/plain; charset=x-user-defined');
	req.send(null);
	
	if (req.status != 200) 
	{
		document.write("LOAD FAIL");
		return '';
	}
	
	return req.responseText;
}

// run the game
run();
