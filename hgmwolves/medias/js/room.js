var mapCanvas = document.getElementById('mapCanvas');
var gameboard = document.getElementById('gameboard');
var readyButton1 = document.getElementById('Ready1');
var QuitDiv = document.getElementById('QuitDiv');
var cover = document.getElementById('cover');
var readyButton2 = document.getElementById('Ready2');
var gamer1Name = document.getElementById('gamer1Name');
var gamer2Name = document.getElementById('gamer2Name');
var gamer1Grade = document.getElementById('gamer1Grade');
var gamer2Grade = document.getElementById('gamer2Grade');
var gamer1Image = document.getElementById('gamer1Image');
var gamer2Image = document.getElementById('gamer2Image');
var TimerDiv = document.getElementById('Timer');
var ChatBoard = document.getElementById('ChatBoard');
ChatBoard.innerHTML = '';
var Gun = document.getElementById('Gun');
var nowGameID;
var white = new Image();
var black = new Image();
var rowHeight = 36;
var timeSet = 600;
var Timer;
var gaming = false;
var roomName;
var myName;
var mySeat;
var myColor = false;
var myTurn = true;
var TimerOn = false;
var TimerValue;
var getTime;
var chat = true;
var TimeCount = -1;
var player1 = new Object(), player2 = new Object();
player1.ready = player2.ready = false;
player1.score = player2.score = -1;
player1.avatar = player2.avatar = 0;
TimerDiv.style.display = 'none';

var map = new Array;          //记录地图
for (var i = 0; i < 15; i++){
	map[i] = new Array;
	for(var j = 0; j < 15; j++){
		map[i][j] = 0;
	}
}

white.src = '/medias/img/white.png';
black.src = '/medias/img/black.png';
var mouseX, mouseY;

function mouseMove(ev) { 
	Ev= ev || window.event; 
	var mousePos = mouseCoords(Ev); 
	mouseX = mousePos.x - 223 - 57;
	mouseY = mousePos.y - 70 - 68;
} 


function setTimer(){
	if(gaming == false){
		TimerDiv.style.display = 'none';
	}
	else{
		TimerDiv.style.display = 'block';		
		TimeCount = getTime;
		if((myTurn && mySeat == 0) || (!myTurn && mySeat == 1)){
			TimerDiv.style.left = '15px';
		}
		else if((myTurn && mySeat == 1) || (!myTurn && mySeat == 0)){
			TimerDiv.style.left = '795px';
		}
		else{
			TimerDiv.style.display = 'none';
		}
		if(TimeCount == 0 && myTurn){
			alert('超时！您本局为负！');
			gaming = false;
		}
		if(!gaming || isNaN(TimeCount)|| TimeCount < 0){
			TimerDiv.style.display = 'none';
		}
		else{
			TimerDiv.style.display = 'block';
			TimerDiv.innerHTML = Math.floor(TimeCount / 60).toString() +':'+ Math.floor((TimeCount % 60)).toString();  
		}	
	}
}


function newGame(){
	for(var i = 0; i < 15; i++){
		for(var j = 0; j < 15; j++){
			map[i][j] = 0;
		}
	}
}

