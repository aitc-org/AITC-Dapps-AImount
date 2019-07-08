const crypto = require('crypto');
const sdag = require('sdagraph');
var aesjs = require('aes-js');

var nonce;
var settransactionlocal;
var a = "";
var ShowBalance;

var pri = "";

//check token address
var validTokenaddress = true;

var Defaultipaddress = '192.168.51.212';
var DefaultMainport = '9999';
var DefaultVMPort = '5214';
var DefaultAppPort = '5314';


function signTransaction(to,amount,inputhex,nonce,gas){
    
    var pk;
    if (!(localStorage.getItem("PK") === null)) {
      pk = DecryptPrivateKey(localStorage.PK);
    }
    if(gas == ""){
      gas = "1";
    }
    if(nonce!== undefined){
      //Create transaction tx.
      tx = {
      To : to,
      PrivateKey : pk,
      Balance : amount,
      Nonce : String(nonce),
      Gas : gas,
      Type : "a66",
      Input : inputhex
    }  
    let transaction = new sdag.Signs.NewTransaction(pk,tx)
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
    //url : "http://192.168.51.212:9999/broadcast",
    url : "http://"+Defaultipaddress+":"+DefaultMainport+"/broadcast",		
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
      document.getElementById("Sendtokenform").style.display = "none";
      console.log('new nonce:'+nonce);

      var History =[];
      var historyinfo = {"ls_to":to,"ls_amount":amount,"txid":json}

      if (!(localStorage.getItem("History") === null)) {
        var storeHistoryinfo = JSON.parse(localStorage.getItem("History"));
        storeHistoryinfo.push(historyinfo);
        localStorage.setItem('History', JSON.stringify(storeHistoryinfo));
      }
      else{
        History.push(historyinfo);
        localStorage.setItem('History', JSON.stringify(History));
      }

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
   var result = signTransaction(to,amount,inputhex,nonce,"");
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
      //url : "http://192.168.51.212:9999/getAccount?address="+PKaddress,
      url : "http://"+Defaultipaddress+":"+DefaultMainport+"/getAccount?address="+PKaddress,
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

//Start of Page load event.
window.addEventListener('load', function load(event){

  if (!(localStorage.getItem("PK") === null)) {
    pri = DecryptPrivateKey(localStorage.PK);
    let account2 = new sdag.Accounts.NewAccount(pri);
    console.log("PK",pri);
    console.log("PK Address:",account2.Address);
    localStorage.PKaddress = account2.Address;
  }
  else{
    localStorage.clear();
    chrome.browserAction.setPopup({
      popup:"setpassword.html"
    });
    window.location.href = 'setpassword.html';
  }

  getBalance();
  setTokenList();
  setNetworkList();
  bindDefaultNetwork();
    
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
   
    localStorage.clear();

    chrome.browserAction.setPopup({
      popup:"setpassword.html"
    });
    window.location.href = 'setpassword.html';
  });

  //Allow only numbers and "." in textbox. 
  $('#txt_decprecesion,#inputamount,#inputamounttoken,#txt_nodemainport,#txt_nodeVMport,#txt_nodeAppport').keypress(function(event) {
    if (((event.which != 46 || (event.which == 46 && $(this).val() == '')) ||
            $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
  }).on('paste', function(event) {
    event.preventDefault();
  });

  var enterPKdiv = document.getElementById('div_show_PK');
  enterPKdiv.addEventListener('click', function() { 
    document.getElementById('showPkdiv').style.display = "none";
    $('#enterpassword_PK').toggle();
    $('#txt_enterseed').focus();
  });

  $('#div_export_mnemonic').click(function(){
    document.getElementById('showMnemonicdiv').style.display = "none";
    $("#enterpassword_seed").toggle();
    $('#txt_enterpasswordseed').focus();
  });

  var btncancelexport = document.getElementById('exportPK_cancel');
  btncancelexport.addEventListener('click', function() { 
    document.getElementById('txt_enterseed').value = "";
    document.getElementById('enterpassword_PK').style.display = "none";
    $('#lbl_exporterror').html("").css('color', 'red');
  });

  var addcustomnode_cancel = document.getElementById('addcustomnode_cancel');
  addcustomnode_cancel.addEventListener('click', function() { 
    document.getElementById('txt_nodename').value = "";
    document.getElementById('txt_nodeurl').value = "";
    document.getElementById('txt_nodemainport').value = "";
    document.getElementById('txt_nodeVMport').value = "";
    document.getElementById('txt_nodeAppport').value = "";

    document.getElementById('enterCustomnode').style.display = "none";
    $('#lbl_addcutomnode').html("");
  });

  var btncancelexportmnemonic = document.getElementById('exportmnemonic_cancel');
  btncancelexportmnemonic.addEventListener('click', function() { 
    document.getElementById('txt_enterpasswordseed').value = "";
    document.getElementById('enterpassword_seed').style.display = "none";
    $('#lbl_mnemonic_exporterror').html("").css('color', 'red');
  });

  var btncancel_addtoken = document.getElementById('cancel_addtoken');
  btncancel_addtoken.addEventListener('click', function() { 
    document.getElementById('txt_tokenaddress').value = "";
    document.getElementById('txt_tokensymbol').value = "";
    document.getElementById('txt_decprecesion').value = "";
    $('#lbl_addtokenerror').html("").css('color', 'red');
    document.getElementById('addtokenform').style.display = "none";
  });

  var btn_cancelsendtoken = document.getElementById('btn_cancelsendtoken');
  btn_cancelsendtoken.addEventListener('click', function() { 
    document.getElementById("Sendtokenform").style.display = "none";
    document.getElementById('inputtotoken').value = "";
    document.getElementById('inputamounttoken').value = "";
    document.getElementById('tokengas').value = "";
    $('#btn_sendtoken').prop('disabled', true);
    $('#inputtotoken').focus();
  });

  var btnconfirm_addtoken = document.getElementById('confirm_addtoken');
  btnconfirm_addtoken.addEventListener('click', function() { 
    var tokenadress = document.getElementById('txt_tokenaddress').value;
    var symbol = document.getElementById('txt_tokensymbol').value;
    var decimalprecision = document.getElementById('txt_decprecesion').value;
    
    if((tokenadress!="") && (symbol!="") && (decimalprecision!="")){
      
      getTokenBalance(tokenadress,symbol,decimalprecision);

      document.getElementById("addtokenform").style.display = "none";
      $("#rightsidebar").toggle("slide");
      }
  });

  var addcustomnode_confirm = document.getElementById('addcustomnode_confirm');
  addcustomnode_confirm.addEventListener('click', function() {
    var nodename = $('#txt_nodename').val().trim();
    var nodeurl = $('#txt_nodeurl').val().trim();
    var mainport = $('#txt_nodemainport').val().trim();
    var VMPort = $('#txt_nodeVMport').val().trim();
    var AppPort = $('#txt_nodeAppport').val().trim();

    var Networks =[];
    var networkinfo = {"ls_networkname":nodename,"ls_networkurl":nodeurl,"ls_mainport":mainport,"ls_VMport":VMPort,"ls_Appport":AppPort}

    if (!(localStorage.getItem("CustomNetwork") === null)) {
        var storenetworkinfo = JSON.parse(localStorage.getItem("CustomNetwork"));
        storenetworkinfo.push(networkinfo);
        localStorage.setItem('CustomNetwork', JSON.stringify(storenetworkinfo));
    }
    else{
        Networks.push(networkinfo);
        localStorage.setItem('CustomNetwork', JSON.stringify(Networks));
    }

    setNetworkList();
    document.getElementById('addcustomnode_cancel').click();
  });

  $("#txt_nodeurl,#txt_nodename,#txt_nodemainport,#txt_nodeVMport,#txt_nodeAppport").on('keyup', function() {
    var nodeurl = $('#txt_nodeurl').val().trim();
    var regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    var a = regex.test(nodeurl);
    if((a == true) && ($('#txt_nodename').val() != "") && ($('#txt_nodemainport').val() != "") && ($('#txt_nodeVMport').val() != "") && ($('#txt_nodeAppport').val() != ""))
    {
      $('#addcustomnode_confirm').prop('disabled', false);
    }
    else{
      $('#addcustomnode_confirm').prop('disabled', true);
    }
  });

  $("#txt_tokenaddress").on('keyup', function() {

    var to = this.value.trim();
    if(to != ""){
      var regexp = /^(0[xX])?[A-Fa-f0-9]+$/;  //regex to check hex value
      if((to.length == 42) && (regexp.test(to))){

        if (!(localStorage.getItem("Token") === null)) {
          var Tokeninfo = JSON.parse(localStorage.getItem("Token"));
          for(var i=0; i < Tokeninfo.length;i++){
            if(Tokeninfo[i]["TAddress"] == to){
              validTokenaddress = false;
              $('#lbl_addtokenerror').html("Token has already been added.").css('color', 'red');
              $('#confirm_addtoken').prop('disabled', true);
              break;
            }
            else{
              validTokenaddress = true;
              $('#lbl_addtokenerror').html("");
            }
          }
        }
        if(validTokenaddress == true){
          getTokenSymbol(to);
          getTokenDecimalPrecision(to);
        }
      }
      else{
        $('#confirm_addtoken').prop('disabled', true);
        $('#txt_tokensymbol').val("");
        $('#txt_decprecesion').val("");
        $('#lbl_addtokenerror').html("");
      }  
    }
    else{
      $('#confirm_addtoken').prop('disabled', true);
    }

  });

  $("#txt_tokensymbol,#txt_decprecesion").on('keyup', function() {

    var to = $("#txt_tokenaddress").val().trim();
    var regexp = /^(0[xX])?[A-Fa-f0-9]+$/;  //regex to check hex value
      
    if($("#txt_tokensymbol").val().length == 0){
      $('#confirm_addtoken').prop('disabled', true);
    }
    else if($("#txt_decprecesion").val().length == 0){
      $('#confirm_addtoken').prop('disabled', true);
    }
    else if($("#txt_tokenaddress").val().length != 42){
      $('#confirm_addtoken').prop('disabled', true);
    }
    else if(!(regexp.test(to))){
      $('#confirm_addtoken').prop('disabled', true);
    }
    else if(validTokenaddress == false){
      $('#confirm_addtoken').prop('disabled', true);
    }
    else{
      $('#confirm_addtoken').prop('disabled', false);
    }
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
          document.getElementById('enterpassword_PK').style.display = "none";
        }
        $('#lbl_exporterror').html("").css('color', 'red');
      }
      else{
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
        document.getElementById('enterpassword_seed').style.display = "none";
      }
      $('#lbl_mnemonic_exporterror').html("").css('color', 'red');
    }
    else{
      $('#lbl_mnemonic_exporterror').html("Incorrect password").css('color', 'red');
    }
  }
});

