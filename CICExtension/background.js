
chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
    console.log(request);
    localStorage.sharedData = request;
    localStorage.openwindow = 1;

    var myAddonId = chrome.runtime.getManifest().key;
    
    if (!(localStorage.getItem("PK") === null)) {
        window.open("popup.html", "CIC Notification", "width=357,height=600,status=no,scrollbars=yes,resizable=no");
    }
    else{
        window.open("setpassword.html", "CIC Notification", "width=357,height=600,status=no,scrollbars=yes,resizable=no");
    }
});

