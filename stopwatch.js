// JavaScript Document

myNameSpace = function(){
        
	var timer_id = 0;
	var offset = 10;
	var lineHeight = 180;
	
	// set to true if time is running
	var isTimeStarted = false;
	// set to true only if time is run for the first time
	var hasTimerStarted = false;
	
	// stores running time
	var secTime = 0;
	var minTime = 0;
	var hourTime = 0;
	
	// stores the set timer
	var secTimer = 0;
	var minTimer = 0;
	var hourTimer = 0;	
	
	// true if stopwatch mode, false if timer mode
	var isStopwatch = true;

	// Public functions ******************************************************************************************
	
	function init()
	{
		// in iPad, the background image, when rendered, is kinda sucky, so change it to just a backgroundcolor
		doIpadBackground();
		              
		generateNumbers(hours,24);
		generateNumbers(minutes,60);
		generateNumbers(seconds,60);
		
		setContainerSize();
		positionNumbers();  
		onResizeWindow();     
		
		body.style.opacity = "1";    
	}
	
	function onResizeWindow()
	{
		centerBox(container);
		positionControls(startButton,stopButton);
		positionHeaders(stopwatch,timer);
		
		positionArrows(hours,arrowUpHour,arrowDownHour);
		positionArrows(minutes,arrowUpMin,arrowDownMin);
		positionArrows(seconds,arrowUpSec,arrowDownSec);
		
		positionAbout(about);
		positionLinks(links);
	}
	
	function startTime()
	{                        
		if(isTimeStarted)
		{
			window.clearInterval(timer_id);
			startButton.innerHTML = "Resume";
		}
		else
		{
			if (isStopwatch)
			{				
				var offsetTop = offset + "px";
								   
				timer_id = window.setInterval(function(){
						secTime++;                       
						if (secTime == 60)
						{
							seconds.style.top = offsetTop;
							secTime = 0;
							
							minTime++;
							if (minTime == 60)
							{
								minutes.style.top = offsetTop;
								minTime = 0;
								
								hourTime++;
								if (hourTime == 24)
								{
									resetTime();
								}
								else
								{
									hours.style.top = hours.offsetTop - lineHeight + "px";
								}
							}
							else
							{
								alarm.play();
								minutes.style.top = minutes.offsetTop - lineHeight + "px";
							}							
						}
						else
						{
							seconds.style.top = seconds.offsetTop - lineHeight + "px";
						}
					},1000);					
			}
			else // if timer mode
			{
				if (!hasTimerStarted)
				{
					saveTimer();
					showArrows(false);
					hasTimerStarted = true;
				}
				
				timer_id = window.setInterval(function(){
						secTime--;                       
						if (secTime == -1)
						{	
							seconds.style.top = offset + lineHeight - seconds.offsetHeight;
							secTime = 59;
							
							minTime--;
							if (minTime == -1)
							{	
								minutes.style.top = offset + lineHeight - minutes.offsetHeight;
								minTime = 59;
								
								hourTime--;
								if (hourTime == -1)
								{
									// sound the alarm
									alarm.play();
									resetTime();
								}
								else
								{
									hours.style.top = hours.offsetTop + lineHeight + "px";
								}						
							}
							else
							{
								minutes.style.top = minutes.offsetTop + lineHeight + "px";
							}							
						}
						else
						{
							seconds.style.top = seconds.offsetTop + lineHeight + "px";
						}
					},1000);
			}
				
			startButton.innerHTML = "Stop";                   
		}
		isTimeStarted = !isTimeStarted;
	}
	
	function resetTime()
	{
		window.clearInterval(timer_id);
		isTimeStarted = false;
		hasTimerStarted = false;
		
		if (isStopwatch)
		{
			secTime = 0;
			minTime = 0;
			hourTime = 0;
			
			seconds.style.top = offset + "px";
			minutes.style.top = offset + "px";
			hours.style.top = offset + "px";                
		}
		else
		{
			secTime = secTimer;
			minTime = minTimer;
			hourTime = hourTimer;
			
			seconds.style.top = offset - (lineHeight * secTime) + "px";
			minutes.style.top = offset - (lineHeight * minTime) + "px";
			hours.style.top = offset - (lineHeight * hourTime) + "px";		
			
			showArrows(true);	
		}
		
		startButton.innerHTML = "Start";
	}
	
	function stopWatchClicked()
	{
		stopwatch.style.backgroundColor = "rgba(30,144,255,0.7)";
		timer.style.backgroundColor = "transparent";
		
		isStopwatch = true;
		resetTime();
		showArrows(false);	
	}
	
	function timerClicked()
	{
		stopwatch.style.backgroundColor = "transparent";
		timer.style.backgroundColor = "rgba(30,144,255,0.7)";
		
		// resetTime() doesnt reset the set timer, so we have to manually reset it.
		secTimer = 0;
		minTimer = 0;
		hourTimer = 0;
		
		isStopwatch = false;
		resetTime();
		showArrows(true);		
	}
	
	function arrowClicked(hook,isUp)
	{
		var offsetY,remainder;
		
		if (isUp)
		{
			if (hook.offsetTop >= offset)
			{
				offsetY = offset + lineHeight - hook.offsetHeight;	
			}
			else
			{
				offsetY = hook.offsetTop + lineHeight;
				remainder = (offsetY-offset) % lineHeight;
				if (remainder != 0)
				{
					offsetY += lineHeight - remainder;
				}
				
				if (offsetY > offset)
				{
					offsetY = offset + lineHeight - hook.offsetHeight;
				}
			}			
		}
		else
		{
			if (hook.offsetTop <= offset + lineHeight - hook.offsetHeight)
			{
				offsetY = offset;
			}
			else
			{
				offsetY = hook.offsetTop - lineHeight;
				remainder = (offsetY-offset) % lineHeight;
				if (remainder != 0)
				{
					offsetY -= remainder + lineHeight;
				}
				
				if (offsetY < offset + lineHeight - hook.offsetHeight)
				{
					offsetY = offset;
				}
			}				
		}		
		hook.style.top = offsetY + "px";
	}
	
	function aboutOver()
	{
		about.innerHTML = "Works best on Chrome, Safari and Firefox.<br>Also works on Opera and iOS/Android devices.<br>Screw internet explorer!!!<br><br>Made by Roy Evan Sia<br>Using javascript, css(3) and a bit of html5";		
		about.className = "about aboutOver";
		positionAbout(about);
	}
	
	function aboutOut()
	{
		about.innerHTML = "i";
		about.className = "about";
		positionAbout(about);	
	}
	
	// End of Public functions ************************************************************************************
	
	function doIpadBackground()
	{
		if (navigator.userAgent.indexOf('iPad') != -1)	
		{
			body.className = "ipadBody";
		}
	}
	
	function saveTimer()
	{
		secTimer = (offset-seconds.offsetTop) / lineHeight;
		minTimer = (offset-minutes.offsetTop) / lineHeight;
		hourTimer = (offset-hours.offsetTop) / lineHeight;	
		
		secTime = secTimer;
		minTime = minTimer;
		hourTime = hourTimer;
	}
	
	function setContainerSize()
	{
		container.style.width = hours.offsetWidth + sep1.offsetWidth + minutes.offsetWidth + sep2.offsetWidth + seconds.offsetWidth + "px";
	}
	
	function generateNumbers(id,max)
	{
		id.innerHTML = "";
		for(var i = 0; i < max; i++)
		{
			id.innerHTML += ((i<10)?"0"+i:i) + "<br />"
		}
	}

	function centerBox(id)
	{
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;
		
		var elemWidth = id.offsetWidth;
		var elemHeight = id.offsetHeight;
		
		id.style.top = (windowHeight / 2) - (elemHeight / 2) + "px";
		id.style.left = (windowWidth / 2) - (elemWidth / 2) + "px";
	}
	
	function positionNumbers()
	{
		hours.style.left = offset + "px";
		sep1.style.left = offset + hours.offsetWidth + "px";
		minutes.style.left = offset + hours.offsetWidth + sep1.offsetWidth + "px";
		sep2.style.left = offset + hours.offsetWidth + sep1.offsetWidth + minutes.offsetWidth + "px";
		seconds.style.left = offset + hours.offsetWidth + sep1.offsetWidth + minutes.offsetWidth + sep2.offsetWidth + "px";
	}
	
	function positionHeaders(stopwatch,timer)
	{
		stopwatch.style.top = container.offsetTop - 100 + "px";
		timer.style.top = container.offsetTop - 100 + "px";
		
		stopwatch.style.left = window.innerWidth / 2 - stopwatch.offsetWidth + "px";
		timer.style.left = window.innerWidth / 2 + "px";
	}
	
	function positionControls(start,stop)
	{
		start.style.top = container.offsetTop + container.offsetHeight + 35 + "px";
		stop.style.top = container.offsetTop + container.offsetHeight + 35 + "px";
		
		start.style.left = window.innerWidth / 2 - 10 - start.offsetWidth + "px";
		stop.style.left = window.innerWidth / 2 + 10 + "px";
	}
	
	function positionArrows(hook,arrowUp,arrowDown)
	{
		var offsetX = hook.offsetLeft + (hook.offsetWidth / 2) + (arrowUp.offsetWidth / 2) - 20;
		
		arrowUp.style.left = container.offsetLeft + offsetX + "px";
		arrowDown.style.left = container.offsetLeft + offsetX + "px";
		
		arrowUp.style.top = container.offsetTop - (arrowUp.offsetHeight / 2) + "px";
		arrowDown.style.top = container.offsetTop + container.offsetHeight - (arrowDown.offsetHeight / 2) + "px";
	}
	
	function positionLinks(links)
	{
		links.style.top = window.innerHeight - 10 - links.offsetHeight + "px";	
		links.style.left = window.innerWidth - 10 - links.offsetWidth + "px";
	}
	
	function positionAbout(about)
	{
		about.style.top = "10px";
		about.style.left = 	window.innerWidth - 20 - about.offsetWidth + "px";
	}
	
	function showArrows(isShow)
	{
		if (isShow)
		{
			arrowDownHour.style.visibility = "visible";
			arrowUpHour.style.visibility = "visible";
			arrowDownMin.style.visibility = "visible";
			arrowUpMin.style.visibility = "visible";
			arrowDownSec.style.visibility = "visible";
			arrowUpSec.style.visibility = "visible";
		}
		else
		{
			arrowDownHour.style.visibility = "hidden";
			arrowUpHour.style.visibility = "hidden";
			arrowDownMin.style.visibility = "hidden";
			arrowUpMin.style.visibility = "hidden";
			arrowDownSec.style.visibility = "hidden";
			arrowUpSec.style.visibility = "hidden";
		}
	}
	
	return {
		init: init,
		onResizeWindow: onResizeWindow,
		startTime: startTime,
		resetTime: resetTime,
		stopWatchClicked: stopWatchClicked,
		timerClicked: timerClicked,
		arrowClicked: arrowClicked,
		aboutOver: aboutOver,
		aboutOut: aboutOut
	}

}();