// Put your custom code here
var memberEmailToSend;
var memberNameToSendArray = new Array();
var memberEmailToSendArray = new Array();
var memberPhoneToSendArray = new Array();
var memberBalanceToSendArray = new Array();
var memberCheckInTimeToSendArray = new Array();
var meetingTime, emailSetupValue, groupName;


function onBodyLoadSendAttendence(){

    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {  

      var sql = 'SELECT * FROM Settings';
      
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length > 0) {
                        for (var i = 0; i < result.rows.length; i++) {
                               var row = result.rows.item(i);
                               meetingTime = row.meetingTime;
                               emailSetupValue = row.email;
                               groupName = row.nameGroup;
                               fillSelectOptionFromDatabase();
                        }
                    }
                },errorHandler);
            },errorHandler,nullHandler);

    //meetingTime = window.localStorage.getItem("meetingTime");
    //fillSelectOptionFromDatabase();
}

function cancelPressedInAttendence() {
    var list = document.getElementById("sendAttendenceMember");
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
                                          
                                          $('#sendAttendenceMember').append($("<option></option>").attr("value",row.member_email).text(fullName));
                                          
                                    }
                                }
                        },errorHandler);
            },errorHandler,nullHandler);
}

function sendAttendenceClicked(){

    var sel = document.getElementById("sendAttendenceMember");
    memberEmailToSend = sel.options[sel.selectedIndex].value;

    if(memberEmailToSend == ""){
        alert("Select a member to sent Attendence");
    }else{
        getDetailsFromDb();
    }
}

function getDetailsFromDb (){
    //alert("getDetailsFromDb");

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
                                          
                                          memberNameToSendArray[i] = fullName;
                                          memberEmailToSendArray[i] = row.member_email;
                                          
                                          if(row.member_phonenumber == "NO"){
                                            memberPhoneToSendArray[i] = "-";
                                          }else{
                                            memberPhoneToSendArray[i] = row.member_phonenumber;
                                          }
                                          
                                          memberBalanceToSendArray[i] = row.member_balance;
                                          
                                          if(row.member_checkintime == "No"){
                                            memberCheckInTimeToSendArray[i] = "-";
                                          }else{
                                            memberCheckInTimeToSendArray[i] = row.member_checkintime;
                                          }
                                        }
                                  }
                    },errorHandler);
    },errorHandler,sendMemberAttendenceAfterFetchingFromDb);
    
}

function sendMemberAttendenceAfterFetchingFromDb (){
    //var groupName=  window.localStorage.getItem("groupName");
    //var meetingTimeFromDB = window.localStorage.getItem("meetingTime");

    //var emailSetupValue = window.localStorage.getItem("emailSetupValue");
    //if(emailSetupValue == null) {
    //    emailSetupValue = "bni@bni.com";
    //}
    
    /*alert("sendMemberSuccessAfterFetchingFromDb");
    alert(memberEmailToSend);
    alert(memberNameToSendArray);
    alert(memberEmailToSendArray);
    alert(memberPhoneToSendArray);
    alert(memberBalanceToSendArray);
    alert(memberCheckInTimeToSendArray);
    alert(meetingTimeFromDB);
    alert(groupName);
    alert(emailSetupValue);*/

   //http://127.0.0.1:8888/BNI/attendence.php
    //http://198.1.74.28/~spaniac1/bni/attendence.php
    
    

      $.ajax({
     type: "POST",
     url: 'http://accountedfor.biz/send/attendence.php',
     dataType: 'json',
     data: {"memberNameToSendArray":memberNameToSendArray , "memberEmailToSendArray":memberEmailToSendArray , "memberPhoneToSendArray":memberPhoneToSendArray ,"memberBalanceToSendArray":memberBalanceToSendArray ,"memberCheckInTimeToSendArray":memberCheckInTimeToSendArray, "email_to":memberEmailToSend , "meeting_date":meetingTime ,"groupName":groupName , "emailSetupValue":emailSetupValue},
     timeout: 5000,
     success: function(data, status){
             //alert(data.status);
             /*alert(data.groupName);
             alert(data.meetingTimeFromDB);
             alert(data.memberEmailToSend);
             alert(data.memberNameToSendArray);
             alert(data.memberEmailToSendArray);
             alert(data.memberPhoneToSendArray);
             alert(data.memberBalanceToSendArray);
             alert(data.memberCheckInTimeToSendArray);*/

    
             alert("Attendence Send Successfully..");
             location.reload();
     },
     error: function(){
             alert("Attendence Send Successfully..");
             location.reload();     }
     });
    
}



