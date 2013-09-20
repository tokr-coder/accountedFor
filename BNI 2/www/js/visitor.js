// Put your custom code here
var payByMemberBalance;

$(document).ready(function() {
                  $('input[type="submit"]').attr('disabled','disabled');
                   document.getElementById("paymentByMember").disabled=true;
                  $('input[type="text"]').keyup(function() {
                                                if($('#visitorFirstName').val() != '' && $('#visitorEmail').val() !='' && $('#visitorPhoneNumber').val() !=''){
                                                $('input[type="submit"]').removeAttr('disabled');
                                                }
                                                });
                  $('input[type="text"]').keyup(function() {
                                                if($('#visitorFirstName').val() != '' && $('#visitorEmail').val() !='' && $('#visitorPhoneNumber').val() !=''){
                                                $('input[type="submit"]').removeAttr('disabled');
                                                }
                                                });
                  $('input[type="number"]').keyup(function() {
                                                if($('#visitorFirstName').val() != '' && $('#visitorEmail').val() !='' && $('#visitorPhoneNumber').val() !=''){
                                                $('input[type="submit"]').removeAttr('disabled');
                                                }
                                                });
                  });


function onBodyLoadVisitor(){
    
    meetingFee = window.localStorage.getItem("meetingFee");
    
    if(meetingFee == null) {
        alert("Enter meeting details in settings page !!");
    }else
    {
        var meetingFeeInDoller = "$"+meetingFee;
        document.getElementById("MeetingFeeFromDb").innerHTML=document.getElementById("MeetingFeeFromDb").innerHTML+meetingFeeInDoller;
        fillPayByMemberFromDatabase();
    }
    
    var visitorAllow = window.localStorage.getItem("visitorAllow");
    if(visitorAllow == "1"){
        document.getElementById('radio_paidBy').disabled = false;
    }else{
        document.getElementById('radio_paidBy').disabled = true;
    }

}

function ClearPressed() {

//    if(document.getElementById('radio_cash').checked) {
//        alert("cash");
//    }else if(document.getElementById('radio_cheque').checked) {
//        alert("cheque");
//    }
    document.getElementById("visitorFirstName").value = '';
    document.getElementById("visitorEmail").value = '';
    document.getElementById("visitorPhoneNumber").value = '';
    
    var list = document.getElementById("paymentByMember");
    list.value = "";
}


function fillPayByMemberFromDatabase() {
    
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
                                          
                                          $('#paymentByMember').append($("<option></option>").attr("value",row.member_id).text(fullName));
                                          
                                          }
                                          }
                                          },errorHandler);
                   },errorHandler,nullHandler);
}

function payPressed(){
    if($('#visitorFirstName').val()==""){
        alert("Enter First Name");
    }else if($('#visitorEmail').val()=="") {
        alert("Enter Email");
    }else if($('#visitorPhoneNumber').val()=="") {
        alert("Enter Phone Number");
    }else{
        var list = document.getElementById("paymentByMember");
        var paybymemberId = list.value;
        
        if(paybymemberId == "" && !(document.getElementById('radio_cash').checked)&& !(document.getElementById('radio_cheque').checked)){
            alert("Select a Payment Method");
        }else{
            
        
          if(paybymemberId == "") {
            
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
              
              if(hour>12){
                  hour = hour - 12;
              }
              if(hour<10){
                  hour = "0"+hour;
              }
              
              var my_time;
              
              if(minit<10) {
                  my_time = hour+":0"+minit;
              }else {
                  my_time = hour+":"+minit;
              }
            
            var name = $('#visitorFirstName').val();
            
            var vistor = 1;
            
            var action = "$"+meetingFee;
            
            var balanceForVisitor = 0;
            
            var payBy;
            if(document.getElementById('radio_cash').checked) {
                payBy = "Cash";
            }else if(document.getElementById('radio_cheque').checked) {
                payBy = "Cheque"
            }else {
                payBy = "Cash";
            }
            
            
            var memberidToLog =0;
            var changeAmount =0;
            var signOrpay = 3;
             /*alert(my_date);
             alert(my_time);
             alert(name);
             alert(vistor);
             alert(action);
             alert(balanceForVisitor);
             alert(payBy);*/
            
            if (!window.openDatabase) {
                alert('Databases are not supported in this browser.');
                return;
            }
            
            db = openDatabase(shortName, version, displayName,maxSize);
            db.transaction(function(transaction) {
                           transaction.executeSql('INSERT INTO Log(log_date, log_time,log_name,log_visitor,log_action,log_balance,log_paidBy,memberInLogId,changeAmount,signinOrPay) VALUES (?,?,?,?,?,?,?,?,?,?)',[my_date,my_time,name,vistor,action,balanceForVisitor,payBy,memberidToLog,changeAmount,signOrpay],enteredIntoLogSuccess,errorHandler);
                           });
            
        }else{
            fetchPayByMemberDetails();
        }
      }
    }
   
}

