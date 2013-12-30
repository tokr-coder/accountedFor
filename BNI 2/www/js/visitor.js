var payByMemberBalance;
var arrayVisitor = [];
var arrayMember = [];
var numberVisit = 0;
var typeVisitor = '';

$(document).ready(function() {
                  $('input[type="submit"]').attr('disabled','disabled');
                   document.getElementById("paymentByMember").disabled=true;
                  $('input[type="text"]').keyup(function() {
                                                if($('#visitorFirstName').val() != '' && $('#visitorEmail').val() !='' ){
                                                $('input[type="submit"]').removeAttr('disabled');
                                                }
                                                });
                  $('input[type="text"]').keyup(function() {
                                                if($('#visitorFirstName').val() != '' && $('#visitorEmail').val() !='' ){
                                                $('input[type="submit"]').removeAttr('disabled');
                                                }
                                                });
                  /*$('input[type="number"]').keyup(function() {
                                                if($('#visitorFirstName').val() != '' && $('#visitorEmail').val() !='' && $('#visitorPhoneNumber').val() !=''){
                                                $('input[type="submit"]').removeAttr('disabled');
                                                }
                                                });*/
                  });


function onBodyLoadVisitor(){
    
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {  

      var sql = 'SELECT * FROM Settings';
      
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length > 0) {
                        for (var i = 0; i < result.rows.length; i++) {
                               var row = result.rows.item(i);
                               meetingFee = row.meetingFee;
                               
                               var meetingFeeInDoller = "$"+meetingFee;
                               document.getElementById("MeetingFeeFromDb").innerHTML=document.getElementById("MeetingFeeFromDb").innerHTML+meetingFeeInDoller;
                               fillPayByMemberFromDatabase();
                               if (window.localStorage.getItem("isMeetingStarted")!='1'){
                                  document.getElementById("meeting_status").innerHTML = "- Meeting not started";
                                  $('input').attr('disabled','disabled');
                               }
                              
                              if(row.meetingRequireSig == false ){
                                  $('.privacy, .sig_outter').hide();
                              }


                              if(meetingPayForVisitor){
                                  document.getElementById('radio_paidBy').disabled = false;
                              }else{
                                  document.getElementById('radio_paidBy').disabled = true;
                              $('#radio_paidBy').parent().hide();
                              }
                              memberList();
                              ListVisitors();
                        }
                    }
                    else{
                           alert("Enter meeting details in Administration tab !!");
                        }
                },errorHandler);
            },errorHandler,nullHandler);


    /*meetingFee = window.localStorage.getItem("meetingFee");
    
    if(meetingFee == null) {
        alert("Enter meeting details in Administration tab !!");
    }else
    {
        var meetingFeeInDoller = "$"+meetingFee;
        document.getElementById("MeetingFeeFromDb").innerHTML=document.getElementById("MeetingFeeFromDb").innerHTML+meetingFeeInDoller;
        fillPayByMemberFromDatabase();
    }
    if (window.localStorage.getItem("isMeetingStarted")!='1'){
		document.getElementById("meeting_status").innerHTML = "- Meeting not started";
		$('input').attr('disabled','disabled');
	}
	
    var requireSig = window.localStorage.getItem("requireSig");
    if(requireSig == "0"){
		$('.privacy, .sig_outter').hide();
	}
    var visitorAllow = window.localStorage.getItem("visitorAllow");
    if(visitorAllow == "1"){
        document.getElementById('radio_paidBy').disabled = false;
    }else{
        document.getElementById('radio_paidBy').disabled = true;
		$('#radio_paidBy').parent().hide();
    }
    memberList();
    ListVisitors();*/
}


function memberList(){
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
      
      var sql = 'SELECT * FROM Members where member_active = 0';
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result != null && result.rows != null) {
                        for (var i = 0; i < result.rows.length; i++) {
                             var row = result.rows.item(i);
                             var idMember = row.member_id;
                             var nameMember = row.member_firstname+' '+row.member_lastname;
                             arrayMember.push({"value" : idMember, "name" : nameMember });
                        }
                    }
                },errorHandler);
            },errorHandler,nullHandler);
    return;
}

