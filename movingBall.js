window.onload = init;

var winW, winH;
var ball;
var hole;
var mouseDownInsideball;
var touchDownInsideball;
var movementTimer;
var lastMouse, lastOrientation, lastTouch;

var timer = 0;
var interval;
var intervalCheck;
                            
// Initialisation on opening of the window
function init() {
	lastOrientation = {};
	window.addEventListener('resize', doLayout, false);
	window.addEventListener('deviceorientation', deviceOrientationTest, false);
	lastMouse = {x:0, y:0};
	lastTouch = {x:0, y:0};
	mouseDownInsideball = false;
	touchDownInsideball = false;
	doLayout(document);
}
function stopGame(){
	document.body.removeEventListener('mousemove', onMouseMove, false);
	document.body.removeEventListener('mousedown', onMouseDown, false);
	document.body.removeEventListener('mouseup', onMouseUp, false);
	document.body.removeEventListener('touchmove', onTouchMove, false);
	document.body.removeEventListener('touchstart', onTouchDown, false);
	document.body.removeEventListener('touchend', onTouchUp, false);
}
function startGame(){
	document.body.addEventListener('mousemove', onMouseMove, false);
	document.body.addEventListener('mousedown', onMouseDown, false);
	document.body.addEventListener('mouseup', onMouseUp, false);
	document.body.addEventListener('touchmove', onTouchMove, false);
	document.body.addEventListener('touchstart', onTouchDown, false);
	document.body.addEventListener('touchend', onTouchUp, false);
}
function loop(){
	if(ball.x - ball.radius > hole.x - hole.radius && ball.y - ball.radius > hole.y - hole.radius){
		if(ball.x + ball.radius < hole.x + hole.radius && ball.y + ball.radius < hole.y + hole.radius){
			alert("success");
			window.clearInterval(intervalCheck);
			stop();
		}
	}
	if(ball.x < 0 + ball.radius){
		ball.x = 0+ball.radius;
	}if(ball.y < 0 + ball.radius){
		ball.y = 0+ball.radius;
	}if(ball.x > surface.width - ball.radius){
		ball.x = surface.width - ball.radius;
	}if(ball.y > surface.height - ball.radius){
		ball.y = surface.height - ball.radius;
	}
}
function start(){
	var timeElement = document.getElementById("timer");
	timeElement.innerHTML = timerToString();
	window.clearInterval(interval);
	interval = setInterval(function(){timer++;timeElement.innerHTML = timerToString();},1000);
	intervalCheck = setInterval(loop,20);  
	renderBall();
	startGame();
}

function pause(){
	window.clearInterval(interval);
	stopGame();
}
function stop(){
	timer = 0;
	window.clearInterval(interval);
	clearSurface();
	renderHole();
	stopGame();
	ball.x = Math.round(surface.width/2);
	ball.y = Math.round(surface.height/2);
}
function timerToString(){
	var seconds = Math.round(timer-timer/60);
	var minutes = Math.round(timer/60);
	if(timer < 10){seconds = "0" + seconds;}
	if(timer < 10){minutes = "0" + minutes;}
	return minutes + ":" +seconds;
}

// Does the gyroscope or accelerometer actually work?
function deviceOrientationTest(event) {
	window.removeEventListener('deviceorientation', deviceOrientationTest);
	if (event.beta != null && event.gamma != null) {
		window.addEventListener('deviceorientation', onDeviceOrientationChange, false);
		movementTimer = setInterval(onRenderUpdate, 10); 
	}
}

function doLayout(event) {
	winW = window.innerWidth;
	winH = window.innerHeight;
	var surface = document.getElementById('surface');
	//surface.width = winW;
	//surface.height = winH;
	var radius = 50;
	ball = {	radius:radius,
				x:Math.round(surface.width/2),
				y:Math.round(surface.height/2),
				color:'rgba(255, 0, 0, 255)'};


	var radiusHole = radius+5;
	hole = {	radius:radiusHole,
				x:100,
				y:100,
				color:'rgba(0,0,0,255)'};
	renderHole();
}
function clearSurface(){	
	var surface = document.getElementById('surface');
	var context = surface.getContext('2d');
	context.clearRect(0, 0, surface.width, surface.height);
}

