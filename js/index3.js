
function $(aName) {
	return document.getElementById(aName);
}

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
var oShare =$('share');
var oRule =$('rule');
var oSelect =$('select');
var oSelectnav=$('selectnav');
var oShut =$('shut');
var oShutChoose =$('shutChoose');
var oDeclaration=$('declaration');
var oFirstChoose =$("firstChoose");
var oSecondChoose=$('secondChoose');
var oReturn =$('return');
var sounds = oSounds.children;
var start = false;
var score = 0;

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
document.onkeydown = function(event){
	var e = event || window.event;
	if(e.keyCode==13){
		MoClick();
	}
};
// 动画事件
oStart.onmouseenter = function(event){
	var e = event || window.event;
		oStart.style.transform = 'scale(1.2)';
}
oStart.onmouseleave = function(event){
	var e = event || window.event;
		oStart.style.transform = 'scale(1)';
}
// 选取关数
oSelect.addEventListener('click',select,false);
function select(){
	presentDom(oHeader,false);
	presentDom(oStart,false);
	presentDom(oSelect,false);
	presentDom(oRule,false);
	presentDom(oScore,false);
	presentDom(oSelectnav,true);
}
// 点击游戏规则
oRule.addEventListener('click',rule,false);
function rule(){
	presentDom(oHeader,false);
	presentDom(oStart,false);
	presentDom(oSelect,false);
	presentDom(oRule,false);
	presentDom(oScore,false);
	presentDom(oDeclaration,true);
}
// 退出游戏说明页面
oShut.addEventListener('click',shut,false);
function shut(){
	presentDom(oDeclaration,false);
	presentDom(oHeader,true);
	presentDom(oRule,true);
	presentDom(oScore,true);
	presentDom(oStart,true);
	presentDom(oSelect,true);
}
// 退出选择关数页面
oShutChoose.addEventListener('click',shutchoose,false);
function shutchoose(){
	presentDom(oSelectnav,false);
	presentDom(oHeader,true);
	presentDom(oRule,true);
	presentDom(oScore,true);
	presentDom(oStart,true);
	presentDom(oSelect,true);
}

// 点击第一关
oFirstChoose.addEventListener('click',firstchoose,false);
function firstchoose(){
	presentDom(oSelectnav,false);
	presentDom(oHeader,true);
	presentDom(oScore,true);
	presentDom(oStart,true);
    presentDom(oReturn,true);
	oStart.style.left='60px';
    oReturn.style.left='200px';
}
// 返回第一关页面
oReturn.addEventListener('click',Returnstart,false);
function Returnstart(){
	presentDom(oHeader,true);
	presentDom(oRule,true);
	presentDom(oScore,true);
	presentDom(oStart,true);
	presentDom(oSelect,true);
    presentDom(oReturn,false);
    oStart.style.left='132px';
}
// 点击第二关
oSecondChoose.addEventListener('click',secondchoose,false);
function secondchoose(){
	window.location.href ='../FilpBird-2/index.html';
}

// 开始游戏
oStart.addEventListener('click',MoClick,false);
function MoClick(event){
	sounds[0].pause();
	start = true;
	var e = event || window.event;
	e.preventDefault();
	oHeader.clearTimer();
	presentDom(oHeader,false);
	presentDom(oStart,false);
    presentDom(oRule,false);
    presentDom(oSelect,false);
	oBird.style.backgroundImage = "url('img/"+rand(1,3)+".gif')";
	presentDom(oBird,true);
    presentDom(oReturn,false);
	/************************
	   点击main(屏幕)的逻辑
	*************************/ 
	// 小鸟的运动
	oMain.addEventListener('click',clickTo,false);
	function clickTo(){
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
				birdDown();}
			if(oBird.offsetTop<=8){
				oBird.style.top ='0px';
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
					sounds[4].play();
					gameover();
				}
			},30);
			
		}
		
	}
	oBird.clearDownTimer = function(){
				clearInterval(this.downTimer);
				this.downTimer = null;
				oBird.style.top = '395px';
				oBird.style.transform = "rotate(90deg)";
			}
	/*改的键盘事件*/
	document.onkeydown = function(event) {
			var e = event || window.event;
			if(e.keyCode != 70){
				clickTo();
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
		var MIN_PIPE_HEIGHT = 60;
		var PIPE_SPACE = 150;
		pipHeight();
		function pipHeight(){
		upPipe.addScore = true;	
		var upPipeMaxHeight = oLine.offsetTop - MIN_PIPE_HEIGHT - PIPE_SPACE;
		var upPipeHeight = rand(MIN_PIPE_HEIGHT,upPipeMaxHeight);
		var downPipeHeight = oLine.offsetTop - PIPE_SPACE - upPipeHeight;
		var downPipeTop = oMain.clientHeight - oLine.offsetTop;
		upPipe.style.height = upPipeHeight + 'px';
		downPipe.style.height = downPipeHeight + 'px';
		downPipe.style.bottom = downPipeTop + 'px';
		upPipe.style.left = downPipe.style.left = "345px";
		}
		upPipe.speed = 1;
		upPipe.addPipe = true;		// 是否可以添加Pipe
		var l = upPipe.offsetLeft;
		var w = upPipe.offsetWidth;
		if(aaa>=1){
			upPipe.addPipe = false;
		}
		upPipe.moveTimer = setInterval(function(){
			if(start == false){
				upPipe.clearMoveTimer();
			}
			l -= upPipe.speed;
			upPipe.style.left = downPipe.style.left = l + 'px';
			// 管子回到原来的位置
			if(l <= -w-2 ){
				pipHeight();
				l = upPipe.offsetLeft;
			
			}
			var bt = oBird.offsetTop;
			var bl = oBird.offsetLeft;
			var br = oBird.offsetWidth+bl;
			var bb = oBird.offsetHeight+bt;
			var pl = upPipe.offsetLeft;
			var ph = upPipe.offsetHeight;
			// 超过上方游戏界面
			if(upPipe.addScore &&bt<=8){
				sounds[2].play();
				oBird.offsetTop=0;
				gameover();
			}
			// 碰撞管子
			if(upPipe.addScore && pl<=br && (ph>=bt || ph+PIPE_SPACE <= bb)){
				sounds[2].play();
				upPipe.clearMoveTimer();
				gameover();
			}
			
			// 创建第二根管子
			if(upPipe.addPipe && l <= 140.5){
				createPipe();
				upPipe.addPipe = false;
			}
			// 通过后加分
			if(upPipe.addScore && l + w < bl){
				sounds[3].play();
				upPipe.addScore = false;
				score++;
				var htmlStr = '';
				var scoreStr = score.toString();
				var scoreArray = scoreStr.split('');
				var imgArray = scoreArray.map(function(item){
					return "<img src = 'img/"+item+".jpg'>";
				});
				htmlStr = imgArray.join('');
				oScore.innerHTML = htmlStr;
			}
		},10);
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
		oMain.removeEventListener('click',clickTo,false);
		document.onkeydown = null;
		oBird.clearDownTimer();
		oLine.clearTimer();

		// 键盘事件
	document.addEventListener('keydown',function(event){
		var e = event || window.event;
		if(e.keyCode == 70){
			location.reload();
		}
	},false);
	}
	oOK.onclick = function(){
		location.reload();
	}
	// 动画缩放
	oOK.onmouseenter = function(event){
	var e = event || window.event;
		oOK.style.transform = 'scale(1.2)';
	}
	oOK.onmouseleave = function(event){
	var e = event || window.event;
		oOK.style.transform = 'scale(1)';
	}
}



