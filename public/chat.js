var message;
$(document).ready(function() {
    $("#alertPseudo").hide();
    $('#modalPseudo').modal('show');
    checkInput();
    message = $('#messageInput');
});

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
