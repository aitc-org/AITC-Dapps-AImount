$(document).ready(function() { 
  $('#togglenode').click(function(){
    $('#nodepopup').toggle();
  });

  $('#settingdropdown').click(function(){
    $('#settingspopup').toggle();
  });

  $('#div_add_token').click(function(){
    document.getElementById("settingspopup").style.display = "none";
    document.getElementById("addtokenform").style.display = "block";
  });

  $('#sendtr').click(function(){
    $('#sendtrform').toggle();
    document.getElementById('inputto').value = "";
    document.getElementById('inputamount').value = "";
    document.getElementById('inputhex').value = "";
    $('#inputto').focus();
  });

  if (typeof(Storage) !== "undefined") {
    let sharedData;
    if (!(localStorage.getItem("sharedData") === null)) {
      $("#sendtr").click();
      sharedData = localStorage.sharedData;
      console.log(localStorage.sharedData);
      var data = sharedData.split(',');
      console.log(data[0]);
      $("#inputto").val(data[0].trim());
      $("#inputamount").val(data[1].trim());
      $("#inputhex").val(data[2].trim());
      delete localStorage.sharedData;
      console.log(localStorage.sharedData);
    }
   
    if (localStorage.getItem("encryptedseedimport") === null) {
      document.getElementById('div_export_mnemonic').style.display = "none";
    }
    else{
      document.getElementById('div_export_mnemonic').style.display = "flex";
    }
  }
 });



  