function renderBall() {
	var surface = document.getElementById('surface');
	var context = surface.getContext('2d');
	context.beginPath();
	context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
	context.fillStyle = ball.color;
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = ball.color;
	context.stroke();		
} 
	
function renderHole() {	
	var surface = document.getElementById('surface');
	var context = surface.getContext('2d');
	context.beginPath();
	context.arc(hole.x, hole.y, hole.radius, 0, 2 * Math.PI, false);
	context.fillStyle = hole.color;
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = hole.color;
	context.stroke();		
} 

function onRenderUpdate(event) {
	var xDelta, yDelta;
	switch (window.orientation) {
		case 0: // portrait - normal
			xDelta = lastOrientation.gamma;
			yDelta = lastOrientation.beta;
			break;
		case 180: // portrait - upside down
			xDelta = lastOrientation.gamma * -1;
			yDelta = lastOrientation.beta * -1;
			break;
		case 90: // landscape - bottom right
			xDelta = lastOrientation.beta;
			yDelta = lastOrientation.gamma * -1;
			break;
		case -90: // landscape - bottom left
			xDelta = lastOrientation.beta * -1;
			yDelta = lastOrientation.gamma;
			break;
		default:
			xDelta = lastOrientation.gamma;
			yDelta = lastOrientation.beta;
	}
	moveBall(xDelta, yDelta);
}

function moveBall(xDelta, yDelta) {
	ball.x += xDelta;
	ball.y += yDelta;
	clearSurface();
	renderHole();
	renderBall();
}

function onMouseMove(event) {
	if(mouseDownInsideball){
		var xDelta, yDelta;
		xDelta = event.clientX - lastMouse.x;
		yDelta = event.clientY - lastMouse.y;
		moveBall(xDelta, yDelta);
		lastMouse.x = event.clientX;
		lastMouse.y = event.clientY;
	}
}

function onMouseDown(event) {
	var x = event.clientX;
	var y = event.clientY;
	if(	x > ball.x - ball.radius &&
		x < ball.x + ball.radius &&
		y > ball.y - ball.radius &&
		y < ball.y + ball.radius){
		mouseDownInsideball = true;
		lastMouse.x = x;
		lastMouse.y = y;
	} else {
		mouseDownInsideball = false;
	}
} 

function onMouseUp(event) {
	mouseDownInsideball = false;
}

function onTouchMove(event) {
	event.preventDefault();	
	if(touchDownInsideball){
		var touches = event.changedTouches;
		var xav = 0;
		var yav = 0;
		for (var i=0; i < touches.length; i++) {
			var x = touches[i].pageX;
			var y =	touches[i].pageY;
			xav += x;
			yav += y;
		}
		xav /= touches.length;
		yav /= touches.length;
		var xDelta, yDelta;

		xDelta = xav - lastTouch.x;
		yDelta = yav - lastTouch.y;
		moveBall(xDelta, yDelta);
		lastTouch.x = xav;
		lastTouch.y = yav;
	}
}

function onTouchDown(event) {
	event.preventDefault();
	touchDownInsideball = false;
	var touches = event.changedTouches;
	for (var i=0; i < touches.length && !touchDownInsideball; i++) {
		var x = touches[i].pageX;
		var y = touches[i].pageY;
		if(	x > ball.x - ball.radius &&
			x < ball.x + ball.radius &&
			y > ball.y - ball.radius &&
			y < ball.y + ball.radius){
			touchDownInsideball = true;		
			lastTouch.x = x;
			lastTouch.y = y;			
		}
	}
} 

function onTouchUp(event) {
	touchDownInsideball = false;
}

function onDeviceOrientationChange(event) {
	lastOrientation.gamma = event.gamma;
	lastOrientation.beta = event.beta;
}