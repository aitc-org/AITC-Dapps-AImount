$(document).ready(function() { 
    setLogo();

    $('#togglenode').click(function(){
        $('#nodepopup').toggle();
    });

    $('#btn_importwallet').click(function(){
      $('#importwalletoptions').toggle();
      document.getElementById('enterPKform').style.display = "none";
      document.getElementById('enterMnemonicform').style.display = "none";
      document.getElementById('CreateWallet').style.display = "none";
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
        $('#txt_seedphrase').val("");
        $('#txt_seedphrase').focus();
        $('#txt_importwalletderivepath').val("m/44'/0'/0'/0/0");
        $('#span_showaddress').text("");
        $('#btn_confirmimportwallet').prop('disabled', true);
    });

    $('#btncancelPK').click(function(){
        document.getElementById('enterPKform').style.display = "none";
        document.getElementById('importwalletoptions').style.display = "block";
    });

    $("#txt_seedphrase").on('keyup', function() {
        if(this.value != ""){
            var words = this.value.match(/\S+/g).length;
            if (words > 12) {
                var trimmed = $(this).val().split(/\s+/, 12).join(" ");
                $(this).val(trimmed + " ");
            }
        }
    });

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
        document.getElementById('CreateWallet').style.display = "none";
    });
});

function setLogo(){
    if (!(localStorage.getItem("logo") === null)) {
        var logo = localStorage.logo;
        document.getElementById("setlogo").src= logo;
        document.getElementById("setlogo2").src= logo;
    }
    else{
        document.getElementById("setlogo").src= 'https://tongkatali.io/wp-content/uploads/2018/11/tac-logo.png';
        document.getElementById("setlogo2").src= 'https://tongkatali.io/wp-content/uploads/2018/11/tac-logo.png';
    }
    if (!(localStorage.getItem("backgroundurl") === null)) {
        var bk = localStorage.backgroundurl;
        var square = document.getElementById('maincontainerdiv');
        square.style.backgroundImage = "url("+bk+")";
        square.style.backgroundRepeat = 'no-repeat';
        square.style.backgroundPosition = 'center';
        square.style.backgroundSize = 'contain';
    }
    else{
        var bk = 'https://bionutriciaextract.com/wp-content/uploads/2018/11/bio-nutricia-extract-tongkat-ali-long-jack-powder-manufacture.jpg';
        var square = document.getElementById('maincontainerdiv');
        square.style.backgroundImage = "url("+bk+")";
        square.style.backgroundRepeat = 'no-repeat';
        square.style.backgroundPosition = 'center';
        square.style.backgroundSize = 'contain';
    }
}
