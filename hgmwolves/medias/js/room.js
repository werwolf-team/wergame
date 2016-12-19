var timeSet = 1000;
var gaming = 0;
var roomName;
var nowType = 0;
var myIdentity;
var deadList = new Array();
var newdead = -1;
var now = 0;
var myId = -1;
var impolice = 0;
var myName = ""; 
var deadflag = true;
var lr = document.getElementById("left_right");
var cover = document.getElementById("cover");
gameboard.style.left = (window.innerWidth /2 - 500).toString() + 'px';
gameboard.style.top = (window.innerHeight /2 - 350).toString() + 'px';


window.onresize = function(){
	gameboard.style.left = (window.innerWidth /2 - 500).toString() + 'px';
	gameboard.style.top = (window.innerHeight /2 - 350).toString() + 'px';
}


getRoomName();
getmyName();
window.setInterval(MainLoop, timeSet);      //轮询


function MainLoop(){
	if(gaming != 1){
		getReadyStatus();
	}
	else{
		if(now == 1){
			getMyIden();
		}
		getGameStatus();
		getMessage();
		now++;
	}
}

function getGameStatus(){
	$.getJSON("/getGameStatus/",{'myName': myName}, function(ret){
		if(ret['nowStatus'] != nowType){
			setState(ret['nowStatus']);
			nowType = ret['nowStatus'];
		}
		else{
			
		}
		setTimer(ret['nowTime']);
		for(var i = 1; i <= 12; i++){
			if(ret['res'][i - 1]['livestatus'] != 1)
			{
				die(i);
				if(myId == i && deadflag == true)
				{
					sendLastWord();
					deadflag = false;
				}
				if ($.inArray(i, deadlist) == -1)
				{
					nowdead = i;
					deadList.push(i);
				}
			}
			else
				redie(i);
			if(ret['res'][i - 1]['policestatus'] == 1)
				police(i);
			else
				repolice(i);
		}
	})
}


function sendLastWord(){
	$.getJSON("/sendLastWord/",{'myName': myName, 'content': $("#lastword").val()}, function(ret){
        if(ret['str']){
			
		}
	})
}

function getMyIden(){
	$.getJSON("/getRole/",{'myName': myName}, function(ret){
		var temp;
        if(ret['str']){
			myIdentity = ret['str'];
		}
		if(myIdentity == 1)
			temp = "预言家";
		else if(myIdentity == 2)
			temp = "女巫";
		else if(myIdentity == 3)
			temp = "丘比特";
		else if(myIdentity == 4)
			temp = "猎人";
		else if(myIdentity == 5)
			temp = "狼人";
		else if(myIdentity == 6)
			temp = "普通村民";
		var myDate = new Date();
		var mytime=myDate.toLocaleTimeString().substring(2);
		addMsg('系统提醒',mytime, "你的身份是" + temp);
	})
}


function getmyName(){
	$.getJSON("/getMyName/",{}, function(ret){
        if(ret['str']){
			myName = ret['name'];
		}
	})
}


function setTimer(time){
	var timerDiv = document.getElementById("Timer");
	timerDiv.innerHTML = (Math.floor(time / 60))+ ":" + time % 60;
}


function getReadyStatus(){
	var count = 0;
	$.getJSON("/getReadyStatus/",{'rName': roomName}, function(ret){
        if(ret['str']){
			for(var i = 1; i <= 12; i++){
				if(ret['str'][i-1] && ret['str'][i-1]["status"] == 1)
				{
					ready(i);
					count++;
				}
				var tempdiv = document.getElementById("gamer" + i + "Name");
                if(ret['str'][i-1]) {
                    tempdiv.innerHTML = ret['str'][i - 1]['name'];
                    tempdiv = document.getElementById("gamer" + i + "Image");
                    tempdiv.src = '/medias/img/avatar/' +  ret['str'][i - 1]['avatar'] + '.jpg';
                }
			}
			if(count == 12)
			{
				gaming = 1;
			}
		}
	})
}


function getRoomName(){     //从URL解析房间名
	var str = window.location.search;
	var arr = str.split('=');
	roomName= arr[1];
}