$('#span_showMnemonic').click(function(event) {
  this.select();
  document.execCommand("copy");
});

var btn_sendtoken = document.getElementById('btn_sendtoken');
btn_sendtoken.addEventListener('click', function() { 
    var to = document.getElementById('inputtotoken').value.trim();
    var amount = document.getElementById('inputamounttoken').value.trim();
    var gas = document.getElementById('tokengas').value.trim();

    if((to.length!=0) && (amount.length!=0)){
      var regexp = /^(0[xX])?[A-Fa-f0-9]+$/;  //regex to check hex value
      if((to.length == 42) && (regexp.test(to))){
          amount = parseFloat(amount);
          amount = amount*Math.pow(10, 18);
          amount = String(amount);
          var tokennonce = nonce;
          var inputhex = CheckTokendataempty(to,amount);
          to = to.replace('0x','');
          inputhex = inputhex.replace('0x','');
          var result = signTransaction(to,amount,inputhex,tokennonce,gas);
          sendTransactionBroadcast(result,to,amount);
      }
      else{
          console.log('invalid hex');
      }
    }
});

$("#inputtotoken,#inputamounttoken").on('keyup', function() {
  var to = document.getElementById('inputtotoken').value.trim();
  var amount = document.getElementById('inputamounttoken').value.trim();

  var regexp = /^(0[xX])?[A-Fa-f0-9]+$/;  //regex to check hex value
  if((to.length == 42) && (regexp.test(to)) && (amount != '')){
    CheckTokendataempty(to,amount);
    $('#btn_sendtoken').prop('disabled', false);
  }
  else{
    $('#btn_sendtoken').prop('disabled', true);
    $('#tokengas').val("");
  }
});

});
//End of pageload event

