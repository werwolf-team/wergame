var quickstart = document.getElementById('quickstart');
var gameboard = document.getElementById('gameboard');
var regBoard = document.getElementById('regBoard');
var logButton = document.getElementById('logButton');
var regButton = document.getElementById('regButton');
var login = document.getElementById('login');
var register = document.getElementById('register');
var loginGo = document.getElementById('loginGo');
var registerGo = document.getElementById('registerGo');
var rImage = document.getElementById('rImage');
var userlistDiv = document.getElementById('userlist');
var ChatBoard = document.getElementById('ChatBoard');
var showChangePassword = document.getElementById('showChangePassword');
var showChangeInformation = document.getElementById('showChangeInformation');
var changePassword = document.getElementById('changePassword');
var changeInformation = document.getElementById('changeInformation');
var CPNewpasswordAgain = document.getElementById('CPNewPasswordAgain');
var CPNewpassword = document.getElementById('CPNewPassword');
var ValidchangedPassword = document.getElementById('ValidchangedPassword');
var RpasswordAgain = document.getElementById('rPasswordAgain');
var Rpassword = document.getElementById('rPassword');
var CRPasswordAgain = document.getElementById('CRPasswordAgain');
var CRPassword = document.getElementById('CRPassword');
var ValidPassword = document.getElementById('ValidPassword');
var ValidRoomPassword = document.getElementById('ValidRoomPassword');
var registerGo = document.getElementById('registerGo');
var createRoom = document.getElementById('createRoom');
var createRoomDiv = document.getElementById('createRoomDiv');
var roomBoard = document.getElementById('roomboard');
var avatarDiv = document.getElementById('AvatarDiv');
var roomType = 1;

var timeSet = 800;   //轮询时间间隔
var loginState = false;    //记录是否登录
var myName;     //本用户名
var myScore;    //本成绩
var roomList = new Array;
var myAvatar = 0;
var gameboard_height = 700;
var gameboard_width = 1000;


gameboard.style.left = (window.innerWidth /2 - 500).toString() + 'px';
gameboard.style.top = (window.innerHeight /2 - 350).toString() + 'px';
login.style.left = (gameboard_width /2 - 150 + (window.innerWidth /2 - 500)).toString() + 'px';
login.style.top = (gameboard_height /2 - 140 + (window.innerHeight /2 - 350)).toString() + 'px';
register.style.left = (gameboard_width /2 - 140 + (window.innerWidth /2 - 500)).toString() + 'px';
register.style.top = (gameboard_height /2 - 140 + (window.innerHeight /2 - 350)).toString() + 'px';
avatarDiv.style.left = (gameboard_width /2 - 155 + (window.innerWidth /2 - 500)).toString() + 'px';
avatarDiv.style.top = (gameboard_height /2 - 145 + (window.innerHeight /2 - 350)).toString() + 'px';
changePassword.style.left = (gameboard_width /2 - 140 + (window.innerWidth /2 - 500)).toString() + 'px';
changePassword.style.top = (gameboard_height /2 - 95 + (window.innerHeight /2 - 350)).toString() + 'px';
changeInformation.style.left = (gameboard_width /2 - 140 + (window.innerWidth /2 - 500)).toString() + 'px';
changeInformation.style.top = (gameboard_height /2 - 90 + (window.innerHeight /2 - 350)).toString() + 'px';
createRoomDiv.style.left = (gameboard_width /2 - 160 + (window.innerWidth /2 - 500)).toString() + 'px';
createRoomDiv.style.top = (gameboard_height /2 - 125 + (window.innerHeight /2 - 350)).toString() + 'px';
setLogin();

function getLogin(){
	$.getJSON("/getMyName/", function(ret){
		if(ret['str'] == '0' || ret['name'] == ''){
			loginState = false;
		}
		else if(ret['str'] == '1'){
			loginState = true;
			myName = ret['name'];
			myScore = ret['score'];
			myAvatar = ret['avatar'];
			var userimage = document.getElementById('userimage');
			if(myAvatar != 0) {
                userimage.src = '/medias/img/avatar/' + myAvatar.toString() + '.jpg';
            }
		}
	})
}

