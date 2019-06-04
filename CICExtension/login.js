$(document).ready(function() { 
    $('#togglenode').click(function(){
        $('#nodepopup').toggle();
    });

    $('#importPK').click(function(){
      $('#enterPKform').toggle();
      $('#inputPK').focus();
    });

    $('#btnsavePK').click(function(){
        var PK = $('#inputPK').val().trim();
        if(PK!=""){
            localStorage.PK = PK;
            chrome.browserAction.setPopup({
                popup:"popup.html"
             });
             window.location.href = 'popup.html';
        }
    });
});