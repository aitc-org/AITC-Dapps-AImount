const crypto = require('crypto');
const sdag = require('sdagsign');

var nonce,balance;
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



function signTransaction(to,amount,inputhex){
    nonce = getNonce();
    console.log(nonce);
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
    sendTransactionBroadcast(result);
}

function sendTransactionBroadcast(result){ 
    var doAjax = function() { 
    $.ajax({ 
    type : "POST", 
    url : "http://192.168.51.212:9999/broadcast",	
    data: JSON.stringify(result), 
    contentType: 'text/plain; charset=UTF-8', 
    success:function(json){ 
      console.log(json);
    }, 
    error: function() { 
    alert("Error"); 
    } 
    }); 
    } 
    doAjax(); 
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

function getNonce() {
    var request = new XMLHttpRequest();
    request.open('GET', 'http://192.168.51.212:9999/getAccount?address=23471aa344372e9c798996aaf7a6159c1d8e3eac', false);
    request.onload = function () {
      var data = JSON.parse(this.response);
      if (request.status >= 200 && request.status < 400) {
        nonce = data.Nonce;
        balance = data.Balance;
      } else {
        console.log('error');
      }
    }
    // Send request
    request.send(null);
    return nonce;
}


window.addEventListener('load', function load(event){
    var createButton = document.getElementById('send');
    createButton.addEventListener('click', function() { 
       var to = document.getElementById('inputto').value;
       var amount = document.getElementById('inputamount').value;
       var inputhex = document.getElementById('inputhex').value;
       signTransaction(to,amount,inputhex);
    });
});


  