function setLogin(){
	var userinfo = document.getElementById('userinfo');
    var username = document.getElementById('username');

	if(loginState == false){
		userinfo.style.display = 'none';
		regBoard.style.display = 'block';
	}
	else{
		username.innerHTML = myName;
		userinfo.style.display = 'block';
		regBoard.style.display = 'none';
	}
}

if(logButton != null){
	logButton.onclick = function(){
		var cover = document.getElementById('cover');
		cover.style.display = 'block';
		login.style.display = 'block';	
	}
}

if(regButton != null){
	regButton.onclick = function(){
		var cover = document.getElementById('cover');
		cover.style.display = 'block';
		register.style.display = 'block';
	}
}

if(loginGo != null){
	loginGo.onclick = function(){
		login.style.display = 'none';
		cover.style.display = 'none';
	}
}

if(registerGo != null){
	registerGo.onclick = function(){
		register.style.display = 'none';
		cover.style.display = 'none';
		$.getJSON('/register/',{'rName': $('#rName').val(), 'rPassword': $('#rPassword').val(), 'rSex': $('#rSex').val(), 'rMail': $('#rMail').val(), 'rDate': $('#rDate').val()}, function(ret){
			if(ret['str'] == 'Success!'){
				alert('注册成功！');
			}
		})
	}
}

if(showChangePassword != null){
	showChangePassword.onclick = function(){
		var cover = document.getElementById('cover');
		cover.style.display = 'block';
		changePassword.style.display = 'block';
	}
}

if(showChangeInformation != null){
	showChangeInformation.onclick = function(){
		var cover = document.getElementById('cover');
		cover.style.display = 'block';
		changeInformation.style.display = 'block';
	}
}

if(CPNewpasswordAgain != null){
	CPNewpasswordAgain.onchange = function(){
		if(CPNewpasswordAgain.value == CPNewpassword.value){
			ValidchangedPassword.src = 'medias/img/right.png';
		}
		else{
			ValidchangedPassword.src = 'medias/img/wrong.png';
		}
	}
}

if(RpasswordAgain != null){
	RpasswordAgain.onchange = function(){
		if(RpasswordAgain.value == Rpassword.value){
			ValidPassword.src = 'medias/img/right.png';
		}
		else{
			ValidPassword.src = 'medias/img/wrong.png';
		}
	}
}

if(CRPasswordAgain != null){
	CRPasswordAgain.onchange = function(){
		if(CRPasswordAgain.value == CRPassword.value){
			ValidRoomPassword.src = 'medias/img/right.png';
		}
		else{
			ValidRoomPassword.src = 'medias/img/wrong.png';
		}
	}
}

$('#CRName').change(function(){
	var content = this.value;
	var ValidRoomName = document.getElementById('ValidRoomName');
	$.getJSON("/RoomCheck/",{'CRName': content}, function(ret){
            if(ret['create'] == '0'){
				ValidRoomName.src = 'medias/img/wrong.png';
			}
			else{
				ValidRoomName.src = 'medias/img/right.png';
			}
    })
})

$('#createRoomGo').click(function(){
	if(loginState == false){
		alert('请先登录！');
		return;
	}
	var Rname = $("#CRName").val();
	$.getJSON("/createRoom/",{'CRName': $("#CRName").val(),
							  'CRPassword': $("#CRPassword").val(),
							  'CRHand': 0,
							  'CRKill': $("#CRKill").val()
							  }, function(ret){
            if(ret['str'] == 'Success!'){
				$.getJSON("/EnterRoom/",{'rName': Rname}, function(ret){
						if(ret['str'] == '0'){
							alert('根本没有这样的房间。是假的，是特技。');
						}
						else if(ret['str'] == '1'){
							alert('您将进入房间' + name + '~');
							location.href = 'Room/?RoomName=' + Rname;
						}
						else if(ret['str'] == '-1'){
							alert('房间已有玩家。您将以旁观身份进入。');
							location.href = 'Room/?RoomName=' + Rname;
						}
						else if(ret['str'] == '2'){
							alert('您将回到房间' + name + '~');
							location.href = 'Room/?RoomName=' + Rname;
						}
					})
				location.href = 'Room/?RoomName=' + Rname;
			}
			else{
				alert('房间创建失败！');
			}
          })
	cover.style.display = 'none';
	createRoomDiv.style.display = 'none';
})