function sethistory(){

  if (!(localStorage.getItem("History") === null)) {

    document.getElementById('historylist').innerHTML = "";

    var Historyinfo = JSON.parse(localStorage.getItem("History"));

    for(var i=0; i < Historyinfo.length;i++){

      var toaddress = Historyinfo[i]["ls_to"];
      var amountbalance = Historyinfo[i]["ls_amount"];
      var txid = Historyinfo[i]["txid"];
      amountbalance = amountbalance / 1000000000000000000;
      var status = "confirmed";
  
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
}

function getTokenSymbol(tokenadress){

  var PKaddress;
  if (!(localStorage.getItem("PKaddress") === null)) {
    PKaddress = localStorage.PKaddress;
  }

  var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.response);
        console.log(this.responseText);
        if(data.ret!=""){
          var jdata = {"ret":data.ret };
        
          $.ajax({ 
            type : "POST", 
            //url : "http://192.168.51.212:5314/casigo/sDAGSymbol", 
            url : "http://"+Defaultipaddress+":"+DefaultAppPort+"/casigo/sDAGSymbol", 
            dataType: "json", 
            data: JSON.stringify(jdata), 
            contentType: 'application/json', 
            success:function(json){ 
              $('#txt_tokensymbol').val(json["symbol"]);

              if(($("#txt_tokensymbol").val().length != 0) && ($("#txt_decprecesion").val().length != 0)){
                $('#confirm_addtoken').prop('disabled', false);
              }
            }, 
            error: function() { 
            console.log("error"); 
            } 
          }); 
        }
        else{
          $('#txt_tokensymbol').val("");
        }
        
      }
    };
    //xhttp.open("POST", "http://192.168.51.212:5214/esGas",true);
    xhttp.open("POST","http://"+Defaultipaddress+":"+DefaultVMPort+"/esGas",true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
   
    var input = JSON.stringify({
      "from": PKaddress,
      "to": tokenadress,
      "balance": "0",
      "nonce": 98,
      "input":"0x95d89b41", 
      "type":"VvmDCall"
    });
    xhttp.send(input);
}

