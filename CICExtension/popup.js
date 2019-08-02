$(document).ready(function() { 
  setLogo();

  $('#togglenode').click(function(){
    $('#nodepopup').toggle();
  });

  $('#settingdropdown').click(function(){
    document.getElementById("nodepopup").style.display = "none";
    $('#settingspopup').toggle();
  });

  $('#div_addcustomnode').click(function(){
    $('#enterCustomnode').toggle();
  });
  
  $('#close_sidebarright').click(function(){
    document.getElementById("rightsidebar").style.display = "none";
  });

  $('#div_add_token').click(function(){
    document.getElementById("Sendtokenform").style.display = "none";
    document.getElementById("settingspopup").style.display = "none";
    document.getElementById("rightsidebar").style.display = "none";
    document.getElementById("sendtrform").style.display = "none";
    document.getElementById("Deposit").style.display = "none";
    document.getElementById("addtokenform").style.display = "block";
    document.getElementById('txt_tokenaddress').value = "";
    document.getElementById('txt_tokensymbol').value = "";
    document.getElementById('txt_decprecesion').value = "";
    
    $('#lbl_addtokenerror').html("");
    $('#txt_tokenaddress').focus();
  });

  $('#sendtr').click(function(){
    $('#sendtrform').toggle();
    document.getElementById("Deposit").style.display = "none";
    document.getElementById('inputto').value = "";
    document.getElementById('inputamount').value = "";
    document.getElementById('inputhex').value = "";
    $("#SendTrForm").find("*").prop('disabled', false);
    document.getElementById('Showfromweb').style.display="none";
    $('#lbl_sendtr').html("");
    $('#inputto').focus();
    checkBalance();
  });

  function checkBalance(){
    var cicbalance = document.getElementById("accbal").innerHTML;
    if(parseFloat(cicbalance) <= 0){
      $('#lbl_sendtr').html("Balance not enough.").css('color', 'red');
      $("#SendTrForm").find("*").prop('disabled', true);
      return;
    }
    else{
      $('#lbl_sendtr').html("");
    }
  }

  //Bind data from Image web into cic wallet.

  if (typeof(Storage) !== "undefined") {

    let sharedData;
    if (!(localStorage.getItem("sharedData") === null)) {
      
      sharedData = localStorage.sharedData;
      console.log(localStorage.sharedData);
      var data = sharedData.split(',');
      console.log("Tokenaddr:"+data[0]);
      $("#sendtr").click();

      if (!(localStorage.getItem("Token") === null)) {
        var Tokeninfo = JSON.parse(localStorage.getItem("Token"));
        if(Tokeninfo.length > 0){
          var tokenaddr = "0x"+data[0].trim();
          for(var i=0; i < Tokeninfo.length;i++){
            if(Tokeninfo[i]["TAddress"] == tokenaddr){

              var tokenbal = Tokeninfo[i]["TBalance"] / 1000000000000000000;
              
              if(tokenbal <= 0){  //Check if token have balance.
                $('#lbl_sendtr').html("Token Balance not enough.").css('color', 'red');
                $("#SendTrForm").find("*").prop('disabled', true);
              }
              else if(tokenbal < data[1].trim()){   //check if token has greater amount than buying amount.
                $('#lbl_sendtr').html("Token Balance not enough.").css('color', 'red');
                $("#SendTrForm").find("*").prop('disabled', true);
              }
              else{
                $("#inputto").val(data[0].trim());
                $("#inputamount").val("0");
                $("#inputhex").val(data[2].trim());
                $('#lbl_sendtr').html("");
                var symbol = Tokeninfo[i]["Tsymbol"].trim();
                if(symbol == "GIBT"){
                  symbol = "TAC";
                }
                document.getElementById('span_showtokenfromweb').innerHTML = symbol;
                document.getElementById('span_showtokenamountfromweb').innerHTML = data[1].trim();
                document.getElementById('Showfromweb').style.display="block";
                delete localStorage.sharedData;
                console.log(localStorage.sharedData);
                $("#SendTrForm").find("*").prop('disabled', false);
              }
            }
            else{
              $("#SendTrForm").find("*").prop('disabled', true);
              document.getElementById('Showfromweb').style.display="none";
              $('#lbl_sendtr').html("Please Add Token First").css('color', 'red');
              delete localStorage.sharedData;
            }
          }
        }
        else{
          $("#SendTrForm").find("*").prop('disabled', true);
          document.getElementById('Showfromweb').style.display="none";
          $('#lbl_sendtr').html("Please Add Token First").css('color', 'red');
          delete localStorage.sharedData;
        }
      }
      else{
        $("#SendTrForm").find("*").prop('disabled', true);
        document.getElementById('Showfromweb').style.display="none";
        $('#lbl_sendtr').html("Please Add Token First").css('color', 'red');
        delete localStorage.sharedData;
      }
    }
   
    //if user imports wallet using mnemonic seed then only he can export menmonic phrase.
    if (localStorage.getItem("encryptedseedimport") === null) {
      document.getElementById('div_export_mnemonic').style.display = "none";
    }
    else{
      document.getElementById('div_export_mnemonic').style.display = "flex";
    }
  }
 });

function setLogo(){
  if (!(localStorage.getItem("logo") === null)) {
      var logo = localStorage.logo;
      document.getElementById("setlogo").src = logo;
      document.getElementById("setlogo2").src = logo;
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
 



  