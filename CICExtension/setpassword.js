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

    $('#btnlogin').on('click',function(){
        var password = $('#newpassword').val().trim();

        if(password.length >= 8){
            
        localStorage.password = password;

        chrome.browserAction.setPopup({
        popup:"login.html"
        });
        window.location.href = 'login.html';
        }
    });

    
 }); 

 