function getTokenDecimalPrecision(tokenadress){

  var PKaddress;
  if (!(localStorage.getItem("PKaddress") === null)) {
    PKaddress = localStorage.PKaddress;
  }

  var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.response);
        console.log(this.responseText);
        if(data.ret!=""){
          var hex = data.ret;
          var decimalprecision = hextodecimal(hex);
          $('#txt_decprecesion').val(decimalprecision);

          if(($("#txt_tokensymbol").val().length != 0) && ($("#txt_decprecesion").val().length != 0)){
            $('#confirm_addtoken').prop('disabled', false);
          }
        }
        else{
          $('#txt_decprecesion').val("");
        }
      }
    };
    //xhttp.open("POST", "http://192.168.51.212:5214/esGas",true);
    xhttp.open("POST","http://"+Defaultipaddress+":"+DefaultVMPort+"/esGas",true)
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
   
    var input = JSON.stringify({
      "from": PKaddress,
      "to": tokenadress,
      "balance": "0",
      "nonce": 98,
      "input":"0x313ce567", 
      "type":"VvmDCall"
    });
    xhttp.send(input);
}

function getTokenBalance(tokenadress,symbol,decimalprecision){

  var PKaddress;
  if (!(localStorage.getItem("PKaddress") === null)) {
    PKaddress = localStorage.PKaddress;
  }

  var inputstring = "0x70a08231000000000000000000000000"+PKaddress;

  var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.response);
        console.log(this.responseText);
        if(data.ret!=""){
          var hex = data.ret;
          var balance = hextodecimal(hex);
          console.log("Token Balance: "+balance);
          var token =[];
          var tokeninfo = {"TAddress":tokenadress,"Tsymbol":symbol,"Tdecimal":decimalprecision,"TBalance":balance}
          
          if (!(localStorage.getItem("Token") === null)) {
            var storeTokeninfo = JSON.parse(localStorage.getItem("Token"));
            storeTokeninfo.push(tokeninfo);
            localStorage.setItem('Token', JSON.stringify(storeTokeninfo));
          }
          else{
            token.push(tokeninfo);
            localStorage.setItem('Token', JSON.stringify(token));
          }
        }
        else{
          var token =[];
          var tokeninfo = {"TAddress":tokenadress,"Tsymbol":symbol,"Tdecimal":decimalprecision,"TBalance":0}
          
          if (!(localStorage.getItem("Token") === null)) {
            var storeTokeninfo = JSON.parse(localStorage.getItem("Token"));
            storeTokeninfo.push(tokeninfo);
            localStorage.setItem('Token', JSON.stringify(storeTokeninfo));
          }
          else{
            token.push(tokeninfo);
            localStorage.setItem('Token', JSON.stringify(token));
          }
        }
        setTokenList();
      }
    };
    //xhttp.open("POST", "http://192.168.51.212:5214/esGas",true);
    xhttp.open("POST","http://"+Defaultipaddress+":"+DefaultVMPort+"/esGas",true)
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
   
    var input = JSON.stringify({
      "from": PKaddress,
      "to": tokenadress,
      "balance": "0",
      "nonce": 98,
      "input":inputstring, 
      "type":"VvmDCall"
    });
    xhttp.send(input);
}