function getMessage(){
	$.getJSON("/getMessage/",{'myName': myName}, function(ret){
		if(ret['Messages']){
			for(var i = 0; i < ret['Messages'].length; i++){
				var tmptext = document.createElement('span');
				var tmp = ChatBoard.lastChild;
				if (tmp != null){
					var id = tmp.id;
				}
				tmptext.setAttribute('id', ret['Messages'][i]['time']);
				tmptext.innerHTML = '&nbsp;'+ ret['Messages'][i]['time'].toString().substring(11,19) + '&nbsp;&nbsp;&nbsp;<b>' + ret['Messages'][i]['user'] + ':</b><br> ' + ret['Messages'][i]['content'] +'<br>';
				if(ChatBoard.innerHTML == '' || (tmp != null && ret['Messages'][i]['time'].toString() > id)){
					ChatBoard.appendChild(tmptext);
					ChatBoard.scrollTop = ChatBoard.scrollHeight;
				}
			}	
		}
	})
}


function addMsg(name, time, content){
	var ChatBoard = document.getElementById("ChatBoard");
	var tmptext = document.createElement('span');
	var tmp = ChatBoard.lastChild;
	if (tmp != null){
		var id = tmp.id;
	}
	tmptext.setAttribute('id', time);
	tmptext.innerHTML = '&nbsp;'+ time + '&nbsp;&nbsp;&nbsp;<b>' +name + ':</b><br> ' + content +'<br>';
	ChatBoard.appendChild(tmptext);
	ChatBoard.scrollTop = ChatBoard.scrollHeight;
}

function setState(n){
	if(n == 1){
		turnOff();
		$("#Now").html("请丘比特选择情侣中的第1位");
	}
	else if(n == 2){
		$("#Now").html("请丘比特选择情侣中的第2位");
	}
	else if(n == 3){
		turnOff();
		$("#Now").html("请狼人选择要杀的玩家");
	}
	else if(n == 4)
	{
		$("Now").html("请预言家选择要验的人");
	}
	else if(n == 5){
		var myDate = new Date();
		var mytime=myDate.toLocaleTimeString().substring(2);
		if (myIdentity == 2)
			addMsg('系统提醒',mytime, newdead + "号玩家死了");
		$("#Now").html("请女巫选择要救的玩家");
	}
	else if(n == 6){
		$("#Now").html("请女巫选择要杀的玩家");
	}
	else if(n == 7){
		turnOn();
		$("#Now").html("想竞选警长的玩家点击自己的头像");
	}
	else if(n == 8){
		$("#Now").html("请警长候选人轮流发言");
	}
	else if(n == 9){
		$("#Now").html("请未参加竞选的玩家选择投票对象，也可不选");
	}
	else if(n == 10){
		turnOn();
		$("#Now").html("请警长选择左右发言");
		if(impolice){
			lr.style.display = "block";
			cover.style.display = "block";
		}
	}
	else if(n == 11){
		$("#Now").html("请玩家依次发言");
	}
	else if(n == 12){
		$("#Now").html("请选择你要投死的人");
	}
}

function turnOff(){
	gameboard.style.backgroundImage="url(img/backgroundnight.jpg)";
}

function turnOn(){
	gameboard.style.backgroundImage="url(img/background.jpg)";
}

function ready(n){
	var diediv = document.getElementById("gamer" + n + "Grade");
	diediv.innerHTML = "已准备";
	
}

function unready(n){
	var diediv = document.getElementById("gamer" + n + "Grade");
	diediv.innerHTML = "已准备";
	
}

function die(n){
	var diediv = document.getElementById("gamer" + n + "die");
	if(diediv.style.display != "block")
		diediv.style.display = "block";
	
}

function redie(n){
	var diediv = document.getElementById("gamer" + n + "die");
	if(diediv.style.display != "none")
		diediv.style.display = "none";
	
}

function police(n){
	var diediv = document.getElementById("gamer" + n + "police");
	if(diediv.style.display != "block")
			diediv.style.display = "block";
	
}

function repolice(n){
	var diediv = document.getElementById("gamer" + n + "police");
	if(diediv.style.display != "none")
		diediv.style.display = "none";
	
}


function clear(){
	
}

