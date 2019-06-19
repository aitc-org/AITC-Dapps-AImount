$(document).ready(function() { 
    $('#togglenode').click(function(){
        $('#nodepopup').toggle();
    });

    $('#btn_importwallet').click(function(){
      //$('#enterPKform').toggle();
      $('#importwalletoptions').toggle();
      document.getElementById('enterPKform').style.display = "none";
      document.getElementById('enterMnemonicform').style.display = "none";
      document.getElementById('CreateWallet').style.display = "none";
      //$('#inputPK').focus();
    });

    $('#btn_createwallet').click(function(){
        $('#CreateWallet').toggle();
        document.getElementById('enterPKform').style.display = "none";
        document.getElementById('enterMnemonicform').style.display = "none";
        document.getElementById('importwalletoptions').style.display = "none";
    });

    $('#imprtwalletoption_privatekey').click(function(){
        document.getElementById('importwalletoptions').style.display = "none";
        document.getElementById('enterPKform').style.display = "block";
        $('#inputPK').focus();
        $('#inputPK').val('');
    });

    $('#imprtwalletoption_seedphrase').click(function(){
        document.getElementById('importwalletoptions').style.display = "none";
        document.getElementById('enterPKform').style.display = "none";
        document.getElementById('enterMnemonicform').style.display = "block";
    });

    $('#btncancelPK').click(function(){
        document.getElementById('enterPKform').style.display = "none";
    });

    /*
    $('#newpassword').on('keyup', function () {
        if($('#newpassword').val().length < 8){
            $('#lbl_passworderror').html('Password not long enough').css('color', 'red');
        }
        else 
        {
            $('#lbl_passworderror').html('');
        }
        if(($('#newpassword').val().length >= 8)){
            $('#btn_confirmcreate').prop('disabled', false);
        }
        else{
            $('#btn_confirmcreate').prop('disabled', true);
        }
    });

    $('#importwalletpassword').on('keyup', function () {
        if($('#importwalletpassword').val().length < 8){
            $('#lbl_importwalletpassworderror').html('Password not long enough').css('color', 'red');
        }
        else 
        {
            $('#lbl_importwalletpassworderror').html('');
        }
        if(($('#importwalletpassword').val().length >= 8)){
            $('#btn_confirmimportwallet').prop('disabled', false);
        }
        else{
            $('#btn_confirmimportwallet').prop('disabled', true);
        }
    });
    */

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


    /*
    $('#confirmnewpassword').on('keyup', function () {
        if ($('#newpassword').val() == $('#confirmnewpassword').val()) {
          $('#lbl_passworderror').html('');
        } else {
            $('#lbl_passworderror').html("Passwords Don't Match").css('color', 'red');
        }
        if(($('#confirmnewpassword').val().length >= 8) && ($('#newpassword').val() == $('#confirmnewpassword').val())){
            $('#btn_confirmcreate').prop('disabled', false);
        }
        else{
            $('#btn_confirmcreate').prop('disabled', true);
        }
    });*/

    $('[id="inputPK"]').on('keyup', function() {
        var regexp = /^[0-9a-fA-F]+$/;
        var PK = $('#inputPK').val().trim();
        if((PK.length == 64) && (regexp.test(PK))){
            $('#btnsavePK').prop('disabled', false);
        }
        else{
            $('#btnsavePK').prop('disabled', true);
        }
    });

    $('#btn_cancelcreate').click(function(){
        //$('#newpassword').val('');
        //$('#lbl_passworderror').html('');
        document.getElementById('CreateWallet').style.display = "none";
    });

    $(".checkmark").click(function () {
        $(this).toggleClass("green");
        if($("#btn_confirmshowaddress").is(":disabled") == true){
            $('#btn_confirmshowaddress').prop('disabled', false);
        }
        else{
            $('#btn_confirmshowaddress').prop('disabled', true);
        }
    });
    /*
    $('#btnsavePK').click(function(){
        
        var PK = $('#inputPK').val().trim();
        localStorage.PK = PK;
        chrome.browserAction.setPopup({
        popup:"popup.html"
        });
        window.location.href = 'popup.html';
    });*/
});
