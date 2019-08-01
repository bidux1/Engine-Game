/**
 * Author: hung.phamviet@gameloft.com
 */

function GameCore() {

	/*
	 * Implement
	 */
    
    mCurrentState = null;
	
	//init
	this.Init = function() 
    {
        //init sound
        AudioManager.Init();

        this.ChangeState(MainState);
	}
	
	//render
	this.Render = function()
	{
        if(mCurrentState)
            mCurrentState.Draw();
	}
	//update
	this.Update = function(deltaTime)
	{
		if(mCurrentState)
            mCurrentState.Update(deltaTime);
	}    
    
	this.ChangeState = function(state) 
    {
		mCurrentState = state;
        mCurrentState.Init();
	};
}
var GameCore = new GameCore();