function ListVisitors(){
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
      var sql = 'SELECT * FROM Visitors ';
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result != null && result.rows != null) {
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);
                            var name = row.name;
                            var email = row.email;
                            var phone = row.phone;
                            var company = row.company;
                            arrayVisitor.push({"value" : name, "email" : email, "phone" : phone, "company" : company, "numberVisit" : row.numberVisits});
                        }
                    eventAutocomplete();
                    }
                },errorHandler);
            },errorHandler,nullHandler);
    return;
}

function eventAutocomplete(){

    $('#visitorFirstName').autocomplete({
      lookup: arrayVisitor,
      minChars: 3,
      onSelect: function (suggestion) {
        $('#visitorEmail').val(suggestion.email);
        $('#company').val(suggestion.company);
        $('#visitorPhoneNumber').val(suggestion.phone);
        numberVisit = suggestion.numberVisit;
      }
    });
}

function ClearPressed() {

//    if(document.getElementById('radio_cash').checked) {
//        alert("cash");
//    }else if(document.getElementById('radio_cheque').checked) {
//        alert("cheque");
//    }
    document.getElementById("visitorFirstName").value = '';
    document.getElementById("visitorEmail").value = '';
    document.getElementById("company").value = '';
    document.getElementById("visitorPhoneNumber").value = '';
    
    var list = document.getElementById("paymentByMember");
    list.value = "";
}

function loadMemberList(){

  for (var i = 0; i < arrayMember.length; i++) {
    $("#members").append('<option value="'+arrayMember[i].value+'"> '+arrayMember[i].name+'</option>');
  }
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
    var passRequeriments = false;

    if($('#visitorFirstName').val()==""){
        alert("Enter First Name");
    }else if($('#visitorEmail').val()=="") {
        alert("Enter Email");
    }else if( !(document.getElementById('radio_visitor').checked) && !(document.getElementById('radio_substitute').checked) ){
      alert("Select: Visitor or Substitute");
    }else{

      var list = document.getElementById("paymentByMember");
      var paybymemberId = list.value;

      if(typeVisitor == 'visitor' && $('#members').val()== 0 ){
          if(!(document.getElementById('radio_cash').checked) && !(document.getElementById('radio_cheque').checked)){
            alert("Select a Payment Method");
          }else{ passRequeriments = true}

        }else if(typeVisitor == 'visitor' && $('#members').val() != 0){
            if(paybymemberId == "" && !(document.getElementById('radio_cash').checked) && !(document.getElementById('radio_cheque').checked)){
                alert("Select a Payment Method");   
            }else{passRequeriments = true}
        }else if(typeVisitor == 'substitute'){passRequeriments = true}
    
        if(passRequeriments){

          //console.log("paso las validaciones");
            if(typeVisitor == 'visitor' && paybymemberId != "" && (document.getElementById('radio_paidBy').checked)){
              fetchPayByMemberDetails($('#members').val(), 1);
            }else if(typeVisitor == 'substitute'){
              fetchPayByMemberDetails($('#members').val(), 2);
              //fetchPayByMemberDetails($('#members').val(), 2);
            }else{
              console.log("lo paga en efectivo o cheque")
              insertOrUpdateVisitor();
            }
        
        }// Fin de paso validaciones
    }
   
}
  
  function successAddVisitor(name){
      console.log("save the visitor "+name);
  }

function saveReceipt(name,email,company,meetingFee,my_date,payBy){
	db.transaction(function(transaction) {
		transaction.executeSql('INSERT INTO Receipts(name,email,company,amount,meetingdate,paymentmethod,sent) VALUES (?,?,?,?,?,?,?)',
			[name,email,company,meetingFee,my_date,payBy,0],
			enteredIntoLogSuccess,
			errorHandler);
	});
}

function enteredIntoLogSuccess (tx, resultset){
    alert("Payment Sucess");
    document.getElementById("visitorFirstName").value = '';
    document.getElementById("visitorEmail").value = '';
    document.getElementById("visitorPhoneNumber").value = '';
    location.reload();
    return false;
}

