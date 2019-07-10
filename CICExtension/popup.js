$(document).ready(function() { 
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

  $('#sidebarmenu').click(function(){
    document.getElementById("settingspopup").style.display = "none";
    $("#rightsidebar").toggle("slide");
  });
  
  $('#close_sidebarright').click(function(){
    document.getElementById("rightsidebar").style.display = "none";
  });

  $('#div_add_token').click(function(){
    document.getElementById("Sendtokenform").style.display = "none";
    document.getElementById("settingspopup").style.display = "none";
    document.getElementById("rightsidebar").style.display = "none";
    document.getElementById("sendtrform").style.display = "none";
    document.getElementById("addtokenform").style.display = "block";
    document.getElementById('txt_tokenaddress').value = "";
    document.getElementById('txt_tokensymbol').value = "";
    document.getElementById('txt_decprecesion').value = "";
    
    $('#lbl_addtokenerror').html("");
    $('#txt_tokenaddress').focus();
  });

  $('#sendtr').click(function(){
    $('#sendtrform').toggle();
    document.getElementById('inputto').value = "";
    document.getElementById('inputamount').value = "";
    document.getElementById('inputhex').value = "";
    $("#SendTrForm").find("*").prop('disabled', false);
    document.getElementById('Showfromweb').style.display="none";
    $('#lbl_sendtr').html("");
    $('#inputto').focus();
  });

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
   
    if (localStorage.getItem("encryptedseedimport") === null) {
      document.getElementById('div_export_mnemonic').style.display = "none";
    }
    else{
      document.getElementById('div_export_mnemonic').style.display = "flex";
    }
  }
 });




  