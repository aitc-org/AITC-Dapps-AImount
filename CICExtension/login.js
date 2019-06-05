$(document).ready(function() { 
    $('#togglenode').click(function(){
        $('#nodepopup').toggle();
    });

    $('#importPK').click(function(){
      $('#enterPKform').toggle();
      $('#inputPK').focus();
    });

    $('[id="inputPK"]').on('change', function() {
        var regexp = /^[0-9a-fA-F]+$/;
        var PK = $('#inputPK').val().trim();
        if((PK.length == 64) && (regexp.test(PK))){
            $('#btnsavePK').prop('disabled', false);
        }
        else{
            $('#btnsavePK').prop('disabled', true);
        }
      });

    $('#btnsavePK').click(function(){
        
        var PK = $('#inputPK').val().trim();
        localStorage.PK = PK;
        chrome.browserAction.setPopup({
        popup:"popup.html"
        });
        window.location.href = 'popup.html';
    });
});
