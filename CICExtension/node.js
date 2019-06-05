const crypto = require('crypto');
const sdag = require('sdagraph');

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
      pk = localStorage.PK;
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


 
function EncryptKeys(){

    const key2 = crypto.randomBytes(32);
    console.log(key2.length);
    //const iv = crypto.randomBytes(16);

    const algorithm = 'aes-256-cbc';
    const key = Buffer.from('99b580475dcadbdbf24d1cadd042def3');
    //const key = crypto.scryptSync(localStorage.privatekey, 'salt', 24);
    const iv = Buffer.alloc(16, 0); // Initialization vector.
    console.log(iv);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    let encrypted = cipher.update(localStorage.privatekey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log(encrypted);
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
          document.getElementById("accbal").innerHTML = "0";
        }
        
        sethistory();
      }, 
      error: function() { 
      alert("Error"); 
      } 
  }); 
}


window.addEventListener('load', function load(event){

  if (!(localStorage.getItem("PK") === null)) {
    pri = localStorage.PK;
    let account = new sdag.Accounts.NewAccount(pri);
    console.log("PK Address:"+account.Address);
    localStorage.PKaddress = account.Address;
  }
  
  getBalance();
    
  var createButton = document.getElementById('send');
  createButton.addEventListener('click', function() { 
       var to = document.getElementById('inputto').value.trim();
       var amount = document.getElementById('inputamount').value.trim();
       var inputhex = document.getElementById('inputhex').value.trim();

       if((to.length!=0) && (amount.length!=0) && (inputhex.length!=0)){
        var regexp = /^[0-9a-fA-F]+$/;  //regex to check hex value
        if((regexp.test(to)) && (regexp.test(inputhex))){
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
      popup:"login.html"
    });
    window.location.href = 'login.html';
  });

  $('#inputamount').keypress(function(event) {
    if (((event.which != 46 || (event.which == 46 && $(this).val() == '')) ||
            $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
  }).on('paste', function(event) {
    event.preventDefault();
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






  