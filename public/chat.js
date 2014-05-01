var message, inp, clientId = null;
$(document).ready(function() {
    message = $("#messageInput");
    $("#bodyHead").css({overflow: 'auto'});
    hideError();
    showModal();
    $('#pseudoSubmit').click(function() {
        setConnect();
    });
    checkInput();
    $("#talk").slimScroll({
        height: '450px'
    });
    addRoom();

});

function hideError() {
    $("#alertError").hide();
    $("#errorRoom").hide();
}

var socket = io.connect();
socket.on('connect', function() {

    
    console.log('connected');
    
});


socket.on('roomslist', function(data) {
    for(var i = 0, len = data.rooms.length; i < len; i++){
        if(data.rooms[i] != ''){
			//    addRoom(data.rooms[i], false);
            console.log("add room list");
		} else {
            console.log("hic");
        }
    }
});


socket.on('greeting', function(data) {
    //alert(data);
});

socket.on('nUsers', function(u) {
    $("#numUser").html(u.nb + " ket noi");
});


socket.on('message', function(data) {
    addMess(data['message'], data['name'], new Date().toISOString(), false);
});


socket.on('new-room', function(data) {
    $("#roomName").append( data +"<br/>");
});


socket.on('remove-user', function(data) {
    var t = '.user-' + data;
    $('#talk').append('<div class="row ser"><span class="noti">Server said: </span>User ' + data + ' has disconnected.</div>');
    $(t).remove();
});

function addRoom () {
    $("#plus").on('click', function() {
        $("#modalAddRoom").modal('toggle');
        $("#roomInput").val("");
        $("#roomInput").focus();
    });
    
    var check_room = document.getElementById('check-private');
    if (check_room.checked) {
        alert("hehe");
    }

    $("#enterRoom").on('click', function() {
        // Check room if exist
        $("#roomName").append("<div class='fa fa-users'>" + " " + $("#roomInput").val()+"</div><br/>");
        socket.emit('create-room', $('#roomInput').val());
        $("#modalAddRoom").modal('toggle');
    });

}

function setConnect() {
    inp = $('#pseudoInput').val();
    //if ($('#pseudoInput').val() != "") {
    if ($.trim(inp) != "") {
        socket.emit('setNickName', $('#pseudoInput').val());
        socket.on('status', function(data) {
            if (data == "ok") {
                $("#alertError").hide();
                $("#modalPseudo").modal('hide');
                $("#messageInput").focus();

                

                
                $('#luser').append("<li class='list user-" + inp +  "' style='color: green; font-weight: bold;'>" + "<span class='icon-act'></span>" + " " +inp + "</li>");
                
                socket.on('new-user', function(data) {
                    $('#talk').append("<div class='row ser'><span class='noti'>Server said: </span>User " + data + " has joined!!</div>");
                    $('#luser').append("<li class='list user-" + data +  "'>" + "<span class='icon'></span>" + " " + data + "</li>");
                });
                
                socket.on('luser', function(data) {
                    for (var prop in data) {
                        //$("#luser").append("<div class='fa fa-user user-" + prop + "'>" + " " + prop +  "</div>");
                        $("#luser").append("<li class='list user-" + prop + "'>" + " <span class='icon'></span> " + " " + prop +  "</li>");
                    }
                });
            } else {
                $("#alertError").html("The user " + inp + " realy taken!!");
                $("#alertError").slideDown();
            }
        });
        //$('#modalPseudo').modal('hide');
    } else {
        bootbox.dialog({
            message: "Bạn phải nhập nickname để bắt đầu chat",
            title: "Cảnh báo!!!",
            className: "test1",
            buttons: {
                success: {
                    label: "Go back!",
                    className: "btn-primary",
                    callback: function() {
                        // Function execute when click Go-back button
                    }
                }
            }
        });
    }
}

function checkInput() {
    $("#messageInput").keyup(function(e) {
        var value = $( this ).val();
        if(e.keyCode == 13 && !e.shiftKey) {
            if ($.trim(value) == "") {
                bootbox.dialog({
                    message: "Ban phai nhap vao tin nhan de chat",
                    title: "Canh bao",
                    className: "bb-checkmess",
                    buttons: {
                        success: {
                            label: "Go back",
                            className: "btn-primary",
                            callback: function(){
                                $("#messageInput").focus();
                            }
                        }
                    }
                });
            } else {
                sendMess();
            }
        }
    });
}


function sendMess() {
    if (message != "") {
        if ($.trim(inp) == "") {
            showBootbox();
        } else {
            socket.emit("sendMess", message.val());
            addMess(message.val(), "Me", new Date().toISOString(), true);
            message.val('');
            //alert(inp);
        }
    } else {
        alert("failed");
    }
}

function showBootbox() {
    bootbox.dialog({
        message: "Bạn phải nhập nickname để bắt đầu chat",
        title: "Cảnh báo!!!",
        className: "test1",
        buttons: {
            success: {
                label: "Go back!",
                className: "btn-primary",
                callback: function() {
                    showModal();
                }
            }
        }
    });
}

function showModal() {
    $('#modalPseudo').modal('toggle');
    $('#pseudoInput').focus();
}

function addUser(nickname, self) {
    var userDiv;
    if (self) {
        userDiv = "row nickname self";
    } else {
        userDiv = "row nickname";
    }
    
    
}


function addMess(msg, nickname, date, self) {
    if (self) {
        var classDiv = "row message self";
    } else {
        var classDiv = "row message";
    }
    //$("#talk").append('div class="' + classDiv + '"><p class="infos"><span class="userNick">' + nickname + '</span>, <time class="date" title="'+date+'">' + date +'</time><p>' + msg + '</p></p>');
    
    $('#talk').append('<div class="'+classDiv+'"><p class="infos"><span class="pseudo">'+nickname+'</span>,<time class="date" title="'+date+'">'+date+'</time></p><p>' + msg + '</p></div>');
    
}
