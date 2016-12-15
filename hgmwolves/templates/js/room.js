

var map = new Array;          //记录地图
for (var i = 0; i < 15; i++){
	map[i] = new Array;
	for(var j = 0; j < 15; j++){
		map[i][j] = 0;
	}
}

var mouseX, mouseY;

function mouseMove(ev) { 
	Ev= ev || window.event; 
	var mousePos = mouseCoords(Ev); 
	mouseX = mousePos.x - 223 - 57;
	mouseY = mousePos.y - 70 - 68;
} 



gameboard.style.left = (window.innerWidth /2 - 500).toString() + 'px';
gameboard.style.top = (window.innerHeight /2 - 350).toString() + 'px';




window.onresize = function(){
	gameboard.style.left = (window.innerWidth /2 - 500).toString() + 'px';
	gameboard.style.top = (window.innerHeight /2 - 350).toString() + 'px';
}

roomName = getRoomName();
window.setInterval(MainLoop, timeSet);      //轮询


function MainLoop(){
	//insert 
	setTimer();
}


function getRoomName(){     //从URL解析房间名
	var str = window.location.search;
	return str.substring(10, str.length);
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






