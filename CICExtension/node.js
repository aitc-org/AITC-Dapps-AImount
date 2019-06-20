const crypto = require('crypto');
const sdag = require('sdagraph');
var aesjs = require('aes-js');


var nonce;
var settransactionlocal;
var a = "";
var ShowBalance;

//Create account
var pri = "";


function signTransaction(to,amount,inputhex,nonce){
    //nonce = getNonce();
    //console.log(nonce);
    var pk;
    if (!(localStorage.getItem("PK") === null)) {
      //pk = localStorage.PK;
      pk = DecryptPrivateKey(localStorage.PK);
    }
    if(nonce!== undefined){
      //Create transaction tx.
      tx = {
      To : to,
      PrivateKey : pk,
      Balance : amount,
      Nonce : String(nonce),
      Gas : "1",
      Type : "a66",
      Input : inputhex
    }  
    let transaction = new sdag.Signs.NewTransaction(pri,tx)
    //Sign Transaction using GetSignRawHexFull() and use output result for broadcast.
    var signtrans = transaction.GetSignRawHexFull();
    var result = signtrans.result;
    console.log(result);
    return result;
    }
}

function sendTransactionBroadcast(result,to,amount){ 
    $.ajax({ 
    type : "POST", 
    async: true,
    timeout: 3000,
    url : "http://192.168.51.212:9999/broadcast",	
    data: JSON.stringify(result), 
    contentType: 'text/plain; charset=UTF-8', 
    success:function(json){ 
      console.log(json);
      var minus = ShowBalance - amount;
      var newetherprice = minus / 1000000000000000000;
      console.log(newetherprice);
      document.getElementById("accbal").innerHTML = newetherprice;
      ShowBalance = minus;
      nonce = nonce + 1; //This is only for demo.
      
      document.getElementById("sendtrform").style.display = "none";
      console.log('new nonce:'+nonce);

      localStorage.ls_to = to;
      localStorage.ls_amount = amount;

      sethistory();

      //Close cic popup window if it is opened from Image webpage otherwise not.
      if (typeof(Storage) !== "undefined") {
        let openwindow;
        if (!(localStorage.getItem("openwindow") === null)) {
          console.log(localStorage.openwindow);
          openwindow = localStorage.openwindow;
          if(openwindow == 1){
            setTimeout(function(){ window.close(); }, 2000); 
          } 
          delete localStorage.openwindow;
        }
      }
      
    }, 
    error: function() { 
    alert("Error"); 
    } 
    }); 
}


function DecryptPrivateKey(encryptedHex){
  var key;

  if (!(localStorage.getItem("quentinTarantino") === null)) {
    var retrievedData = localStorage.getItem("quentinTarantino");
    key = JSON.parse(retrievedData);
  }
  //var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
  // When ready to decrypt the hex string, convert it back to bytes
  var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
  
  // The counter mode of operation maintains internal state, so to
  // decrypt a new instance must be instantiated.
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  var decryptedBytes = aesCtr.decrypt(encryptedBytes);
  
  // Convert our bytes back into text
  var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  console.log(decryptedText);
  return decryptedText;
}

function getNonce(to,amount,inputhex) {
    
    /*
    var request = new XMLHttpRequest();
    request.open('GET', 'http://192.168.51.212:9999/getAccount?address=23471aa344372e9c798996aaf7a6159c1d8e3eac', true);
    request.onload = function () {
      var data = JSON.parse(this.response);
      if (request.status >= 200 && request.status < 400) {
        nonce = data.Nonce;
        var result = signTransaction(to,amount,inputhex,nonce);
        sendTransactionBroadcast(result,amount);
      } else {
        console.log('error');
      }
    }
    // Send request
    request.send(null);
    */
   //This is only for demo.
   console.log('nonce:'+nonce);
   var result = signTransaction(to,amount,inputhex,nonce);
   sendTransactionBroadcast(result,to,amount);
}

function getBalance() {

  var PKaddress;
  if (!(localStorage.getItem("PKaddress") === null)) {
    PKaddress = localStorage.PKaddress;
  }
  if(PKaddress != ""){
  $.ajax({ 
      type : "GET", 
      async: true,
      url : "http://192.168.51.212:9999/getAccount?address="+PKaddress,
      //url : "http://192.168.51.212:9999/getAccount?address=23471aa344372e9c798996aaf7a6159c1d8e3eac",   
      contentType: 'text/plain; charset=UTF-8', 
      success:function(data){ 
        console.log(data);
        var data1 = JSON.parse(data);
        ShowBalance = data1.Balance;
        nonce = data1.Nonce; //This is only for demo.
        console.log(ShowBalance);
        console.log('api nonce:'+nonce);
        
        if(ShowBalance!=""){
          ShowBalance = parseFloat(ShowBalance);
          var etherprice = ShowBalance / 1000000000000000000;
          document.getElementById("accbal").innerHTML = String(etherprice);
          console.log(etherprice);
        }
        else{
          ShowBalance = 0;
          document.getElementById("accbal").innerHTML = "0";
        }
        
        sethistory();
      }, 
      error: function() { 
      alert("Error"); 
      } 
  }); 
}
}


