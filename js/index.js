// index.js

function $(aName) {
	return document.getElementById(aName);
}

// [min,max]
function rand(min,max) {
	return parseInt(Math.random()*(max-min+1))+min;
}

// 隐藏或显示一个DOM
function presentDom(aDom,show){
	var r;
	r = show ? 'block': 'none';
	aDom.style.display = r;
}


// var section
var oHeader = $('header');
var oLine = $('line');
var oStart = $('start');
var oMain = $('main');
var oBird = $('bird');
var oScore = $('score');
var oGameOver = $('gameover');
var oCurrentScore = $('currentScore');
var oBest = $('best');
var oOK = $('ok');
var oSounds = $('sounds');
var sounds = oSounds.children;

var start = false;
var score = 0;

// 方法2：js
init();
function init(){

	if(window.localStorage){
		if(!localStorage.getItem('best')){
			localStorage.setItem('best','0');
		}
	}
	else{
		console.log('no support local storeage');
	}

	// 隐藏小鸟
	presentDom(oBird,false);
	presentDom(oGameOver,false);
	// head 运动
	var top = oHeader.offsetTop;
	var t = 0;
	var step = 1;
	oHeader.moveTimer = setInterval(function(){
		t += step;
		if(t>=30){
			step = (-1);
		}
		if(t<=0){
			step = 1;
		}
		oHeader.style.top = top + t + 'px';
	},30);
	oHeader.clearTimer = function(){
		clearInterval(this.moveTimer);
		this.moveTimer = null;
	}
	// line 运动
	oLine.step = 5;
	oLine.left = oLine.offsetLeft;
	oLine.moveTimer = setInterval(function(){
		oLine.left -= oLine.step;
		if(oLine.left <= -343){
			oLine.left = 0;
		}
		oLine.style.left = oLine.left + 'px';
	},30);
	oLine.clearTimer = function(){
		clearInterval(this.moveTimer);
		this.moveTimer = null;
	}
}
// 开始游戏
oStart.onclick = function(event){
	sounds[0].pause();
	start = true;
	var e = event || window.event;
	// 兼容性
	e.stopPropagation();
	e.preventDefault();
	oHeader.clearTimer();
	presentDom(oHeader,false);
	presentDom(oStart,false);

	oBird.style.backgroundImage = "url('img/"+rand(1,3)+".gif')";
	presentDom(oBird,true);

	/************************
	   点击main(屏幕)的逻辑
	*************************/ 

	oMain.onclick = function(){
		// console.log('main click');
		/*打开音乐play()*/
	sounds[1].play();
	// 1. 鸟的上升运动
		
		clearInterval(oBird.upTimer);
		oBird.upTimer=null;
		clearInterval(oBird.downTimer);
		oBird.downTimer = null;
		
		
		var baseTop = oBird.offsetTop	
		var degree = 5		// 每次向上运动5deg
		var top = 0;		
		var up = 0;
		oBird.speed = 8;	// 每次向上运动8px
		oBird.upTimer = setInterval(function(){
			top -= oBird.speed;
			up += degree;
			oBird.style.top = baseTop + top +'px';
			oBird.style.transform = "rotate("+(-up)+"deg)";
			// 控制上升速度==减速上升
			oBird.speed -= 1;
			if(oBird.speed <= 0 ){
				oBird.clearTimer();
				// 2.鸟向下运动
				birdDown();
			}
		},30);
		oBird.clearTimer = function(){
			clearInterval(this.upTimer);
			this.upTimer = null;
		}
	
	// 向下运动
		function birdDown(){
			oBird.speed = 8;
			var down = 0;
			degree = 5;
			//待优化
			var baseDown = oBird.offsetTop;
			var downDegree = 0;
			oBird.downTimer = setInterval(function(){
				// 角度变化
				oBird.style.top = baseDown + down +'px';
				downDegree += degree;
				if(downDegree>=90){
					downDegree = 90;
				}
				oBird.style.transform = "rotate("+downDegree+"deg)";
				// 加速下落
				down += oBird.speed;
				if(down % 2 == 0){
					oBird.speed += 1;
				}
				// 旋转不会影响dom的宽和高 => scale是否影响？
				if(oLine.offsetTop <= oBird.offsetTop+oBird.offsetWidth){

					oBird.clearDownTimer();
					oLine.clearTimer();
					gameover();
				}
				
			},30);
			oBird.clearDownTimer = function(){
				clearInterval(this.downTimer);
				this.downTimer = null;
				oBird.style.top = '395px';
				oBird.style.transform = "rotate(90deg)";
			}
		}
		
	}
	/************************
	   		pipe 逻辑
	*************************/
	createPipe();
	var aaa = 0;
	function createPipe(){
		var upPipe = document.createElement('div');
		upPipe.innerHTML = "<img src='img/up_pipe.png'>";
		var downPipe = document.createElement('div');
		downPipe.innerHTML = "<img src='img/down_pipe.png'>";
		upPipe.className = "pipe up-pipe";
		downPipe.className = "pipe down-pipe";
		oMain.appendChild(upPipe);
		oMain.appendChild(downPipe);
		aaa++;
		// 水平方向
		
		// 垂直方向的定位
		var MIN_PIPE_HEIGHT = 60;
		var PIPE_SPACE = 220;
		pipHeight();
		function pipHeight(){
			/*红*/
		upPipe.addScore = true;	
		/*-红*/	
		var upPipeMaxHeight = oLine.offsetTop - MIN_PIPE_HEIGHT - PIPE_SPACE;
		var upPipeHeight = rand(MIN_PIPE_HEIGHT,upPipeMaxHeight);
		var downPipeHeight = oLine.offsetTop - PIPE_SPACE - upPipeHeight;
		var downPipeTop = oMain.clientHeight - oLine.offsetTop;
		upPipe.style.height = upPipeHeight + 'px';
		downPipe.style.height = downPipeHeight + 'px';
		downPipe.style.bottom = downPipeTop + 'px';
		upPipe.style.left = downPipe.style.left = "343px";
		}
		// pipe move to left
		upPipe.speed = 3;
		upPipe.addPipe = true;		// 是否可以添加Pipe
		// upPipe.addScore = true;
		var l = upPipe.offsetLeft;
		var w = upPipe.offsetWidth;
		// 红
		if(aaa>=1){
			upPipe.addPipe = false;
		}
		// 红-
		upPipe.moveTimer = setInterval(function(){
			if(start == false){
				upPipe.clearMoveTimer();
			}
			l -= upPipe.speed;
			upPipe.style.left = downPipe.style.left = l + 'px';
			// 红
			if(l <= -w-19 ){
				pipHeight();
				l = upPipe.offsetLeft;
				w = upPipe.offsetWidth;
			}

			// 碰撞检测
			var bt = oBird.offsetTop;
			var bl = oBird.offsetLeft;
			var br = oBird.offsetWidth+bl;
			var bb = oBird.offsetHeight+bt;

			var pl = upPipe.offsetLeft;
			var ph = upPipe.offsetHeight;

			
			if(upPipe.addScore && pl<=br && (ph>=bt || ph+PIPE_SPACE <= bb)){
				upPipe.clearMoveTimer();
				gameover();
			}
			// 每隔一定距离添加一个Pipe
			if(upPipe.addPipe && l <= 150){
				createPipe();
				upPipe.addPipe = false;
			}
			// 通过后加分
			if(upPipe.addScore && l + w < bl){
				upPipe.addScore = false;
				score++;
				var htmlStr = '';
				/*toString可以把一个逻辑值转换成字符串*/
				var scoreStr = score.toString();
				// split 可以用不同的方式分割成字符
				var scoreArray = scoreStr.split('');
				// map（）方法返回一个由原数组中的每个元素调用一个指定方法后的返回值组成的新数组
				var imgArray = scoreArray.map(function(item){
					return "<img src = 'img/"+item+".jpg'>";
				});
				// jion 用于把数组中的所有元素拼接成一个字符串
				htmlStr = imgArray.join('');
				oScore.innerHTML = htmlStr;
			}
		},30);
		upPipe.clearMoveTimer = function(){
			clearInterval(this.moveTimer);
			this.moveTimer = null;
		}
	}
	/************************
	   		gameover 逻辑
	*************************/
	function gameover(){
		presentDom(oGameOver,true);
		// 修改当前成绩
		oCurrentScore.innerHTML = score;
		// 如何缓存
		var best = localStorage.getItem('best');
		if(score > parseInt(best)){
			best = score;
		}
		localStorage.setItem('best',best);
		oBest.innerHTML = localStorage.getItem('best');
		oMain.onclick = null;
		start = false;
	}
	// 
	oOK.onclick = function(){
		location.reload();
	}

	

} 