if(Rpassword != null){
	Rpassword.onchange = RpasswordAgain.onchange;
}

if(CRPassword != null){
	CRPassword.onchange = CRPasswordAgain.onchange;
}

if(CPNewpassword != null){
	CPNewpassword.onchange = CPNewpasswordAgain.onchange;
}

$('#rName').change(function(){
	var ValidName = document.getElementById('ValidName');
	var content = this.value;
	$.getJSON("/UserCheck/",{'rName': content}, function(ret){
            if(ret['str'] == '1'){
				ValidName.src = '/medias/img/wrong.png';
			}
			else{
				ValidName.src = '/medias/img/right.png';
			}
    })
})


createRoom.onclick = function(){
	if(loginState == false){
		alert('请先登录！');
		return;
	}
	cover.style.display = 'block';
	createRoomDiv.style.display = 'block';
}


$(document).ready(function() {
    $("#loginGo").click(function () {
        $.getJSON('/login/', {'lName': $("#lName").val(), 'logInPassword': $("#lPassWord").val()}, function(ret){
			if(ret['str'] == '1'){
				var username = document.getElementById('username');
				var usergrade = document.getElementById('usergrade');
				var userscore = document.getElementById('userscore');
				alert('登录成功！');
				loginState = true;
				myName = ret['name'];
				myScore = ret['score'];
				setLogin();
			}
			else if(ret['str'] == '0'){
				alert('用户名不存在！');
			}
			else if(ret['str'] == '-1'){
				alert('密码错误！');
			}
            
        })
    });
});


$('#changeInformationGo').click(function(){
	$.getJSON('/rewrite/', {'CIDate':$('#CIDate').val(), 'CIEMail':$('#CImail').val(), 'CISex':$('#CISex').val()}, function(ret){
			if(ret['str'] == 'Yes'){
				alert('修改成功！');
				changeInformation.style.display = 'none';
				cover.style.display = 'none';
			}
			else{
				alert('Something happened');
				changeInformation.style.display = 'none';
				cover.style.display = 'none';
			}        
    })
})


$('#changePasswordGo').click(function(){
	$.getJSON('/rewritePassword/', {'CPOldPassword':$('#CPOldPassword').val(), 'CPNewPassword':$('#CPNewPassword').val()}, function(ret){
			if(ret['str'] == '0'){
				alert('修改成功！');
				changePassword.style.display = 'none';
				cover.style.display = 'none';
			}
			else if (ret['str'] == '-1'){
				alert('原密码输入错误！');
				changePassword.style.display = 'none';
				cover.style.display = 'none';
			}
			else {
				alert('Something happened');
				changePassword.style.display = 'none';
				cover.style.display = 'none';
			}
    })
})

$('#closeAvatar').click(function(){
	avatarDiv.style.display = "none";
    cover.style.display = "none";
})

$("#LogoutGo").click(function(){
	$.getJSON('/LogOut/', function(ret){
			if(ret['str'] == '0'){
				alert('退出登录成功！');
				loginState = false;
				myName = '';
				myScore = 0;
				myAvatar = 0;
				setLogin();
			}
	
			else if(ret['str'] == '-1'){
				alert('Something happened');
			}        
        })
});


