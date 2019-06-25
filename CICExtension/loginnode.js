var aesjs = require('aes-js');
const bip39 = require("bip39");
var HDKey = require('hdkey');
var bip32 = require("bip32");
var bitcoin = require('bitcore-lib');
var EthereumBip44 = require('ethereum-bip44');
const secp256k1 = require('secp256k1')
var sha256 = require("sha256")

window.addEventListener('load', function load(event){

  var mnemonic = ""; 
  var PrivateKey="";   

  var btnfromlogin = document.getElementById('btnsavePK');
  btnfromlogin.addEventListener('click', function() { 
        var PK = $('#inputPK').val().trim();
        var encryptedPK = Encrypt(PK);
        localStorage.PK = encryptedPK;

        chrome.browserAction.setPopup({
        popup:"popup.html"
        });
        window.location.href = 'popup.html';
  });

  var btncreatewallet = document.getElementById('btn_createwallet');
  btncreatewallet.addEventListener('click', function() {
    document.getElementById('ulseed').innerHTML = "";
    var myList = ""; var listItem = ""; var listItemspan = ""; var listValue="";
    mnemonic = bip39.generateMnemonic()
    console.log(mnemonic);
    var split_mnemonic = mnemonic.split(" ");
    console.log(split_mnemonic);

    var listLength = split_mnemonic.length;

    myList = document.createElement("ul");
    myList.className="seedgrid";
    for(var i=0;i<listLength;i++){
      listItem = document.createElement("li");
      listItemspan = document.createElement("span");
      
      listValue = document.createTextNode(i+1 +'. ');
      listItemspan.innerHTML = split_mnemonic[i];
      listItem.appendChild(listValue);
      listItem.appendChild(listItemspan); 
      myList.appendChild(listItem);
    }
    document.getElementById('ulseed').append(myList);
  });

  var btnconfirmcreatewallet = document.getElementById('btn_confirmcreate');
  btnconfirmcreatewallet.addEventListener('click', function() {
    var seedphrase = mnemonic.trim();
    //var password = $('#newpassword').val().trim();

    var seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
    console.log('Seed'+seed);

    var hdkey = HDKey.fromMasterSeed(seed);
    var HDkey = hdkey.privateExtendedKey
    var node = bip32.fromBase58(HDkey)
    var child = node.derivePath("m/44'/0'/0'/0/0");
    bitcoinKey = child.toWIF();
    var key = bitcoin.HDPrivateKey(HDkey);
    var wallet = new EthereumBip44(key);
    var ethereumKey = wallet.getPrivateKey(0).toString('hex');
    console.log('PK:'+ethereumKey);  //Private key

    var publicAddress = "04" + secp256k1.publicKeyCreate(Buffer.from(ethereumKey,"hex"), false).slice(1).toString('hex');
    var cicAddress = "cx"+sha256("0x"+publicAddress.toString("hex")).substr(24,64);
    console.log('publicAddress '+publicAddress);
    console.log('cicAddress '+cicAddress);

    //var encryptseed = Encrypt(seedphrase);
    //console.log(encryptseed);
    //localStorage.setItem("encryptedseed",encryptseed);

    document.getElementById('CreateWallet').style.display = "none";
    document.getElementById('importwalletoptions').style.display = "block";
  });

  var btnconfirmimportwallet = document.getElementById('btn_confirmimportwallet');
  btnconfirmimportwallet.addEventListener('click', function() {

    var mnemonic = $('#txt_seedphrase').val().trim();
    var derivepath = $('#txt_importwalletderivepath').val().trim();
    var isvalid = bip39.validateMnemonic(mnemonic);

    if((isvalid == true) && (derivepath != "")){
      var encryptseed = Encrypt(mnemonic);
      console.log(encryptseed);
    
      localStorage.setItem("encryptedseedimport",encryptseed);
    
      //var cicAddress = $('#span_showaddress').text().trim();
      //localStorage.setItem('PKaddress', cicAddress);
      var encryptPrivatekey = Encrypt(PrivateKey);
      localStorage.setItem('PK',encryptPrivatekey);

      document.getElementById('enterMnemonicform').style.display = "none";
    
      chrome.browserAction.setPopup({
        popup:"popup.html"
        });
        window.location.href = 'popup.html';
    }
    
  });

  var btncancelimportwallet = document.getElementById('btn_cancelimportwallet');
  btncancelimportwallet.addEventListener('click', function() {
    $('#txt_seedphrase').val("");
    $('#txt_importwalletderivepath').val("m/44'/0'/0'/0/0");
    $('#span_showaddress').text("");
    $('#btn_confirmimportwallet').prop('disabled', true);
  });

  $("#txt_seedphrase, #txt_importwalletderivepath").on('keyup', function() {
    var mnemonic = $('#txt_seedphrase').val().trim();
    var derivepath = $('#txt_importwalletderivepath').val().trim();
    var isvalid = bip39.validateMnemonic(mnemonic);

    if((isvalid == true) && (derivepath != "")){
      try{
        var seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
        console.log('Seed:'+seed);

        
       var hdkey = HDKey.fromMasterSeed(new Buffer(seed, 'hex'))
       var HDkey = hdkey.privateExtendedKey
       var node = bip32.fromBase58(HDkey)
       var child = node.derivePath(derivepath)
       bitcoinKey = child.toWIF()
       var key = bitcoin.HDPrivateKey(HDkey);
       var wallet = new EthereumBip44(key);
       //ethereum
       var ethereumKey = wallet.getPrivateKey(0).toString('hex')
       console.log('PK:'+ethereumKey); //Private key
       PrivateKey = ethereumKey;

       var publicAddress = secp256k1.publicKeyCreate(Buffer.from(ethereumKey,"hex"), false).slice(1)
       var cicAddress = sha256(publicAddress.toString("hex")).substr(24, 64)
      
        $('#span_showaddress').text(cicAddress);
        $('#btn_confirmimportwallet').prop('disabled', false);
      }
      catch(err) {
        $('#span_showaddress').text("");
        $('#btn_confirmimportwallet').prop('disabled', true);
      }
    }
    else{
      $('#span_showaddress').text("");
      $('#btn_confirmimportwallet').prop('disabled', true);
    }
  });

});

function Encrypt(strdata){

  var arr;

  var password;
  if (!(localStorage.getItem("password") === null)) {
    password = localStorage.password;
  }

  //var password = $('#newpassword').val().trim();
  var passwordtohex = toHex(password);
  var hextodec = hextodecimal(passwordtohex);
  console.log('password to hex: '+password);
  console.log('hex to int '+ hextodec);
  var subStr = hextodec.toString().substr(0, 16);
  console.log(subStr);
  arr = subStr.toString(10).split('').map(Number);
  for(i=0;i<arr.length;i++){
    arr[i] = +arr[i]|0 ;
  } 

    //var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
    var key = arr;
    //localStorage.setItem("quentinTarantino", JSON.stringify(key));
  
    // Convert text to bytes
    var text = strdata;
    var textBytes = aesjs.utils.utf8.toBytes(text);
    
    // The counter is optional, and if omitted will begin at 1
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var encryptedBytes = aesCtr.encrypt(textBytes);
    
    // To print or store the binary data, you may convert it to hex
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    console.log(encryptedHex);
    return encryptedHex;
  }
  
  function DecryptPrivateKey(encryptedHex){
    var key;
    var password;
    /*
    if (!(localStorage.getItem("quentinTarantino") === null)) {
      var retrievedData = localStorage.getItem("quentinTarantino");
      key = JSON.parse(retrievedData);
    }*/

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
