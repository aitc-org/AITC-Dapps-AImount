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
   
  }
 });

 
function getBalanceandNonce() {
    var nonce,bal;
    var request = new XMLHttpRequest();
    request.open('GET', 'http://192.168.51.212:9999/getAccount?address=23471aa344372e9c798996aaf7a6159c1d8e3eac', false);
    request.onload = function () {
      var data = JSON.parse(this.response);
      if (request.status >= 200 && request.status < 400) {
        bal = data.Balance;
        var etherprice = bal / 1000000000000000000;
        document.getElementById("accbal").innerHTML = etherprice;
        nonce = data.Nonce;
      
      } else {
        console.log('error');
      }
    }
    request.send(null);
    return nonce;
}


function signTransaction(){
    var jdata = {
        "fee":"100000000000000000", 
        "address":"b6bc21a512ea1043827e5b0af50f1d3c276be502", 
        "balance": "2000000000000000000", 
        "nonce":0, 
        "type":"bnn", 
        "input":"0xjhwegwrjerwjgrejrg", 
        "PrivateKey":"eee21c84089ca7515d476a389f537d86edc80eb2c7b9d60c0c77d16ff40d2c87", 
        "crypto":"cic" 
        }
        $.ajax({
          url: "http://3.112.106.186:9997/signTransaction",
          type: "POST",
          dataType: "json",
          ContentType: "text/plain; charset=UTF-8",
          data: JSON.stringify(jdata),
          success: function (response) {
            console.log(response.result);
            sendBroadcast(response.result);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status);
            console.log(textStatus);
            console.log(errorThrown);
          }
      
        });
}
  
function sendBroadcast(){ 
    var jdata = { 
    "blockHash": "", 
    "tx": "f242d0b59d204cf46cdbecbd04edc0a95ac2c4bbf56621058072a6d282aea789", 
    "version": "", 
    "from": "", 
    "to": "891e52e88160903d9903d6e2883f4ab5ce00c52b", 
    "balance": "2000000000000000000", 
    "out": null, 
    "nonce": 2, 
    "fee": "100000000000000000", 
    "type": "a64", 
    "input": "", 
    "sign": "3733393837363134313533383438363638373432393230353730363739303530393438333234393830333134363939343638363639303234303132393630393531313330393732363734383733783134333133363439383339383337323437343431383931353434303835343133343734353234343036363134353539333835393631353037373731353932353639343235363839353336313830", 
    "crypto": "cic", 
    "publicKey": "04f6ff90a3717e09059272498b036390003782a2eb35085dcae8c471dd91472e21df38a4e43a7398698297d4b0e77a50abc7975b0d3984cdabef96c323d2cfbadf", 
    "protocol": null, 
    "timeLock": { 
    "type": "", 
    "amount": "", 
    "time": "1970-01-01T00:00:00Z", 
    "endTime": "1970-01-01T00:00:00Z", 
    "unlockAmount": "", 
    "intervalTime": 0 
    }, 
    "timestamp": 0 
    } 
    var doAjax = function() { 
    $.ajax({ 
    type : "POST", 
    url : "http://3.112.106.186:9997/broadcast",	
    data: JSON.stringify(jdata), 
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



  