function fetchPayByMemberDetails(member_id,typeVisitor) {
    
    var list = document.getElementById("paymentByMember");
    var paybymemberId = list.value;
    
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    db = openDatabase(shortName, version, displayName,maxSize);

    db.transaction(function(transaction) {
      var sql = 'SELECT * FROM Members WHERE member_id='+member_id;
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result != null && result.rows != null) {
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);
                            var fname = row.member_firstname;
                            var lname = row.member_lastname;
                            var names = [fname, lname];
                            var fullName1 = names.join(' ');
                            payByMemberBalance = row.member_balance;
                            //console.log("La consulta devolvio "+fullName1+" el balance es "+payByMemberBalance);
                             if( (payByMemberBalance < meetingFee) && typeVisitor == 1) {
                                 //console.log("no tiene fondos y es tipo visitor");
                                alert("Member Have No Sufficient Balance");
                             }else{
                                var balanceAfterPayament = parseFloat(payByMemberBalance) - parseFloat(meetingFee);
                                console.log("Los fondos luego del pago son "+balanceAfterPayament);
                                  
                                  //IniciarSesionDelMiembroQuePago
                                db = openDatabase(shortName, version, displayName,maxSize);
                                db.transaction(function(transaction) {
                                  transaction.executeSql('UPDATE Members SET member_balance=? where member_id = ?', [balanceAfterPayament,member_id],  addToLogAfterPaymentForMember(fullName1,member_id), errorCB);
                                },errorHandler,nullHandler);
                               if(typeVisitor == 2){
                                  SingInMember(member_id, balanceAfterPayament); 
                               }
                               insertOrUpdateVisitor();
                               
                             
                             }

                        }
                    }
                },errorHandler);
            },errorHandler,nullHandler);
    return;
    
}

function SingInMember(member_id, balanceAfterPayament){

  var datetime = getdate() + " " + gettime();
  var active = 1;
  console.log("funcion SingInMember");
  db = openDatabase(shortName, version, displayName,maxSize);
  db.transaction(function(transaction) {
  transaction.executeSql('UPDATE Members SET member_balance=? , member_checkintime=? , member_active=?where member_id = ?', [balanceAfterPayament,datetime,active,member_id],nada , errorCB);
  },errorHandler,nullHandler);
}
function nada(){
  console.log("se ejecuto el signIn");
}

function insertOrUpdateVisitor(){

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
  var email = $('#visitorEmail').val();
  var company = $('#company').val();
  var visitorPhoneNumber = $('#visitorPhoneNumber').val();

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
  console.log("LOG 2");
   if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    
    if(typeVisitor == 'visitor'){
        numberVisit++; 
        console.log("cantidad de visitas "+ numberVisit);

      db = openDatabase(shortName, version, displayName,maxSize);
      db.transaction(function(transaction) {
      transaction.executeSql(
      'INSERT INTO Log(log_date, log_time,log_name,log_visitor,log_action,log_balance,log_paidBy,memberInLogId,changeAmount,signinOrPay) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [my_date,my_time,name,vistor,action,balanceForVisitor,payBy,memberidToLog,changeAmount,signOrpay],
      saveReceipt(name,email,company,meetingFee,my_date,payBy),
      errorHandler);
    });

    }else{
      numberVisit = numberVisit;
      saveSubstituteAsMember(name,email,visitorPhoneNumber,company);
    }

    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction){
      transaction.executeSql('INSERT OR REPLACE INTO Visitors(name, email, phone, company, signature, meetingdate, numberVisits, idMember) VALUES(?,?,?,?,?,?,?,?)',
      [name,email,visitorPhoneNumber,company,'',my_date,numberVisit, $('#members').val()],successAddVisitor(name),errorHandler);
    });
    
    
    

}

function saveSubstituteAsMember(name,email,visitorPhoneNumber,company){

    db.transaction(function(transaction) {
    transaction.executeSql('INSERT INTO Members(member_firstname, member_lastname,member_email,member_phonenumber,member_company,member_balance,member_checkintime,member_active) VALUES (?,?,?,?,?,?,?,?)',
      [name,'',email,visitorPhoneNumber,company,0,'No',0],
      enteredIntoLogSuccess,
      errorHandler);
  });

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
    console.log("LOG 1");
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

function getdate(){
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
    return year+'-'+month+"-"+day;
}

function gettime(){
    var currentDate = new Date()
    var hour = currentDate.getHours();
    var minit = currentDate.getMinutes();
    
    if(hour>12){
        hour = hour - 12;
    }
    if(hour<10){
        hour = "0"+hour;
    }
    
    if(minit<10) {
        return hour+":0"+minit;
    }else {
        return hour+":"+minit;
    }
}