window.onresize = function(){
	gameboard.style.left = (window.innerWidth /2 - 500).toString() + 'px';
	gameboard.style.top = (window.innerHeight /2 - 350).toString() + 'px';
    login.style.left = (gameboard_width /2 - 150 + (window.innerWidth /2 - 500)).toString() + 'px';
    login.style.top = (gameboard_height /2 - 140 + (window.innerHeight /2 - 350)).toString() + 'px';
    register.style.left = (gameboard_width /2 - 140 + (window.innerWidth /2 - 500)).toString() + 'px';
    register.style.top = (gameboard_height /2 - 140 + (window.innerHeight /2 - 350)).toString() + 'px';
    avatarDiv.style.left = (gameboard_width /2 - 155 + (window.innerWidth /2 - 500)).toString() + 'px';
    avatarDiv.style.top = (gameboard_height /2 - 145 + (window.innerHeight /2 - 350)).toString() + 'px';
    changePassword.style.left = (gameboard_width /2 - 140 + (window.innerWidth /2 - 500)).toString() + 'px';
    changePassword.style.top = (gameboard_height /2 - 95 + (window.innerHeight /2 - 350)).toString() + 'px';
    changeInformation.style.left = (gameboard_width /2 - 140 + (window.innerWidth /2 - 500)).toString() + 'px';
    changeInformation.style.top = (gameboard_height /2 - 90 + (window.innerHeight /2 - 350)).toString() + 'px';
}

getLogin();
getRoomList();

window.setInterval(MainLoop, timeSet);      //轮询

function MainLoop(){
	//getChat();
	getLogin();
	setLogin();
	getRoomList();
}

function getChat(){
	$.getJSON('/GetMessageList/',{'rName': 0},function(ret){
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
    })
}


$('#ChatGo').click(function(){
	if(loginState == false){
		alert('请先登录！');
		return;
	}
	var Chat = document.getElementById('Chat');
	var content = $('#Chat').val();
	$.getJSON('/AddMessage/',{'rName': 0, 'rUserName':myName, 'rText': content}, function(ret){
		
		Chat.value = '';   
    })
})


$('#closeRegister').click(function(){
	register.style.display = 'none';
	cover.style.display = 'none';
})


$('#closeLogin').click(function(){
	login.style.display = 'none';
	cover.style.display = 'none';
})


$('#closeCreateRoom').click(function(){
	createRoomDiv.style.display = 'none';
	cover.style.display = 'none';
})


$('#closeChangePassword').click(function(){
	changePassword.style.display = 'none';
	cover.style.display = 'none';
})


$('#closeChangeInf').click(function(){
	changeInformation.style.display = 'none';
	cover.style.display = 'none';
})


$('#normalRooms').click(function(){
	roomType = 1;
})



$('#FRoomGo').click(function(){
	if(loginState == false){
		alert('请先登录！');
		return;
	}
	var FRoom = document.getElementById('FRoom');
	$.getJSON('/SearchRoom/', {'rName': FRoom.value},function(ret){
		if(ret['str'] == 'No!'){
			alert('根本没有这样的房间，是假的，是特技。');
		}
		else{
			$('#' + FRoom.value).trigger("click");
		}
    })
})


$('#userimage').click(function(){
	var cover = document.getElementById('cover');
	var AvatarDiv = document.getElementById('AvatarDiv');
	AvatarDiv.style.display = 'block';
	cover.style.display = 'block';
})


$('#quickstart').click(function(){
	if(loginState == false){
		alert('请先登录！');
		return;
	}
	$.getJSON('/GetRoom/', function(ret){
		if(ret['str'] == 'No!'){
			alert('没有空房间了！');
		}
		else{
			$('#' + ret['room']).trigger("click");
		}
    })
})


$('#1').click(function(){
		$.getJSON('/SetAvatar/', {'id': 1},function(ret){
			if(ret['str'] == 'Success!'){
				alert('设置成功！');
				myAvatar = 1;
				var AvatarDiv = document.getElementById('AvatarDiv');
				AvatarDiv.style.display = 'none';
				cover.style.display = 'none';
			}
		})
})


$('#2').click(function(){
		$.getJSON('/SetAvatar/', {'id': 2},function(ret){
			if(ret['str'] == 'Success!'){
				alert('设置成功！');
				myAvatar = 2;
				var AvatarDiv = document.getElementById('AvatarDiv');
				AvatarDiv.style.display = 'none';
				cover.style.display = 'none';
			}
		})
})


$('#3').click(function(){
		$.getJSON('/SetAvatar/', {'id': 3},function(ret){
			if(ret['str'] == 'Success!'){
				alert('设置成功！');
				myAvatar = 3;
				var AvatarDiv = document.getElementById('AvatarDiv');
				AvatarDiv.style.display = 'none';
				cover.style.display = 'none';
			}
		})
})


