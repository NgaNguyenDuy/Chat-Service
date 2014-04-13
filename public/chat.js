var message;
$(document).ready(function() {
    $("#alertPseudo").hide();
    $('#modalPseudo').modal('show');
    $('#pseudoSubmit').click(function() {
        setConnect();
    });
    checkInput();
    message = $('#messageInput');
});

var socket = io.connect();
socket.on('greeting', function(data) {
    alert(data);
});


function setConnect() {
    if ($('#pseudoInput').val() != "") {
        socket.emit('setNickName', $('#pseudoInput').val());
        
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
                alert($.trim(value));
            }
        }
    });
}
