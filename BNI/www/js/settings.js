// Put your custom code here
var paymentMethod = "";
var idTosend;
var memberBalanceToSend;
var memberEmailToSend;
var descriptionString = "";
var memberNameToSend;

var memberIdToSendArray = new Array();
var memberBalanceToSendArray = new Array();
var memberEmailToSendArray = new Array();
var memberNameToSendArray = new Array();
var descriptionToSendArray = new Array();
var paymentMethodToSendArray = new Array();




function onBodyLoadSettings(){
    
    
    //alert("daaa");
    var meetingFeeTextValue = window.localStorage.getItem("meetingFee");
    var meetingGroupTextValue = window.localStorage.getItem("groupName");
    var meetingTimeTextValue = window.localStorage.getItem("meetingTime");
    
    if(meetingFeeTextValue != null && meetingGroupTextValue != null && meetingTimeTextValue != null) {
       document.getElementById("meetingFeeEntered").value = meetingFeeTextValue ;
        document.getElementById("Groupname").value = meetingGroupTextValue;
        document.getElementById("meetingTime").value = meetingTimeTextValue;
    }else
    {
        document.getElementById("meetingFeeEntered").value = '';
        document.getElementById("Groupname").value = '';
        document.getElementById("meetingTime").value = '';

    }

}

function startNewMeetingClicked()
{
    var currentDate = new Date()
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    
    if(day < 10){
        day = "0"+day;
    }
    if(month < 10){
        month = "0"+month;
    }
    var my_date = month+"-"+day+"-"+year;
    
    var hour = currentDate.getHours();
    var minit = currentDate.getMinutes();
    var my_time;
    
    if(hour>12){
        hour = hour - 12;
    }
    if(hour<10){
        hour = "0"+hour;
    }
    
    if(minit<10) {
        my_time = hour+":0"+minit;
    }else {
        my_time = hour+":"+minit;
    }
    
    var totalDateString = my_date+" "+my_time;
    //alert(totalDateString);
    window.localStorage.setItem("meetingStartedTime", totalDateString);
    
    var checkintime = "No";
    var active = 0;
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
                   transaction.executeSql('UPDATE Members SET member_checkintime = ? ,member_active = ?', [checkintime,active],  addToLog(), errorCB);
                   },errorHandler,nullHandler);
    
}

function addToLog() {
    
    var currentDate = new Date()
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    
    if(day < 10){
        day = "0"+day;
    }
    if(month < 10){
        month = "0"+month;
    }
    var my_date = month+"-"+day+"-"+year;
    
    var hour = currentDate.getHours();
    var minit = currentDate.getMinutes();
    var my_time;
    
    if(hour>12){
        hour = hour - 12;
    }
    if(hour<10){
        hour = "0"+hour;
    }
    
    if(minit<10) {
        my_time = hour+":0"+minit;
    }else {
        my_time = hour+":"+minit;
    }
    
    var nameofStart = "-";
    var vistor = 0;
    var action = "meeting start";
    var balanceOfStart = "-";
    var payBy = "-";
    
    var memberidToLog =0;
    var changeAmount =0;
    var signOrpay = 2;

    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
                   transaction.executeSql('INSERT INTO Log(log_date, log_time,log_name,log_visitor,log_action,log_balance,log_paidBy,memberInLogId,changeAmount,signinOrPay) VALUES (?,?,?,?,?,?,?,?,?,?)',[my_date,my_time,nameofStart,vistor,action,balanceOfStart,payBy,memberidToLog,changeAmount,signOrpay],startMeetingSuccess,errorHandler);
                   });
    
    
}


function startMeetingSuccess(){
    alert("Meeting Started");
    window.location.href = "index.html";
    return false;
};