window.addEventListener('load', function load(event){

  if (!(localStorage.getItem("PK") === null)) {
    pri = DecryptPrivateKey(localStorage.PK);
    let account2 = new sdag.Accounts.NewAccount(pri);
    console.log("PK",pri);
    console.log("PK Address:",account2.Address);
    localStorage.PKaddress = account2.Address;
  }
  getBalance();
    
  var createButton = document.getElementById('send');
  createButton.addEventListener('click', function() { 
       var to = document.getElementById('inputto').value.trim();
       var amount = document.getElementById('inputamount').value.trim();
       var inputhex = document.getElementById('inputhex').value.trim();

       if((to.length!=0) && (amount.length!=0) && (inputhex.length!=0)){
        var regexp = /^[0-9a-fA-F]+$/;  //regex to check hex value
        if((to.length == 40) && (regexp.test(to)) && (regexp.test(inputhex))){
          amount = parseFloat(amount);
          amount = amount*Math.pow(10, 18);
          amount = String(amount);
          getNonce(to,amount,inputhex);
        }
        else{
          console.log('invalid hex');
        }
       }
  });

  var creatediv = document.getElementById('clk_logout');
  creatediv.addEventListener('click', function() { 
    var password = localStorage.getItem('password');
    localStorage.clear();
    localStorage.setItem('password',password);

    chrome.browserAction.setPopup({
      popup:"login.html"
    });
    window.location.href = 'login.html';
  });

  //Allow only numbers and "." in textbox. 
  $('#inputamount').keypress(function(event) {
    if (((event.which != 46 || (event.which == 46 && $(this).val() == '')) ||
            $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
  }).on('paste', function(event) {
    event.preventDefault();
  });

  var enterPKdiv = document.getElementById('div_show_PK');
  enterPKdiv.addEventListener('click', function() { 
    document.getElementById('enterseeddiv').style.display = "block";
    document.getElementById('showPkdiv').style.display = "none";
    $('#txt_enterseed').focus();
  });

  var btncancelexport = document.getElementById('exportPK_cancel');
  btncancelexport.addEventListener('click', function() { 
    document.getElementById('txt_enterseed').value = "";
    document.getElementById('exportPK_confirm').disabled = true;
    document.getElementById('enterseeddiv').style.display = "none";
    $('#lbl_exporterror').html("").css('color', 'red');
  });

  $("#txt_enterseed").on('keyup', function() {
    if(this.value != ""){
        var words = this.value.match(/\S+/g).length;
        if (words > 12) {
            var trimmed = $(this).val().split(/\s+/, 12).join(" ");
            $(this).val(trimmed + " ");
        }
        else if(words == 12) {
          document.getElementById('exportPK_confirm').disabled = false;
        }
        else{
          document.getElementById('exportPK_confirm').disabled = true;
        }
    }
    $('#lbl_exporterror').html("").css('color', 'red');
});

  var showPKdiv = document.getElementById('exportPK_confirm');
  showPKdiv.addEventListener('click', function() { 
    if (!(localStorage.getItem("seedphrase") === null)) {
      var seedphrase = localStorage.seedphrase;
      var checkseedphrase = document.getElementById('txt_enterseed').value.trim();
      seedphrase = seedphrase.replace(/\s/g, "");
      checkseedphrase = checkseedphrase.replace(/\s/g, "");
      if(checkseedphrase == seedphrase){
        if (!(localStorage.getItem("PK") === null)) {
          var PK = DecryptPrivateKey(localStorage.PK);
          document.getElementById('showPkdiv').style.display = "block";
          document.getElementById('span_showPK').innerHTML = PK;
    
          document.getElementById('txt_enterseed').value = "";
          document.getElementById('exportPK_confirm').disabled = true;
          document.getElementById('enterseeddiv').style.display = "none";
        }
        $('#lbl_exporterror').html("").css('color', 'red');
      }
      else{
        //document.getElementById('lbl_exporterror').innerHTML = "Incorrect seed phrase";
        $('#lbl_exporterror').html("Incorrect seed phrase").css('color', 'red');
      }
    }
    
  });

  $('#span_showPK').click(function(event) {
    this.select();
    document.execCommand("copy");
  });
  });

function sethistory(){

    if ((localStorage.getItem("ls_to") === null) && (localStorage.getItem("ls_amount") === null)) {
       
    }
    else{
        var toaddress = localStorage.ls_to;
        var amountbalance = localStorage.ls_amount;
        amountbalance = amountbalance / 1000000000000000000;
        var status = "nonverified";
    
        var a = '<div class="grid-container">';
        a += '<div class="item1">'+toaddress+'</div>';
        a += '<div class="item2">Contract Interaction</div>';
        a += '<div class="item3" style="text-align:right">';
        a += '<span class="currency-display-component__text">-'+amountbalance+'</span>';
        a += '<span class="currency-display-component__suffix">CIC</span>';
        a += '</div>';
        a += '<div class="item4"><span class="transaction-status--confirmed">'+status+'</span></div>';
        a += '</div>';
        
        $('#historylist').prepend(a);
    }
}






  