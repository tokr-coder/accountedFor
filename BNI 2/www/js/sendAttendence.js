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

      var sql = 'SELECT * FROM Setting';
      
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length > 6) {
                               meetingTime = result.rows.item(2).value;
                               emailSetupValue = result.rows.item(6).value;
                               groupName = result.rows.item(0).value;
                               fillSelectOptionFromDatabase();
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
                   transaction.executeSql('SELECT * FROM Members where member_email=?', [$('#sendAttendenceMember').val()],function(transaction, result) {
                               if (result != null && result.rows != null) {
                                      console.log("cantidad de registros = "+result.rows.length);
                                      
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

function successfullyConnectionMandrill(obj){
        console.log("respuesta "+JSON.stringify(obj)); 
        
        if(obj[0]['status'] == 'sent'){
           alert("Message sent successfully");
        }else{
         console.log("Mensaje no enviado reason "+obj[0]['status']);
         alert("Unsent message, please try later");
        } 
      }

      function incorrectConnectionMandrill(obj){
         console.log("mala "+JSON.stringify(obj));
         alert("Unsent message, please try later");
      }

function sendMemberAttendenceAfterFetchingFromDb (){

  var message='<div style="width:700px; padding:20px; background:#f6f6f6; border:1px solid #ccc; margin:20px auto; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:20px;">'+
                  '<table width="100%" border="0" cellpadding="10" cellspacing="0">'+
                    '<tr>'+
                      '<td width="17%">Meeting Time:</td>'+
                      '<td width="83%">'+meetingTime+'</td>'+
                    '</tr>'+
                    '<tr>'+
                      '<td>Group Name:</td>'+
                      '<td>'+groupName+'</td>'+
                    '</tr>'+
                    '<tr>'+
                      '<td colspan="2">'+
                      '<table width="100%" border="0" cellpadding="5" cellspacing="0" style="border:1px solid #ccc; border-bottom:none; border-right:none;">'+
                          '<tr>'+
                            '<td width="25%" style="border-right:1px solid #ccc;border-bottom:1px solid #ccc"><strong>Member Name</strong></td>'+
                            '<td width="28%"  style="border-right:1px solid #ccc;border-bottom:1px solid #ccc"><strong>Email</strong></td>'+
                            '<td width="22%" style="border-right:1px solid #ccc;border-bottom:1px solid #ccc"><strong>Phone Number</strong></td>'+
                            '<td width="10%" style="border-right:1px solid #ccc;border-bottom:1px solid #ccc"><strong>Balance</strong></td>'+
                            '<td width="15%" style="border-right:1px solid #ccc;border-bottom:1px solid #ccc" nowrap="nowrap"><strong>Checkin Time</strong></td>'+
                          '</tr>'+
                          '<tr>'+
                            '<td style="border-right:1px solid #ccc;border-bottom:1px solid #ccc">'+memberNameToSendArray[0]+'</td>'+
                            '<td style="border-right:1px solid #ccc;border-bottom:1px solid #ccc">'+memberEmailToSendArray[0]+'</td>'+
                            '<td style="border-right:1px solid #ccc;border-bottom:1px solid #ccc">'+memberPhoneToSendArray[0]+'</td>'+
                            '<td style="border-right:1px solid #ccc;border-bottom:1px solid #ccc">'+memberBalanceToSendArray[0]+'</td>'+
                            '<td style="border-right:1px solid #ccc;border-bottom:1px solid #ccc">'+memberCheckInTimeToSendArray[0]+'</td>'+
                          '</tr>'+
                      '</table>    </td>'+
                    '</tr>'
                    '<tr>'
                    '<td colspan="2">&nbsp;</td>'
                    '</tr>'
                '</table>'
          '</div>';

    var m = new mandrill.Mandrill('EVe75fwrZLEaW0JZkYxmTQ');
      
        var params = {
                "message": {
                    "from_email":""+emailSetupValue,
                    "to":[{"email":""+memberEmailToSend}],
                    "subject": "Attendance Report",
                    "html": message
                }
            };
      
        m.messages.send(params,successfullyConnectionMandrill,incorrectConnectionMandrill);

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
    
    

     /* $.ajax({
     type: "POST",
     url: 'http://accountedfor.biz/send/attendence.php',
     dataType: 'json',
     data: {"memberNameToSendArray":memberNameToSendArray , "memberEmailToSendArray":memberEmailToSendArray , "memberPhoneToSendArray":memberPhoneToSendArray ,"memberBalanceToSendArray":memberBalanceToSendArray ,"memberCheckInTimeToSendArray":memberCheckInTimeToSendArray, "email_to":memberEmailToSend , "meeting_date":meetingTime ,"groupName":groupName , "emailSetupValue":emailSetupValue},
     timeout: 5000,
     success: function(data, status){
             //alert(data.status);
             alert(data.groupName);
             alert(data.meetingTimeFromDB);
             alert(data.memberEmailToSend);
             alert(data.memberNameToSendArray);
             alert(data.memberEmailToSendArray);
             alert(data.memberPhoneToSendArray);
             alert(data.memberBalanceToSendArray);
             alert(data.memberCheckInTimeToSendArray);

    
             alert("Attendence Send Successfully..");
             location.reload();
     },
     error: function(){
             alert("Attendence Send Successfully..");
             location.reload();     }
     });*/
    
}



