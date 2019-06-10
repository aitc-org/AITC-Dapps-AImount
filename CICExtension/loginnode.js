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

    var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
  
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