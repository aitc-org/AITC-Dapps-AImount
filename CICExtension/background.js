
chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
    console.log(request);
    localStorage.sharedData = request;
    localStorage.openwindow = 1;
    window.open("popup.html", "CIC Notification", "width=357,height=600,status=no,scrollbars=yes,resizable=no");
});