function setTokenList(){

  if (!(localStorage.getItem("Token") === null)) {

    document.getElementById('showtokens').innerHTML = "";

    var Tokeninfo = JSON.parse(localStorage.getItem("Token"));

    for(var i=0; i < Tokeninfo.length;i++){
      console.log("Taddress: "+Tokeninfo[i]["TAddress"]);
      var bal = Tokeninfo[i]["TBalance"] / 1000000000000000000
   
      var a = '<div class="grid-container tokenbackground settokenbackground">';
      a += '<div class="item3 showbal">';
      a += '<input type="hidden" class="inputhidden" id="'+i+'_hdn_Tokenaddress" value="'+Tokeninfo[i]["TAddress"]+'">';
      a += '<div class="token-list-item__token-symbol">'+bal+'</div>';
      a += '<div class="token-list-item__token-symbol" style="margin-left: 2px;">'+Tokeninfo[i]["Tsymbol"]+'</div>';
      a += '</div>';
      a += '<div class="item2 tokenname"><i class="fas fa-share" id="'+i+'_sendtoken" title="Send Token"></i>';
      a += '<i class="fas fa-minus-circle hideicon" id="'+i+'_hidetoken" title="Hide Token"></i>';
      a += '</div>';  
      a += '</div>';    
      $('#showtokens').prepend(a);
      $('#'+i+'_hidetoken').on('click', function(){
        var current_tokenAddr = $(this).parent().parent().find('.inputhidden').val();
        removeTokenLocalstorage(current_tokenAddr);
        $(this).parent().parent().remove();
      });
      $('#'+i+'_sendtoken').on('click', function(){
        document.getElementById("rightsidebar").style.display = "none";
        document.getElementById("addtokenform").style.display = "none";
        document.getElementById("Sendtokenform").style.display = "block";
        document.getElementById('inputtotoken').value = "";
        document.getElementById('inputamounttoken').value = "";
        document.getElementById('tokengas').value = "";
        $('#inputtotoken').focus();
      });
    }
  }   
}

function removeTokenLocalstorage(current_tokenAddr) {
  var Tokeninfo = localStorage.getItem('Token') ? JSON.parse(localStorage.getItem('Token')) : [];
  var index;
  for (var i = 0; i < Tokeninfo.length; i++) {
      if (Tokeninfo[i]["TAddress"] == current_tokenAddr) {
        index=i;
        break;
      }
  }
  if(index === undefined) return 
  Tokeninfo.splice(index, 1);
  localStorage.setItem('Token', JSON.stringify(Tokeninfo));
}

///check if user inputs all to get Gas
function CheckTokendataempty(to,amount) {

  if (( to != '') && (amount != '')) {
    var PKaddress;
    if (!(localStorage.getItem("PKaddress") === null)) {
      PKaddress = localStorage.PKaddress;
    }
    tohex = to.replace('0x','');
    var inputstring = "0xa9059cbb000000000000000000000000"+tohex;

    amount = parseFloat(amount);
    amount = amount*Math.pow(10, 18);

    var decimal = parseInt(amount);
    var hex = decimal.toString(16);

    var appendzerocount = 64 - hex.length;
    var hexamount = pad_with_zeroes(hex,appendzerocount);

    inputstring = inputstring + hexamount;
    console.log(inputstring);
    getTokenGas(to,inputstring);
    return inputstring;
  }
  else{
    $('#tokengas').val("");
  }
}

