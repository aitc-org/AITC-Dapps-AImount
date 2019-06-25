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
    let transaction = new sdag.Signs.NewTransaction(pk,tx)
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
      localStorage.txid = json;

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
  var password;

  if (!(localStorage.getItem("password") === null)) {
    password = localStorage.password;
  }

  //var password = $('#newpassword').val().trim();
  var passwordtohex = toHex(password);
  var hextodec = hextodecimal(passwordtohex);
  console.log('Decrypt password to hex: '+password);
  console.log('Decrypt hex to int '+ hextodec);
  var subStr = hextodec.toString().substr(0, 16);
  console.log(subStr);
  arr = subStr.toString(10).split('').map(Number);
  for(i=0;i<arr.length;i++){
    arr[i] = +arr[i]|0 ;
  } 

  key = arr;

  /*
  if (!(localStorage.getItem("quentinTarantino") === null)) {
    var retrievedData = localStorage.getItem("quentinTarantino");
    key = JSON.parse(retrievedData);
  }
  */

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

//convert string into hex function
function toHex(str) {
  var hex = '';
  var i = 0;
  while(str.length > i) {
      hex += ''+str.charCodeAt(i).toString(16);
      i++;
  }
  return hex;
}

//convert hex into decimal function
function hextodecimal(s) {

function add(x, y) {
    var c = 0, r = [];
    var x = x.split('').map(Number);
    var y = y.split('').map(Number);
    while(x.length || y.length) {
        var s = (x.pop() || 0) + (y.pop() || 0) + c;
        r.unshift(s < 10 ? s : s - 10); 
        c = s < 10 ? 0 : 1;
    }
    if(c) r.unshift(c);
    return r.join('');
}

var dec = '0';
s.split('').forEach(function(chr) {
    var n = parseInt(chr, 16);
    for(var t = 8; t; t >>= 1) {
        dec = add(dec, dec);
        if(n & t) dec = add(dec, '1');
    }
});
return dec;
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
    //var password = localStorage.getItem('password');
    localStorage.clear();
    //localStorage.setItem('password',password);

    chrome.browserAction.setPopup({
      popup:"setpassword.html"
    });
    window.location.href = 'setpassword.html';
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
    //document.getElementById('enterpassword_PK').style.display = "block";
    document.getElementById('showPkdiv').style.display = "none";
    $('#enterpassword_PK').toggle();
    $('#txt_enterseed').focus();
  });

  $('#div_export_mnemonic').click(function(){
    document.getElementById('showMnemonicdiv').style.display = "none";
    $("#enterpassword_seed").toggle();
    $('#txt_enterpasswordseed').focus();
  })

  var btncancelexport = document.getElementById('exportPK_cancel');
  btncancelexport.addEventListener('click', function() { 
    document.getElementById('txt_enterseed').value = "";
    //document.getElementById('exportPK_confirm').disabled = true;
    document.getElementById('enterpassword_PK').style.display = "none";
    $('#lbl_exporterror').html("").css('color', 'red');
  });

  var btncancelexportmnemonic = document.getElementById('exportmnemonic_cancel');
  btncancelexportmnemonic.addEventListener('click', function() { 
    document.getElementById('txt_enterpasswordseed').value = "";
    //document.getElementById('exportPK_confirm').disabled = true;
    document.getElementById('enterpassword_seed').style.display = "none";
    $('#lbl_mnemonic_exporterror').html("").css('color', 'red');
  });


  var showPKdiv = document.getElementById('exportPK_confirm');
  showPKdiv.addEventListener('click', function() { 
    if (!(localStorage.getItem("password") === null)) {
      var password = localStorage.password;
      var checkpassword = document.getElementById('txt_enterseed').value.trim();
     
      if(password == checkpassword){
        if (!(localStorage.getItem("PK") === null)) {
          var PK = DecryptPrivateKey(localStorage.PK);
          document.getElementById('showPkdiv').style.display = "block";
          document.getElementById('span_showPK').innerHTML = PK;
        
          document.getElementById('txt_enterseed').value = "";
          //document.getElementById('exportPK_confirm').disabled = true;
          document.getElementById('enterpassword_PK').style.display = "none";
        }
        $('#lbl_exporterror').html("").css('color', 'red');
      }
      else{
        //document.getElementById('lbl_exporterror').innerHTML = "Incorrect seed phrase";
        $('#lbl_exporterror').html("Incorrect password").css('color', 'red');
      }
    }
  });

  $('#span_showPK').click(function(event) {
    this.select();
    document.execCommand("copy");
  });

  var showMnemonicdiv = document.getElementById('exportmnemonic_confirm');
  showMnemonicdiv.addEventListener('click', function() { 
  if (!(localStorage.getItem("password") === null)) {
    var password = localStorage.password;
    var checkpassword = document.getElementById('txt_enterpasswordseed').value.trim();
   
    if(password == checkpassword){
      if (!(localStorage.getItem("encryptedseedimport") === null)) {
        var MnemonicWords = DecryptPrivateKey(localStorage.encryptedseedimport);
        document.getElementById('showMnemonicdiv').style.display = "block";
        document.getElementById('span_showMnemonic').innerHTML = MnemonicWords;
      
        document.getElementById('txt_enterpasswordseed').value = "";
        //document.getElementById('exportPK_confirm').disabled = true;
        document.getElementById('enterpassword_seed').style.display = "none";
      }
      $('#lbl_mnemonic_exporterror').html("").css('color', 'red');
    }
    else{
      //document.getElementById('lbl_exporterror').innerHTML = "Incorrect seed phrase";
      $('#lbl_mnemonic_exporterror').html("Incorrect password").css('color', 'red');
    }
  }
});

$('#span_showMnemonic').click(function(event) {
  this.select();
  document.execCommand("copy");
});

});

function sethistory(){

    if (!((localStorage.getItem("ls_to") === null) && (localStorage.getItem("ls_amount") === null) && (localStorage.getItem("txid") === null))) {
      var toaddress = localStorage.ls_to;
      var amountbalance = localStorage.ls_amount;
      var txid = localStorage.txid;
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
      a += '<div class="item5"><span class="span_txid">'+"txid: "+txid+'</span></div>';
      a += '</div>';
      
      $('#historylist').prepend(a);
    }   
}






  