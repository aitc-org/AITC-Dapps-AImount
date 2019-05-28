const crypto = require('crypto');
const sdag = require('sdagsign');

var nonce;
var settransactionlocal;
var a = "";
var ShowBalance;
//Create account
const pri = '9cecb7cdec34ba8d27039781fd4d5e0bd0b9aa233c49aa75588bf7d2ba71536a';
let account = new sdag.Accounts.NewAccount(pri)
//console.log('Private Key: '+account.GeneratePrivateKey("1123"));
console.log('Address: '+account.Address);
console.log('Public Key:'+account.PublicKey);

if (typeof(Storage) !== "undefined") {
    //localStorage.privatekey = account.GeneratePrivateKey("1123");
    localStorage.address = account.Address;
    localStorage.publickey = account.PublicKey;
} else {
    console.log('Sorry! No Web Storage support..');
}

function signTransaction(to,amount,inputhex,nonce){
    //nonce = getNonce();
    //console.log(nonce);
    if(nonce!== undefined){
      //Create transaction tx.
      tx = {
      To : to,
      PrivateKey : pri,
      Balance : amount,
      Nonce : String(nonce),
      Gas : "1",
      Type : "a64",
      Input : inputhex
    }  
    let transaction = new sdag.Signs.NewTransaction(pri,tx)
    //Sign Transaction using GetSignRawHexFull() and use output result for broadcast.
    var signtrans = transaction.GetSignRawHexFull();
    var result = signtrans.result;
    console.log(result);
    localStorage.ls_to = to;
    localStorage.ls_amount = amount;
    return result;
    }
}

function sendTransactionBroadcast(result,amount){ 
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
      sethistory();
      document.getElementById("sendtrform").style.display = "none";

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
    //return nonce;
}

function getBalance() {

    $.ajax({ 
      type : "GET", 
      async: true,
      url : "http://192.168.51.212:9999/getAccount?address=23471aa344372e9c798996aaf7a6159c1d8e3eac",   
      contentType: 'text/plain; charset=UTF-8', 
      success:function(data){ 
        console.log(data);
        var data1 = JSON.parse(data);
        ShowBalance = data1.Balance;
        console.log(ShowBalance);
        
        ShowBalance = parseFloat(ShowBalance);
        var etherprice = ShowBalance / 1000000000000000000;
        document.getElementById("accbal").innerHTML = String(etherprice);
        console.log(etherprice);
        sethistory();
      }, 
      error: function() { 
      alert("Error"); 
      } 
      }); 
}


window.addEventListener('load', function load(event){
    getBalance();
    
    var createButton = document.getElementById('send');
    createButton.addEventListener('click', function() { 
       var to = document.getElementById('inputto').value;
       var amount = document.getElementById('inputamount').value;
       var inputhex = document.getElementById('inputhex').value;
       amount = parseFloat(amount);
       amount = amount*Math.pow(10, 18);
       amount = String(amount);
       getNonce(to,amount,inputhex);
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
        
        $('#historylist').append(a);
    }
}




  