$(document).ready(function() {

    $('#newpassword').focus();

    $('#newpassword').on('keyup', function () {
        if($('#newpassword').val().length < 8){
            $('#lbl_passworderror').html('Password not long enough').css('color', 'red');
            $('#btnlogin').prop('disabled', true);
        }
        else 
        {
            $('#btnlogin').prop('disabled', false);
            $('#lbl_passworderror').html('');
        }
    });

    // Submit form on enter key
    $('#newpassword').keydown(function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $('#btnlogin').click();
        }
    });


    $('#btnlogin').on('click',function(){

        var password = $('#newpassword').val().trim();

        if(password.length >= 8){

            if($('#logourl').val() != "")
            {
                localStorage.logo = $('#logourl').val().trim();
            }
            if($('#backgroundurl').val() != ""){
                localStorage.backgroundurl = $('#backgroundurl').val().trim();
            }
            
            localStorage.password = password;

            chrome.browserAction.setPopup({
            popup:"login.html"
            });
            window.location.href = 'login.html';
        }
    });
 }); 

 
 