function getMap(){
	$.getJSON("/GetMap/",{'rName': roomName},function(ret){
		if(ret['str'] == '0'){
			var x, y, gamer;
			x = parseInt(ret['x']);
			y = parseInt(ret['y']);
			gamer = ret['gamer'];
			getTime = TimerValue - ret['timer']; 
			for(var i = 0; i < 15; i++){
				for(var j = 0; j < 15; j++){
					map[i][j] = ret['map'][i][j];
				}
			}	
			if(ret['Winner'] == 1){
				drawMap();
				alert('本局结束！' + player1.name + '获胜！');
				gaming = false;
			}
			else if(ret['Winner'] == 2){
				drawMap();
				alert('本局结束！' + player2.name + '获胜！');
				gaming = false;
			}
			else if(ret['Winner'] == 3){
				drawMap();
				alert('本局结束！' + '和棋！');
				gaming = false;
			}
			if(myTurn != (gamer == mySeat + 1)){
				TimeCount = TimerValue;
				myTurn = (gamer == mySeat + 1);
			}
			if(ret['back'] != 0){
				if(ret['back'] == 1002 - mySeat){
					alert('悔棋被拒绝');
					$.getJSON("/ReBack/",{'rName': roomName},function(ret){
							
					})
				}
				else if(ret['back'] == 1001 + mySeat){
					//alert('您残忍拒绝了他');
				}
				else if(ret['back'] != mySeat + 1){
					var accept = confirm('大人，对方想悔棋，可否？取消即为拒绝。');
					var str;
					if(accept){
						if(2 - myTurn == 1){
							str = '1';
						}
						else{
							str = '2';
						}
						$.getJSON("/Regret/",{'rName': roomName, 'step': str},function(ret){
							
						})
					}
					else{
						if(mySeat == 0){
							str = '0';
						}
						else{
							str = '1';
						}
						$.getJSON("/Noback/",{'rName': roomName, 'seat' : str}, function(ret){
							
						})
					}
				}
				else{
					alert('您已怂逼，等待对方同意');
				}
			}
			if(ret['draw'] != 0){
				if(ret['draw'] == 1001 + mySeat){
					alert('求和被拒绝');
					$.getJSON("/ReDraw/",{'rName': roomName},function(ret){
							
					})
				}
				else if(ret['draw'] == 1002 - mySeat){
					//alert('您残忍拒绝了他');
				}
				else if(ret['draw'] != mySeat + 1){
					var accept = confirm('大人，对方想求和，可否？取消即为拒绝。');
					var str;
					if(accept){
						$.getJSON("/Draw/",{'rName': roomName},function(ret){
							
						})
					}
					else{
						if(mySeat == 0){
							str = '0';
						}
						else{
							str = '1';
						}
						$.getJSON("/NoDraw/",{'rName': roomName, 'seat' : str}, function(ret){
							
						})
					}
				}
				else{
					alert('您已求和，等待对方同意');
				}
			}
			
		}
	})
}

function drawMap(){
	context = mapCanvas.getContext('2d');
	clearMap();
	for(var i = 0; i < 15; i++){
		for(var j = 0; j < 15; j++){
			if(map[i][j] == 1){
				context.drawImage(black, rowHeight * i + 10,rowHeight * j + 13);
			}
			else if(map[i][j] == 2){
				context.drawImage(white, rowHeight * i + 8,rowHeight * j + 11);
			}
		}
	}
}

function clearMap(){
	var ctx = mapCanvas.getContext('2d');
	ctx.clearRect(0, 0, 555, 555);
}

mapCanvas.onclick = function(e){
	if(myTurn){
		var x, y, row, col;
		x = e.offsetX - 20;
		y = e.offsetY - 25;
		//alert(x +'|' + x % rowHeight + '|' + y + '|'+ y % rowHeight);
		if(x % rowHeight < 15){
			row = Math.floor(x / rowHeight);
		}
		else if(x % rowHeight > 22){
			row = Math.floor(x / rowHeight) + 1;
		}
		else{
			row = -1;
		}
		if(y % rowHeight < 15) {
			col = Math.floor(y / rowHeight);
		}
		else if(y % rowHeight > 22){
			col = Math.floor(y / rowHeight) + 1;
		}
		else{
			col = -1;
		}
		if(map[row][col] == 0){
			$.getJSON("/MoveChess/",{'rName': roomName, 'row': row, 'col': col, 'Gamer': mySeat + 1},function(ret){
				if(ret['winner'] == 1){
					getMap();
				}
				else if(ret['winner'] == 2){
					getMap();
				}
			})
		}
	}
}

function checkKick(){
	$.getJSON("/CheckKick/",{'rName': roomName}, function(ret){
		if(ret['str'] == 'Yes!'){
			alert('你被房主踢出了房间！');
			window.location.href = getBack();
			$.getJSON("/ReKick/",{'rName': roomName}, function(ret){
			})
		}
    })
}


gameboard.style.left = (window.innerWidth /2 - 500).toString() + 'px';
gameboard.style.top = (window.innerHeight /2 - 350).toString() + 'px';




window.onresize = function(){
	gameboard.style.left = (window.innerWidth /2 - 500).toString() + 'px';
	gameboard.style.top = (window.innerHeight /2 - 350).toString() + 'px';
}

