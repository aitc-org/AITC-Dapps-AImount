$(document).ready(function() {
    $("#txt_seedphrase").on('keyup', function() {
        if(this.value != ""){
            var words = this.value.match(/\S+/g).length;
            if (words > 12) {
                // Split the string on first 200 words and rejoin on spaces
                var trimmed = $(this).val().split(/\s+/, 12).join(" ");
                // Add a space at the end to keep new typing making new words
                $(this).val(trimmed + " ");
            }
            else {
            //$('#display_count').text(words);
            //$('#word_left').text(12-words);
            }
        }
    });

    $('#newpassword').on('keyup', function () {
        if($('#newpassword').val().length < 8){
            $('#lbl_passworderror').html('Password not long enough').css('color', 'red');
        }
        else if ($('#newpassword').val() != $('#confirmnewpassword').val()) {
            $('#lbl_passworderror').html("Passwords Don't Match").css('color', 'red');
        } else 
        {
            $('#lbl_passworderror').html('');
        }
    });

    $('#confirmnewpassword').on('keyup', function () {
        if ($('#newpassword').val() == $('#confirmnewpassword').val()) {
          $('#lbl_passworderror').html('');
        } else 
          $('#lbl_passworderror').html("Passwords Don't Match").css('color', 'red');
    });

    $('#btnimport').on('click',function(){
        var seedphrase = $('#txt_seedphrase').val().trim();
        var password = $('#newpassword').val().trim();
        var confirmpassword = $('#confirmnewpassword').val().trim();

        if((seedphrase.match(/\S+/g).length == 12) && (password.length >= 8) && (confirmpassword.length >= 8) && (password == confirmpassword)){
        
        localStorage.seedphrase = $('#txt_seedphrase').val().trim();
        localStorage.password = password;

        chrome.browserAction.setPopup({
        popup:"login.html"
        });
        window.location.href = 'login.html';
        }
    })
 }); 

 