$('#4').click(function(){
		$.getJSON('/SetAvatar/', {'id': 4},function(ret){
			if(ret['str'] == 'Success!'){
				alert('设置成功！');
				myAvatar = 4;
				var AvatarDiv = document.getElementById('AvatarDiv');
				AvatarDiv.style.display = 'none';
				cover.style.display = 'none';
			}
		})
})


$('#5').click(function(){
		$.getJSON('/SetAvatar/', {'id': 5},function(ret){
			if(ret['str'] == 'Success!'){
				alert('设置成功！');
				myAvatar = 5;
				var AvatarDiv = document.getElementById('AvatarDiv');
				AvatarDiv.style.display = 'none';
				cover.style.display = 'none';
			}
		})
})


function getRoomList(){
	$.getJSON('/RoomList/',function(ret){
			roomList = ret['Room']; 
         });
		roomBoard.innerHTML = '';
	for(var i = 0; i < roomList.length; i++){
		var Rooms = document.createElement('div');
		var RoomName = document.createElement('div');
        var RoomType = document.createElement('div');
		var RoomImage = document.createElement('img');
		RoomImage.src = '/medias/img/wolves.png';
		Rooms.setAttribute('class', 'roomDiv');
		RoomName.innerHTML = "房间名：" + roomList[i][0];
        if(roomList[i][1] == 0)
            RoomType.innerHTML = "类型：屠城";
        else
            RoomType.innerHTML = "类型：屠边";
		RoomImage.style.left = '10px';
        RoomImage.style.top = '5px';
        RoomImage.style.width = '80px';
		RoomType.style.top = "30px";
        RoomType.style.left = "95px";
        RoomName.style.top = "5px";
        RoomName.style.left = "95px";
        RoomName.style.position = 'absolute'
        RoomType.style.position = 'absolute';
		RoomImage.style.position = 'absolute';
		Rooms.appendChild(RoomImage);
		Rooms.appendChild(RoomName);
        Rooms.appendChild(RoomType);
		Rooms.setAttribute('id', roomList[i][0]);
		Rooms.password = roomList[i][2];
		Rooms.style.left = ((i % 4) * 220 + 5).toString() + 'px';
		Rooms.style.top = (Math.floor((i / 4)) * 98 + 5).toString() + 'px';

		Rooms.onclick = function(){
			if(loginState == false){
				alert('请先登录！');
				return;
			}
			var name = this.getAttribute('id');
			if(this.password != ''){
				var inputpassword = window.prompt('请输入房间密码！');
				if (inputpassword != this.password){
					alert('密码错误!');
				}
				else{
					$.getJSON("/EnterRoom/",{'rName': name}, function(ret){
						if(ret['str'] == '0'){
							alert('根本没有这样的房间。是假的，是特技。');
						}
						else if(ret['str'] == '1'){
							location.href = 'Room/?RoomName=' + name;
						}
						else if(ret['str'] == '-1'){
							alert('房间已有玩家。您将以旁观身份进入。');
							location.href = 'Room/?RoomName=' + name;
						}
						else if(ret['str'] == '2'){
							alert('您将回到房间' + name + '~');
							location.href = 'Room/?RoomName=' + name;
						}
					})
				}
			}
			else{
				$.getJSON("/EnterRoom/",{'rName': name}, function(ret){
						if(ret['str'] == '0'){
							alert('根本没有这样的房间。是假的，是特技。');
						}
						else if(ret['str'] == '1'){
							location.href = 'Room/?RoomName=' + name;
						}
						else if(ret['str'] == '-1'){
							alert('房间已有玩家。您将以旁观身份进入。');
							location.href = 'Room/?RoomName=' + name;
						}
						else if(ret['str'] == '2'){
							alert('您将回到房间' + name + '~');
							location.href = 'Room/?RoomName=' + name;
						}
					})
			}
		}
		
		roomBoard.appendChild(Rooms);
	}
}