roomName = getRoomName();
getMyName();
getPlayer();
setReady();
window.setInterval(MainLoop, timeSet);      //轮询


function MainLoop(){
	getPlayer();
	setReady();
	if(chat){
		getChat();
	}
	if(mySeat == 1){
		checkKick();
	}
	if (gaming){
		getMap();
		drawMap();
		setWhite();
	}
	else{
		getGame();
	}
	setTimer();
}

function setWhite(){
	var blacker = document.getElementById('Blacker');
	var whiter = document.getElementById('Whiter');
	if(myColor == true){
		blacker.style.left = '870px';
		whiter.style.left = '90px';
	}
	else{
		blacker.style.left = '90px';
		whiter.style.left = '870px';
	}
}


function getGame(){
	$.getJSON("/GetGame/", {'rName': roomName},function(ret){
        if(ret['str'] == 'GameStart'){
			gaming = true;
			newGame();
			clearMap();
			nowGameID = ret['GID'];
			if(mySeat == 0){
				if(ret['GBlack'] == 'false'){
					myColor = false;
					myTurn = true;
				}
				else{
					myColor = true;
					myTurn = false;
				}
			}
			else{
				if(ret['GBlack'] == 'false'){
					myColor = true;
					myTurn = false;
				}
				else{
					myColor = false;
					myTurn = true;
				}
			}
		}
	})
}


Gun.onclick = function(){
	$.getJSON("/Kick/",{'rName': roomName}, function(ret){
		if(ret['str'] == 'Fail!'){
			alert('Something happened');
		}
    })
}


function getRoomName(){     //从URL解析房间名
	var str = window.location.search;
	return str.substring(10, str.length);
}


function getPlayer(){
	$.getJSON("/getPlayer/",{'RName': roomName}, function(ret){
			chat = !ret['Chat'];
            if(ret['str'] == 'Fail!'){
				//alert('Something happened');
			}
			else{
				player1.name = ret['P1'][0];
				player1.ready = ret['P1'][1];
				player1.avatar = ret['P1'][2];
				player1.score = ret['P1'][3];
				player2.name = ret['P2'][0];
				player2.ready = ret['P2'][1];
				player2.avatar = ret['P2'][2];
				player2.score = ret['P2'][3];
				TimerValue = parseInt(ret['Timer']);
				gamer1Name.innerHTML = player1.name;
				gamer2Name.innerHTML = player2.name;
				if(player1.avatar >= 1 && player1.avatar <= 5){
					gamer1Image.src = '/medias/img/avatar/' + player1.avatar.toString() + '.jpg';
				}
				if(player2.avatar >= 1 && player2.avatar <= 5){
					gamer2Image.src = '/medias/img/avatar/' + player2.avatar.toString() + '.jpg';
				}
				gamer1Grade.innerHTML = '积分：' + player1.score.toString();
				if(player2.name != '')
					gamer2Grade.innerHTML = '积分：' + player2.score.toString();
				if(myName == player1.name){
					mySeat = 0;
					Gun.style.display = 'block';
				}
				else if(myName == player2.name){
					mySeat = 1;
					Gun.style.display = 'none';
				}
				else{
					mySeat = -1;
					Gun.style.display = 'none';
				}
			}
          })
}


function setReady(){
	if(player1.ready && player2.ready){
		readyButton2.style.backgroundColor = '#999999';
		readyButton1.style.backgroundColor = '#999999';
		readyButton1.style.cursor = 'default';
	}
	else if(mySeat == 0){
		readyButton2.onclick = function(){return};
		readyButton2.style.cursor = 'default';
		
		if(player2.ready == true && player1.ready == false){
			readyButton2.style.backgroundColor = '#999999';
			readyButton1.style.backgroundColor = '#66ccff';
			readyButton1.style.cursor = 'pointer';
			readyButton1.onclick = ReadyOrStart;
		}
		
		else if(player2.ready == false && player1.ready == false){
			readyButton2.style.backgroundColor = '#66ccff';
			readyButton1.style.backgroundColor = '#999999';
			readyButton1.style.cursor = 'default';
			readyButton1.onclick = function(){return};
		}
	}
	else if(mySeat == 1){
		readyButton1.onclick = function(){return};
		readyButton1.style.cursor = 'default';
		
		if(player2.ready == true && player1.ready == false){
			readyButton2.style.backgroundColor = '#999999';
			readyButton2.style.cursor = 'default';
			readyButton2.onclick = function(){return};;
		}
		
		else if(player2.ready == false && player1.ready == false){
			readyButton2.style.backgroundColor = '#66ccff';
			readyButton2.style.cursor = 'pointer';
			readyButton1.style.backgroundColor = '#66ccff';
			readyButton2.onclick = ReadyOrStart;
		}
	}
}