function enteredIntoLogSuccess (tx, resultset){
    alert("Payment Sucess");
    document.getElementById("visitorFirstName").value = '';
    document.getElementById("visitorEmail").value = '';
    document.getElementById("visitorPhoneNumber").value = '';
    location.reload();
    return false;
}

function fetchPayByMemberDetails() {
    
    var list = document.getElementById("paymentByMember");
    var paybymemberId = list.value;
    
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
                   transaction.executeSql('SELECT * FROM Members where member_id = ?', [paybymemberId],function(transaction, result) {
                                if (result != null && result.rows != null) {
                                    for (var i = 0; i < result.rows.length; i++) {
                                          var row = result.rows.item(i);
                                          var fname = row.member_firstname;
                                          var lname = row.member_lastname;
                                          var names = [fname, lname];
                                          var fullName1 = names.join(' ');
                                          payByMemberBalance = row.member_balance;
                                          
                                          if(payByMemberBalance < meetingFee) {
                                            alert("Member Have No Sufficient Balance")
                                          }else {
                                                  db = openDatabase(shortName, version, displayName,maxSize);
                                                  var balanceAfterPayament = parseFloat(payByMemberBalance) - parseFloat(meetingFee);
                                                  //alert(balanceAfterPayament);
                                                  if (!window.openDatabase) {
                                                    alert('Databases are not supported in this browser.');
                                                    return;
                                                  }
                                                  db.transaction(function(transaction) {
                                                         transaction.executeSql('UPDATE Members SET member_balance=? where member_id = ?', [balanceAfterPayament,paybymemberId],  addToLogAfterPaymentForMember(fullName1,paybymemberId), errorCB);
                                                        },errorHandler,nullHandler);
                                          }
 
                                        }
                                    }
                            },errorHandler);
                   },errorHandler,nullHandler);
    return;
    
}

function addToLogAfterPaymentForMember(paidByMember,paybymemberId) {
    
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
    
    if(hour>12){
        hour = hour - 12;
    }
    if(hour<10){
        hour = "0"+hour;
    }
    
    var my_time;
    
    if(minit<10) {
        my_time = hour+":0"+minit;
    }else {
        my_time = hour+":"+minit;
    }
    
    var name = $('#visitorFirstName').val();
    var vistor = 1;
    var action = "$"+meetingFee;
    
    var balanceForVisitor = 0;
    
    var memberidToLog =paybymemberId;
    var changeAmount =meetingFee;
    var signOrpay = 1;
     /*alert(my_date);
     alert(my_time);
     alert(name);
     alert(vistor);
     alert(action);
     alert(balanceForVisitor);
     alert(paidByMember);*/
    
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
                   transaction.executeSql('INSERT INTO Log(log_date, log_time,log_name,log_visitor,log_action,log_balance,log_paidBy,memberInLogId,changeAmount,signinOrPay) VALUES (?,?,?,?,?,?,?,?,?,?)',[my_date,my_time,name,vistor,action,balanceForVisitor,paidByMember,memberidToLog,changeAmount,signOrpay],paymentSuccessForMember,errorHandler);
                   });
    

}

function paymentSuccessForMember (tx, resultset){
    alert("Payment Sucess");
   /* document.getElementById("visitorFirstName").value = '';
    document.getElementById("visitorEmail").value = '';
    document.getElementById("visitorPhoneNumber").value = '';
    var list = document.getElementById("paymentByMember");
    list.value = "";*/
    
    location.reload();
    return false;

}