function choose(n){
	if(nowType == 1){
		$.getJSON("/setvote/",{'myName': myName, 'id': n, 'myRoom': roomName}, function(ret){
	        if(ret['str'] == '1'){
				alert('选人成功');
			}
			else{
				alert('选人失败');
			}
		})
	}
	else if(nowType == 2){
		$.getJSON("/setvote/",{'myName': myName, 'id': n, 'myRoom': roomName}, function(ret){
	        if(ret['str'] == '1'){
				alert('选人成功');
			}
			else{
				alert('选人失败');
			}
		})
	}
	else if(nowType == 3){
		$.getJSON("/setvote/",{'myName': myName, 'id': n, 'myRoom': roomName}, function(ret){
	        if(ret['str'] == '1'){
				alert('选人成功');
			}
			else{
				alert('选人失败');
			}
		})
	}
	else if(nowType == 4){
		$.getJSON("/setvote/",{'myName': myName, 'id': n, 'myRoom': roomName}, function(ret){
	        if(ret['str'] == '1'){
				
				/*if(ret['res'] == '1'){
					addMsg('系统提醒',mytime, '你验证的' + n + "号玩家是好人");
				}
				else{
					addMsg('系统提醒',mytime, '你验证的' + n + "号玩家是坏人");
				}*/
			}
			else{
				alert('选人失败');
			}
		})
	}
	else if(nowType == 5 && n == nowdead){
		$.getJSON("/setvote/",{'myName': myName, 'id': 1, 'myRoom': roomName}, function(ret){
	        if(ret['str'] == '1'){
					var myDate = new Date();
					var mytime=myDate.toLocaleTimeString().substring(2);
					addMsg('系统提醒',mytime, '你对死者使用了解药');
				}
			else{
				alert('操作失败');
			}
		})
	}
	else if(nowType == 6){
		$.getJSON("/setvote/",{'myName': myName, 'id': n, 'myRoom': roomName}, function(ret){
	        if(ret['str'] == '1'){
					var myDate = new Date();
					var mytime=myDate.toLocaleTimeString().substring(2);
					addMsg('系统提醒',mytime, '你对' + n + "号玩家使用了毒药");
				}
			else{
				alert('操作失败');
			}
		})
	}
	else if(nowType == 7){
		$.getJSON("/setvote/",{'myName': myName, 'id': n, 'myRoom': roomName}, function(ret){
	        if(ret['str'] == '1'){
					alert('参选成功');
				}
			else{
				alert('参选失败');
			}
		})
	}
	else if(nowType == 8){
		alert("现在请不要乱点");			
				
	}
	else if(nowType == 9){
		$.getJSON("/setvote/",{'myName': myName, 'id': n, 'myRoom': roomName}, function(ret){
	        if(ret['str'] == '1'){
					
				}
			else{
				alert('操作失败');
			}
		})
	}
	else if(nowType == 10 || nowType == 11){
		alert("现在请不要乱点");			
				
	}
	else if(nowType == 12){
		$.getJSON("/setvote/",{'myName': myName, 'id': n, 'myRoom': roomName}, function(ret){
	        if(ret['str'] == '1'){
					alert('投票成功')
				}
			else{
				alert('投票失败');
			}
		})
	}
	
}



$('.gamingBoard').click(function(){
	if(true)
	{
		var n = this.getAttribute("id").substring(5);
		if (window.confirm("你确认选择"+ n + "号玩家么？")) {
			choose(n);
		} else {
			
		}
	}	
})



$('#Quit').click(function(){
	QuitDiv.style.display = 'block';
	cover.style.display = 'block';
})



$("#Ready").click(function(){
	$.getJSON("/ready/",{'rName': roomName}, function(ret){
        if(ret['str'] == '1'){
			$("#Ready").css("background-color","#555555");
		}
		else{
			alert('准备失败');
		}
	})
})

$("#ChatGo").click(function(){
	$.getJSON("/receiveMessage/",{'content': $("#Chat").val(), 'myName': myName}, function(ret){
        if(ret['result'] == '1'){
			getMessage();
		}
		else{
			alert('此时您不能说话！');
		}
	})
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

$('#left').click(function(){
	$.getJSON("/setvote/",{'myName': myName, 'id': n, 'myRoom': roomName}, function(ret){
        if(ret['str'] == '0'){
			window.location.href = getBack();
		}
		else{
			//alert('Something happened');
			window.location.href = getBack();
		}
	})
})


$('#lastword').click(function(){
	this.innerHTML = "";
})


$("#lastword").blur(function(){
	if(this.innerHTML == "")
	{
		this.innerHTML = "请在这里写下你的遗言，当你死时会被大家看到";
	}
});


