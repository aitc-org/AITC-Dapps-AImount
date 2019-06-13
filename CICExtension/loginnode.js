var aesjs = require('aes-js');


window.addEventListener('load', function load(event){
    var btnfromlogin = document.getElementById('btnsavePK');
    btnfromlogin.addEventListener('click', function() { 
        var PK = $('#inputPK').val().trim();
        var encryptedPK = EncryptPrivateKey(PK);
        localStorage.PK = encryptedPK;

        chrome.browserAction.setPopup({
        popup:"popup.html"
        });
        window.location.href = 'popup.html';
  });
});

function EncryptPrivateKey(PrivateKey){

  var arr;

  if (!(localStorage.getItem("password") === null)) {
    var password = localStorage.password;
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
  }

    //var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
    var key = arr;
    localStorage.setItem("quentinTarantino", JSON.stringify(key));
  
    // Convert text to bytes
    var text = PrivateKey;
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
    var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
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
