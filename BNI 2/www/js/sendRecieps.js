// Put your custom code here
var meetingTime;
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


var started = 0;

function onBodyLoadRemoveMember(){
    
    meetingTime = window.localStorage.getItem("meetingTime");

    fillSelectOptionFromDatabase();
}

function cancelPressedInSendReceipts() {
    var list = document.getElementById("sendRecieptsMember");
    list.value = "";
    window.location.href = "settings.html";
    return false;
}

function fillSelectOptionFromDatabase() {
    
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
                   transaction.executeSql('SELECT * FROM Members', [],function(transaction, result) {
                                if (result != null && result.rows != null) {
                                    for (var i = 0; i < result.rows.length; i++) {
                                          var row = result.rows.item(i);
                                          var fname = row.member_firstname;
                                          var lname = row.member_lastname;
                                          var names = [fname, lname];
                                          var fullName = names.join(' ');
                                          
                                          $('#sendRecieptsMember').append($("<option></option>").attr("value",row.member_id).text(fullName));
                                          
                                    }
                                }
                        },errorHandler);
            },errorHandler,nullHandler);
}

function sendReceiptsClicked(){
    var sel = document.getElementById("sendRecieptsMember");
    idTosend = sel.options[sel.selectedIndex].value;

    if(idTosend == ""){
        alert("Select a member to send Receipts");
    }else{
        
       /* var meetingStartedTime = window.localStorage.getItem("meetingStartedTime");
        //alert(meetingStartedTime);
        var year=meetingStartedTime.substring(6,10);
        var date=meetingStartedTime.substring(3,5); // Jan-Dec=01-12
        var month=meetingStartedTime.substring(0,2);
        var hour=meetingStartedTime.substring(11,13);
        var minut=meetingStartedTime.substring(14,16);
        var second=0;
        month=month-1; // Jan-Dec=00-11
        
        var DObj=new Date(year,month,date, hour, minut,second);
        //    alert(year);
        //    alert(date);
        //    alert(month);
        //    alert(hour);
        //    alert(minut);
        //alert(DObj);*/
        
        var meetingTimeFromDB = window.localStorage.getItem("meetingTime");
        var M_M=meetingTimeFromDB.substring(3,5);
        var M_H=meetingTimeFromDB.substring(0,2);
        var M_S=0;
        var DObj=new Date(M_H, M_M, M_S);

        
       if (!window.openDatabase) {
            alert('Databases are not supported in this browser.');
            return;
        }
        
        db = openDatabase(shortName, version, displayName,maxSize);
        db.transaction(function(transaction) {
                       transaction.executeSql('SELECT * FROM Log ORDER BY log_id DESC;', [],function(transaction, result) {
                                if (result != null && result.rows != null) {
                                    // alert(result.rows.length);
                                    for (var i = 0; i < result.rows.length; i++) {
                                        var row = result.rows.item(i);
                                              
                                        var logDate = row.log_date;
                                        var logTime =row.log_time;
                                        var logName =row.log_name;
                                        var logVisitor =row.log_visitor;
                                        var logAction =row.log_action;
                                              
                                              //alert(logAction);
                                              if(logAction == "meeting start"){
                                                  //alert("in");
                                                  started = 1;
                                              }
                                            
                                        var logbalance =row.log_balance;
                                        var logPaidBy = row.log_paidBy;
                                        var memberInLogId = row.memberInLogId;
                                        var changeAmount = row.changeAmount;
                                        var signinOrPay = row.signinOrPay;
                                              
                                        //alert("befor");
                                        if(started == 0){
                                              //alert("in");

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
                                              
                                              if(DObj1 > DObj){
                                                     //alert("graeter");
                                                    if(idTosend == row.memberInLogId){
                                                         //alert("match");
                                                        //alert(logVisitor);

                                              
                                                        if(logVisitor == 0){
                                                             paymentMethod = row.log_paidBy;
                                                             //alert(paymentMethod);
                                                            //alert(logAction.substring(0, 4));
                                                            if (logAction.substring(0, 4) == "Paid") {
                                                                if(descriptionString){
                                                                    descriptionString = descriptionString+","+logAction;
                                                                }else{
                                                                    descriptionString = logAction;
                                                                }
                                                            }
                                              
                                                        }else{
                                                             paymentMethod = "Cash";
                                                            if(descriptionString){
                                                                descriptionString = descriptionString+",Paid To "+logName+"-"+logAction;
                                                            }else{
                                                                descriptionString = "Paid To "+logName+"-"+logAction;
                                                            }
                                                        }
                                              
                                                   //alert(paymentMethod);
                                                   //alert(descriptionString);

                                                    }
                                              }else{
                                                   //alert("less");
                                              }
                                              
                                           }

                                        }
                                }
                        },errorHandler);
                },errorHandler,sendMemberSuccess);
    
     }
}

function sendMemberSuccess (){
    //alert("sendMemberSuccess");
    
    
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
                   transaction.executeSql('SELECT * FROM Members where member_id = ?', [idTosend],function(transaction, result) {
                               if (result != null && result.rows != null) {
                                      for (var i = 0; i < result.rows.length; i++) {
                                          var row = result.rows.item(i);
                            
                                          memberBalanceToSend = row.member_balance;
                                          memberEmailToSend = row.member_email;
                                          
                                          var fname = row.member_firstname;
                                          var lname = row.member_lastname;
                                          var names = [fname, lname];
                                          var fullName = names.join(' ');
                                          memberNameToSend = fullName;
                                        }
                                  }
                    },errorHandler);
    },errorHandler,sendMemberSuccessAfterFetchingFromDb);
    
}