function pad_with_zeroes(number, length) {
  var my_string = '' + number;
  var i = 0;
  while (i < length) {
      my_string = '0' + my_string;
      i++;
  }
  return my_string;
}

function getTokenGas(tokenadress,inputstring){

  var PKaddress;
  if (!(localStorage.getItem("PKaddress") === null)) {
    PKaddress = localStorage.PKaddress;
  }

  var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.response);
        console.log(this.responseText);
        if(data.usingGas!=""){
          $('#tokengas').val(data.usingGas);
        }
        else{
          $('#tokengas').val("");
        }
      }
    };
    //xhttp.open("POST", "http://192.168.51.212:5214/esGas",true);
    xhttp.open("POST","http://"+Defaultipaddress+":"+DefaultVMPort+"/esGas",true)
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
   
    var input = JSON.stringify({
      "from": PKaddress,
      "to": tokenadress,
      "balance": "0",
      "nonce": 98,
      "input":inputstring, 
      "type":"VvmDCall"
    });
    xhttp.send(input);
}

function setNetworkList(){

  if (!(localStorage.getItem("CustomNetwork") === null)) {

    document.getElementById("CustomNetworkList").innerHTML = "";

    var Networkinfo = JSON.parse(localStorage.getItem("CustomNetwork"));

    for(var i=0; i < Networkinfo.length;i++){
      console.log("Networkname: "+Networkinfo[i]["ls_networkname"]);

      var ports = [Networkinfo[i]["ls_mainport"],Networkinfo[i]["ls_VMport"],Networkinfo[i]["ls_Appport"]];
      
      var a = '<li id="'+i+'_li" class="dropdown-menu-item" style="list-style: none; padding: 12px 0px; font-size: 16px; font-style: normal; cursor: pointer; display: flex; justify-content: flex-start; align-items: center; color: black; line-height: 20px;">';
      a += '<i class="fa fa-check network-check__transparent" id="facheck"></i>';
      a += '<input type="hidden" class="inputhiddenname" id="'+i+'_hdn_Networkname" value="'+Networkinfo[i]["ls_networkname"]+'">';
      a += '<input type="hidden" class="inputhiddenurl" id="'+i+'_hdn_Networkurl" value="'+Networkinfo[i]["ls_networkurl"]+'">';
      a += '<input type="hidden" class="inputhiddenport" id="'+i+'_hdn_NetworkPort" value="'+ports+'">';
      //a += '<div class="network-check__transparent">✓</div>';         
      a += '<div class="menu-icon-circle" id="menuicon">';          
      a += '<div id="menudiv" style="background: rgb(41, 182, 175); border: none; height: 12px; width: 12px;"></div>';            
      a += '</div>';     
      a += '<span class="network-name-item" style="color: rgb(155, 155, 155);">'+Networkinfo[i]["ls_networkname"]+'</span>';    
      a += '<i class="fas fa-times" id="'+i+'_hidenetwork"></i>';    
      a += '</li>'; 
    
      $('#CustomNetworkList').append(a);
      $('#'+i+'_hidenetwork').on('click', function(){
        var current_tokenAddr = $(this).parent().find('.inputhiddenname').val();
        $('#setNetworkname').html("GIB Test Network");
        removeNetworkLocalstorage(current_tokenAddr);
        $(this).parent().remove();
      });
      $('#'+i+'_li').on('click', function(){
        $('#nodepopup li').each(function(){
          $(this).find('#facheck').addClass( "network-check__transparent" );
          $(this).find('.network-name-item').css( "color", "rgb(155, 155, 155)");
          $(this ).find('#menuicon').removeClass( "menu-icon-circle--active");
          $(this ).find('#menuicon').addClass( "menu-icon-circle");
          $(this).find('#menudiv').css( "background", "rgb(41, 182, 175)");
        });
        $(this).find('#facheck').removeClass( "network-check__transparent");
        $(this).find('.network-name-item').css( "color", "black");
        $(this).find('#menudiv').css( "background", "rgb(112, 87, 255)");
        $(this).find('#menuicon').removeClass("menu-icon-circle");
        $(this).find('#menuicon').addClass("menu-icon-circle--active");
        var current_networkname = $(this).find('.inputhiddenname').val();
        $('#setNetworkname').html(current_networkname);
        localStorage.setItem('SelectedNetwork',current_networkname);
      });
    }
  }   
}