function saveClicked() {
    //alert($('#meetingFeeEntered').val());
    var mFees = $('#meetingFeeEntered').val();
    var groupName = $('#Groupname').val();
    var meetingTime = $('#meetingTime').val();
    
    if(groupName == ""){
        alert("Enter Group Name !!");
    }else if(mFees == ""){
         alert("Enter meeting fee !!");
    }else if(meetingTime == ""){
        alert("Enter meeting Time !!");
    }else {
        window.localStorage.setItem("meetingFee", mFees);
        window.localStorage.setItem("groupName", groupName);
        window.localStorage.setItem("meetingTime", meetingTime);
        alert("Saved");
        
        location.reload();
        return false;

    }
    
}


function sendReceiptsClicked(){
    
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
                   transaction.executeSql('SELECT * FROM Members', [],function(transaction, result) {
                                          if (result != null && result.rows != null) {
                                          //alert(result.rows.length);
                                          for (var i = 0; i < result.rows.length; i++) {
                                          var row = result.rows.item(i);
                                          //alert(row.member_firstname);
                                          //alert(row.member_id);
                                          
                                          memberBalanceToSend = row.member_balance;
                                          memberEmailToSend = row.member_email;
                                          var fname = row.member_firstname;
                                          var lname = row.member_lastname;
                                          var names = [fname, lname];
                                          var fullName = names.join(' ');
                                          memberNameToSend = fullName;
                                          
                                          memberIdToSendArray[i] = row.member_id;
                                          memberBalanceToSendArray[i] = memberBalanceToSend;
                                          memberEmailToSendArray[i] = memberEmailToSend;
                                          memberNameToSendArray[i] = memberNameToSend;
                                          }
                                          //alert(memberBalanceToSendArray.length);
                                          //alert(memberEmailToSendArray.length);
                                          //alert(memberNameToSendArray.length);
                                          }
                                          },errorHandler);
                   },errorHandler,sendMemberSuccess);
    
}


function sendMemberSuccess (){
    
    var meetingStartedTime = window.localStorage.getItem("meetingStartedTime");
    //alert(meetingStartedTime);
    var year=meetingStartedTime.substring(6,10);
    var date=meetingStartedTime.substring(3,5);
    var month=meetingStartedTime.substring(0,2);
    var hour=meetingStartedTime.substring(11,13);
    var minut=meetingStartedTime.substring(14,16);
    var second=0;
    month=month-1;
    
    var DObj=new Date(year,month,date, hour, minut,second);
    // alert(DObj);
    
    
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
                   transaction.executeSql('SELECT * FROM Log ORDER BY log_id DESC;', [],function(transaction, result) {
                                          if (result != null && result.rows != null) {
                                          //alert(result.rows.length);
                                          for (var j = 0; j < memberIdToSendArray.length; j++) {
                                          //alert(memberIdToSendArray[j]);
                                          for (var i = 0; i < result.rows.length; i++) {
                                          //alert("hi");
                                          var row = result.rows.item(i);
                                          
                                          var logDate = row.log_date;
                                          var logTime =row.log_time;
                                          var logName =row.log_name;
                                          var logVisitor =row.log_visitor;
                                          var logAction =row.log_action;
                                          var logbalance =row.log_balance;
                                          var logPaidBy = row.log_paidBy;
                                          var memberInLogId = row.memberInLogId;
                                          var changeAmount = row.changeAmount;
                                          var signinOrPay = row.signinOrPay;
                                          
                                          var meetingStartedTime1 = logDate +" " +logTime;
                                          var year1=meetingStartedTime1.substring(6,10);
                                          var date1=meetingStartedTime1.substring(3,5); // Jan-Dec=01-12
                                          var month1=meetingStartedTime1.substring(0,2);
                                          var hour1=meetingStartedTime1.substring(11,13);
                                          var minut1=meetingStartedTime1.substring(14,16);
                                          var second1=0;
                                          month1=month1-1; // Jan-Dec=00-11
                                          
                                          var DObj1=new Date(year1,month1,date1, hour1, minut1,second1);
                                          //alert(DObj1);
                                          
                                          
                                          //alert(row.memberInLogId);
                                          
                                          if(DObj1 > DObj){
                                          // alert("graeter");
                                          if(memberIdToSendArray[j] == row.memberInLogId){
                                          // alert("match");
                                          //alert(logVisitor);
                                          if(logVisitor == 0){
                                          paymentMethod = row.log_paidBy;
                                          if(descriptionString){
                                          descriptionString = descriptionString+","+logAction;
                                          }else{
                                          descriptionString = logAction;
                                          }
                                          }else{
                                          paymentMethod = "Cash";
                                          if(descriptionString){
                                          descriptionString = descriptionString+",Paid To "+logName+"-"+logAction;
                                          }else{
                                          descriptionString = "Paid To "+logName+"-"+logAction;
                                          }
                                          }
                                          }else{
                                          // alert("nomatch");
                                          }
                                          }else{
                                          //alert("less");
                                          }
                                          
                                          }
                                          //alert(descriptionString);
                                          //alert(paymentMethod);
                                          descriptionToSendArray[j] = descriptionString;
                                          paymentMethodToSendArray[j] = paymentMethod;
                                          descriptionString = "";
                                          paymentMethod = "";
                                          }
                                          //alert(descriptionToSendArray.length);
                                          //alert(paymentMethodToSendArray.length);
                                          }
                                          },errorHandler);
                   },errorHandler,sendMemberSuccessAfterFetchingFromDb);
    
    
}





