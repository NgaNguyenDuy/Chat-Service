var message, inp;
$(document).ready(function() {
    message = $("#messageInput");
    $("#alertError").hide();
    $('#modalPseudo').modal('toggle');
    $('#pseudoSubmit').click(function() {
        setConnect();
    });
    checkInput();
    $("#talk").slimScroll({
        height: '450px'
    });
//    message = $('#messageInput');
});

var socket = io.connect();

socket.on('connect', function() {
    console.log('connected');
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


function setConnect() {
    inp = $('#pseudoInput').val();
    //if ($('#pseudoInput').val() != "") {
    if ($.trim(inp) != "") {
        socket.emit('setNickName', $('#pseudoInput').val());
        socket.on('status', function(data) {
            if (data == "ok") {
                $("#alertError").hide();
                $("#modalPseudo").modal('hide');
                
                $("#luser").append(inp);
            } else {
                $("#alertError").html("The user " + inp + " realy taken!!");
                $("#alertError").slideDown();
            }
        });
        //$('#modalPseudo').modal('hide');
    } else {
        alert("Please enter your nick name to chat!!");
    }
}

function checkInput() {
    $("#messageInput").keyup(function(e) {
        var value = $( this ).val();
        if(e.keyCode == 13) {
            if ($.trim(value) == "") {
                alert("Ban phai nhap vao tin nhan");
            } else {
                sendMess();
            }
        }
    });
}


function sendMess() {
    if (message != "") {
        if ($.trim(inp) == "") {
            alert("Ban phai nhap nick name truoc khi bat dau chat");
            $('#modalPseudo').modal('show');
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

function addUser(nickname, self) {
    if (self) {
        var userDiv = "row nickname self";
    } else {
        var userDiv = "row nickname";
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