function removeNetworkLocalstorage(current_tokenAddr) {
  var Tokeninfo = localStorage.getItem('CustomNetwork') ? JSON.parse(localStorage.getItem('CustomNetwork')) : [];
  var index;
  for (var i = 0; i < Tokeninfo.length; i++) {
      if (Tokeninfo[i]["ls_networkname"] == current_tokenAddr) {
        index=i;
        break;
      }
  }
  if(index === undefined) return; 
  Tokeninfo.splice(index, 1);
  localStorage.setItem('CustomNetwork', JSON.stringify(Tokeninfo));
}

function bindDefaultNetwork(){
  var Networks =[];
  var networkinfo = {"ls_networkname":"GIB Test Network","ls_networkurl":"http://"+Defaultipaddress,"ls_mainport":DefaultMainport,"ls_VMport":DefaultVMPort,"ls_Appport":DefaultAppPort}

  if ((localStorage.getItem("DefaultNetwork") === null)) {
    Networks.push(networkinfo);
    localStorage.setItem('DefaultNetwork', JSON.stringify(Networks));
  }

  document.getElementById('NetworkLi').innerHTML = "";

  var Networkinfo = JSON.parse(localStorage.getItem("DefaultNetwork"));

  for(var i=0; i < Networkinfo.length;i++){

    var ports = [Networkinfo[i]["ls_mainport"],Networkinfo[i]["ls_VMport"],Networkinfo[i]["ls_Appport"]];
      
    var a = '<li id="'+i+'_defaultli" class="dropdown-menu-item" style="list-style: none; padding: 12px 0px; font-size: 16px; font-style: normal; cursor: pointer; display: flex; justify-content: flex-start; align-items: center; color: black; line-height: 20px;">';
    a += '<i class="fa fa-check" id="facheck"></i>'
    a += '<input type="hidden" class="inputhiddenname" id="'+i+'_hdn_DefaultNetworkname" value="'+Networkinfo[i]["ls_networkname"]+'">';
    a += '<input type="hidden" class="inputhiddenurl" id="'+i+'_hdn_DefaultNetworkurl" value="'+Networkinfo[i]["ls_networkurl"]+'">';
    a += '<input type="hidden" class="inputhiddenport" id="'+i+'_hdn_DefaultNetworkPort" value="'+ports+'">';
    a += '<div class="menu-icon-circle--active" id="menuicon">';          
    a += '<div id="menudiv" style="background: rgb(112, 87, 255); border: none; height: 12px; width: 12px;"></div>';            
    a += '</div>';     
    a += '<span class="network-name-item" style="color: rgb(155, 155, 155);">'+Networkinfo[i]["ls_networkname"]+'</span>';        
    a += '</li>'; 

    $('#NetworkLi').append(a);

    $('#'+i+'_defaultli').on('click', function(){
        $('#nodepopup li').each(function(){
          $(this).find('#facheck').addClass("network-check__transparent");
          $(this).find('.network-name-item').css("color", "rgb(155, 155, 155)");
          $(this).find('#menuicon').removeClass("menu-icon-circle--active");
          $(this).find('#menuicon').addClass("menu-icon-circle");
          $(this).find('#menudiv').css("background", "rgb(41, 182, 175)"); 
        });
        $(this).find('#facheck').removeClass("network-check__transparent");
        $(this).find('.network-name-item').css("color", "black");
        $(this).find('#menudiv').css("background", "rgb(112, 87, 255)");
        $(this).find('#menuicon').removeClass("menu-icon-circle");
        $(this).find('#menuicon').addClass("menu-icon-circle--active");
        var current_networkname = $(this).find('.inputhiddenname').val();
        $('#setNetworkname').html(current_networkname);
    });
  }
}