function sendMemberSuccessAfterFetchingFromDb (){
    var meetingStartedTimeForReceipts = window.localStorage.getItem("meetingStartedTimeForReceipts");
    var groupName=  window.localStorage.getItem("groupName");
    var meetingTimeFromDB = window.localStorage.getItem("meetingTime");

    var emailSetupValue = window.localStorage.getItem("emailSetupValue");
    if(emailSetupValue == null) {
        emailSetupValue = "bni@bni.com";
    }
    
   // alert("sendMemberSuccessAfterFetchingFromDb");
//       alert(paymentMethod);
//       alert(meetingStartedTimeForReceipts);
//       alert(memberEmailToSend);
//       alert(memberBalanceToSend);
//       alert(descriptionString);
//    alert(groupName);
//    alert(memberNameToSend);
//    alert(emailSetupValue);

   //http://127.0.0.1:8888/BNI/login.php
    //http://198.1.74.28/~spaniac1/bni/mail.php
    
    

      $.ajax({
     type: "POST",
     url: 'http://198.1.74.28/~spaniac1/bni/mail.php',
     dataType: 'json',
     data: {"payment_method":paymentMethod , "products":descriptionString , "balance":memberBalanceToSend , "email_to":memberEmailToSend , "meeting_date":meetingStartedTimeForReceipts , "sold_to":memberNameToSend , "groupName":groupName , "emailSetupValue":emailSetupValue},
     timeout: 5000,
     success: function(data, status){
             alert(data.status);
    
             descriptionString = "";
             alert("Receipts Sent Successfully..");
             location.reload();
     },
     error: function(){
             descriptionString = "";
             alert("Receipts Sent Successfully..");
             location.reload();     }
     });
    
}



/**************************************************** Send To All ***************************************************************/

function sendReceiptsToAllClicked(){
    
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
        },errorHandler,sendMemberSuccessToAll);
    
}


function sendMemberSuccessToAll (){
    
   /* var meetingStartedTime = window.localStorage.getItem("meetingStartedTime");
    //alert(meetingStartedTime);
    var year=meetingStartedTime.substring(6,10);
    var date=meetingStartedTime.substring(3,5);
    var month=meetingStartedTime.substring(0,2);
    var hour=meetingStartedTime.substring(11,13);
    var minut=meetingStartedTime.substring(14,16);
    var second=0;
    month=month-1;
    
    var DObj=new Date(year,month,date, hour, minut,second);
    // alert(DObj);*/
    
    var meetingTimeFromDB = window.localStorage.getItem("meetingTime");
    var M_M=meetingTimeFromDB.substring(3,5);
    var M_H=meetingTimeFromDB.substring(0,2);
    var M_S=0;
    var DObj=new Date(M_H, M_M, M_S);
    
    
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
                                          started = 0;
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
                                          
                                          if(logAction == "meeting start"){
                                             //alert("in");
                                             started = 1;
                                          }

                                    if(started == 0)
                                    {
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
                                                 if (logAction.substring(0, 4) == "Paid") {

                                                    if(descriptionString){
                                                        descriptionString = descriptionString+","+logAction;
                                                    }else{
                                                        descriptionString = logAction;
                                                    }
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
        },errorHandler,sendMemberSuccessAfterFetchingFromDbToAll);
    
    
}





function sendMemberSuccessAfterFetchingFromDbToAll (){
    
    //http://127.0.0.1:8888/BNI/login.php
    //http://198.1.74.28/~spaniac1/bni/mail.php
    
    var meetingStartedTimeForReceipts = window.localStorage.getItem("meetingStartedTimeForReceipts");
    var groupName=  window.localStorage.getItem("groupName");
    var meetingTimeFromDB = window.localStorage.getItem("meetingTime");
    var emailSetupValue = window.localStorage.getItem("emailSetupValue");
    if(emailSetupValue == null) {
        emailSetupValue = "bni@bni.com";
    }
    
    
    $.ajax({
           type: "POST",
           url: 'http://198.1.74.28/~spaniac1/bni/mail1.php',
           dataType: 'json',
           data: {"memberBalanceToSendArray":memberBalanceToSendArray, "memberEmailToSendArray":memberEmailToSendArray,"memberNameToSendArray":memberNameToSendArray,"paymentMethodToSendArray":paymentMethodToSendArray,"descriptionToSendArray":descriptionToSendArray,"meetingStartedTime":meetingStartedTimeForReceipts , "groupName":groupName , "emailSetupValue":emailSetupValue},
           timeout: 7000,
           success: function(data, status){
           
               /*alert(data.status);
                 alert(data.memberBalanceToSendArray);
                 alert(data.memberEmailToSendArray);
                 alert(data.memberNameToSendArray);
                 alert(data.paymentMethodToSendArray);
                 alert(data.descriptionToSendArray);
                 alert(data.meetingStartedTime);
                 alert(data.totalcountarray);*/
           
                memberBalanceToSendArray = [];
                memberEmailToSendArray = [];
                memberNameToSendArray = [];
                paymentMethodToSendArray = [];
                descriptionToSendArray = [];
           
           
                alert("Receipts Sent Successfully..");
                location.reload();
            },
           error: function(){
                memberBalanceToSendArray = [];
                memberEmailToSendArray = [];
                memberNameToSendArray = [];
                paymentMethodToSendArray = [];
                descriptionToSendArray = [];
                alert("Receipts Sent Successfully..");
                location.reload();     }
           });
    
}