$('#Quit').click(function(){
	QuitDiv.style.display = 'block';
	cover.style.display = 'block';
})

$('#QuitNo').click(function(){
	QuitDiv.style.display = 'none';
	cover.style.display = 'none';
})

$('#QuitYes').click(function(){
	if(mySeat == -1){
		window.location.href = getBack();
	}
	$.getJSON("/LeaveRoom/",{'CRName': roomName, 'UName': myName}, function(ret){
        if(ret['str'] == '0'){
			window.location.href = getBack();
		}
		else{
			//alert('Something happened');
			window.location.href = getBack();
		}
	})
})

$('#callLose').click(function(){
	$.getJSON("/Lose/",{'rName': roomName, 'Gamer': mySeat + 1}, function(ret){
	})
})


$('#callBack').click(function(){
	$.getJSON("/CanRegret/",{'rName': roomName, 'Gamer': mySeat + 1, 'step': 1 + myTurn}, function(ret){
		if(ret['str'] == 'Cannot regret!'){
			alert('您刚同意了对方的悔棋且没有落子，悔无可悔！');
		}
	})
})

$('#callDraw').click(function(){
	$.getJSON("/CanDraw/",{'rName': roomName, 'Gamer': mySeat + 1}, function(ret){
		
	})
})

function getChat(){
	$.getJSON('/GetMessageList/',{'rName': roomName},function(ret){
		if(ret['List']){
			for(var i = 0; i < ret['List'].length; i++){
				var tmptext = document.createElement('span');
				var tmp = ChatBoard.lastChild;
				if (tmp != null){
					var id = tmp.id;
				}
				tmptext.setAttribute('id', ret['List'][i][0]);
				tmptext.innerHTML = '&nbsp;'+ ret['List'][i][0].toString().substring(11,19) + '&nbsp;&nbsp;&nbsp;<b>' +　ret['List'][i][1] + ':</b><br> ' + ret['List'][i][2] +　'<br>';
				if(ChatBoard.innerHTML == '' || (tmp != null && ret['List'][i][0].toString() > id)){
					ChatBoard.appendChild(tmptext);
					ChatBoard.scrollTop = ChatBoard.scrollHeight;
				}
			}	
		}
    })
}


$('#ChatGo').click(function(){
	if(!chat){
		alert('这里禁聊！');
		return;
	}
	var Chat = document.getElementById('Chat');
	var content = $('#Chat').val();
	$.getJSON('/AddMessage/',{'rName': roomName, 'rUserName':myName, 'rText': content}, function(ret){
		
		Chat.value = '';   
    })
})



function getBack(){
	var str = window.location.href;
	var append = window.location.search;
	return str.substring(0, str.length - append.length - 6);
}

function getMyName(){
	$.getJSON("/getMyName/", function(ret){
        myName = ret['name'];
	})
}


function ReadyOrStart(){
	var blacker = document.getElementById('Blacker');
	var whiter = document.getElementById('Whiter');
	
	$.getJSON("/getReady/", {'rName': roomName, 'rPlayerName': myName}, function(ret){
		if(ret['str'] == 'GameStart'){
			alert('开始游戏！');
			blacker.style.display = 'block';
			whiter.style.display = 'block';
			nowGameID = ret['GID'];
			var blacker = document.getElementById('Blacker');
			var whiter = document.getElementById('Whiter');
			if(mySeat == 0){
				if(ret['GBlack'] == 'false'){
					myColor = false;
				}
				else{
					myColor = true;
				}
			}
			else{
				if(ret['GBlack'] == 'false'){
					myColor = true;
				}
				else{
					myColor = false;
				}
			}
		}
		TimeCount = TimerValue;
	})	
}