function sendMemberSuccessAfterFetchingFromDb (){
    
    //http://127.0.0.1:8888/BNI/login.php
    //http://198.1.74.28/~spaniac1/recepit/mail.php
    
    var meetingStartedTime = window.localStorage.getItem("meetingStartedTime");
    
    
    $.ajax({
           type: "POST",
           url: 'http://127.0.0.1:8888/BNI/login.php',
           dataType: 'json',
           data: {"memberBalanceToSendArray":memberBalanceToSendArray, "memberEmailToSendArray":memberEmailToSendArray,"memberNameToSendArray":memberNameToSendArray,"paymentMethodToSendArray":paymentMethodToSendArray,"descriptionToSendArray":descriptionToSendArray,"meetingStartedTime":meetingStartedTime},
           timeout: 5000,
           success: function(data, status){
           
                //alert(data.memberBalanceToSendArray);
                //alert(data.memberEmailToSendArray);
                //alert(data.memberNameToSendArray);
                //alert(data.paymentMethodToSendArray);
                //alert(data.descriptionToSendArray);
                //alert(data.meetingStartedTime);
           
                memberBalanceToSendArray = [];
                memberEmailToSendArray = [];
                memberNameToSendArray = [];
                paymentMethodToSendArray = [];
                descriptionToSendArray = [];
           
           
                alert("Receipts Send Successfully..");
                location.reload();
           },
           error: function(){
                memberBalanceToSendArray = [];
                memberEmailToSendArray = [];
                memberNameToSendArray = [];
                paymentMethodToSendArray = [];
                descriptionToSendArray = [];
                alert("Receipts Send Successfully..");
                location.reload();     }
           });
    
}

function emailSetupClicked() {
    window.location.href = "emailSetup.html";
}

function setLogoClicked() {

    getPhoto();
}

function getPhoto() {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,destinationType:  Camera.DestinationType.FILE_URI,sourceType: Camera.PictureSourceType.PHOTOLIBRARY });
}

// Called if something bad happens.
function onFail(message) {
    alert('Failed because: ' + message);
}

function onPhotoURISuccess(imageURI) {
   //  alert(imageURI);
    
    window.localStorage.setItem("imageLocation", imageURI);
    alert("Success");
    // Get image handle
    //
    var largeImage = document.getElementById('largeImage');
    
    // Unhide image elements
    //
    largeImage.style.display = 'block';
    
    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    largeImage.src = imageURI;
}
