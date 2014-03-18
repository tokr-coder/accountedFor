// Put your custom code here

var selectedMemberId;
var balance;
var fromlink;
var fullName, member_email, member_company, meetingFeeInPay;

$(document).ready(function() {
                  $('input[type="number"]').keyup(function() {
                                                if($('#paymentAmount').val() != ''){
                                                $('input[type="button"]').removeAttr('disabled');
                                                }
                                                });
                                   
                  
                  });

function onBodyLoadPayment(){
    selectedMemberId =getDetailsFromUrl()["id"];
    fromlink = getDetailsFromUrl()["fromlink"];
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {  

      var sql = 'SELECT * FROM Setting';
      
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length > 6) {
                               var row = result.rows.item(1);
                               meetingFeeInPay = result.rows.item(1).value;
                               if(fromlink == "ok"){
                                    document.getElementById("paymentAmount").value = '';
                               }else{
                                    document.getElementById("paymentAmount").value =meetingFeeInPay ;
                                    $('input[type="button"]').removeAttr('disabled');
                               }

                               db.transaction(fetchMemberDetails,errorHandler,nullHandler);
                    }
                },errorHandler);
            },errorHandler,nullHandler);

    //alert(fromlink);
    //alert(meetingFee);
    /*meetingFeeInPay = window.localStorage.getItem("meetingFee");
    if(fromlink == "ok"){
        document.getElementById("paymentAmount").value = '';
    }else{
        document.getElementById("paymentAmount").value =meetingFeeInPay ;
        $('input[type="button"]').removeAttr('disabled');
    }
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(fetchMemberDetails,errorHandler,nullHandler);*/
}

function fetchMemberDetails(tx) {
	tx.executeSql('SELECT * FROM Members where member_id = ?', [selectedMemberId],
	function(tx, result) {
		if (result != null && result.rows != null) {
			for (var i = 0; i < result.rows.length; i++) {
				var row = result.rows.item(i);
				var fname = row.member_firstname;
				var lname = row.member_lastname;
				var names = [fname, lname];
				fullName = names.join(' ');
				member_email = row.member_email;
				member_company = row.member_company;
				  
				balance = row.member_balance;
				var balanceInDoller = "$"+balance;
				
				document.getElementById("memberNameInPaymentPage").innerHTML=fullName;
				document.getElementById("memberBalanceInPaymentPage").innerHTML=balanceInDoller;
				  
			}    
		}
	},errorHandler);
}

function clearButtonPressedInPayment() {
    window.location.href = "index.html";
    return false;
}

function paymentPressedInPayment() {
    
    var valueEntered = $('#paymentAmount').val();
    if(valueEntered == "") {
        alert("Enter Amount !");
    }else{
        var newBalance ;
        //meetingFee = window.localStorage.getItem("meetingFee");
        
        if(fromlink == "ok") {
            newBalance =parseFloat(balance) + parseFloat(valueEntered);
            if (!window.openDatabase) {
                alert('Databases are not supported in this browser.');
                return;
            }
            db.transaction(function(transaction) {
                           transaction.executeSql('UPDATE Members SET member_balance=? where member_id = ?', [newBalance,selectedMemberId],  addToLog(valueEntered,newBalance,selectedMemberId), errorCB);
                           },errorHandler,nullHandler);
        }else {
            
            var intermediateProcess = parseFloat(balance) + parseFloat(valueEntered);
            newBalance = parseFloat(balance) + parseFloat(valueEntered) - parseFloat(meetingFeeInPay);

            var datetime = getdate() + " " + gettime();
            var active = 1;
            
            if(newBalance < 0){
                var stringValue = "Balance is"+newBalance;
                alert(stringValue);
            }
            
            if (!window.openDatabase) {
                alert('Databases are not supported in this browser.');
                return;
            }
            
            db.transaction(function(transaction) {
                           transaction.executeSql('UPDATE Members SET member_balance=? , member_checkintime=? , member_active=?where member_id = ?', [newBalance,datetime,active,selectedMemberId],  addToLog1(valueEntered,newBalance,selectedMemberId,intermediateProcess), errorCB);
                           },errorHandler,nullHandler);
            
        }

    }
    
}

function addToLog1(valueEntered,newBalance,selectedMemberId,intermediateProcess) {
    //records payment to log 
    var my_date = getdate();
    var my_time = gettime();
        
    var vistor = 0;
    var action = "Paid +$"+valueEntered;
    
    var payBy;
    if(document.getElementById('payment_cash').checked) {
        payBy = "Cash";
    }else if(document.getElementById('payment_check').checked) {
        payBy = "Cheque"
    }
    
    var changeAmount =valueEntered;
    var signOrpay = 0;
        
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    
    
    db = openDatabase(shortName, version, displayName,maxSize);
	db.transaction(function(transaction) {
	   transaction.executeSql(
		   'INSERT INTO Log(log_date, log_time,log_name,log_visitor,log_action,log_balance,log_paidBy,memberInLogId,changeAmount,signinOrPay) VALUES (?,?,?,?,?,?,?,?,?,?)',
		   [my_date,my_time,fullName,vistor,action,intermediateProcess,payBy,selectedMemberId,changeAmount,signOrpay],
		   saveReceipt(fullName,member_email,member_company,changeAmount,my_date,payBy,newBalance,selectedMemberId),
		   errorHandler);
	});
}
function saveReceipt(fullName,member_email,member_company,changeAmount,my_date,payBy,newBalance,selectedMemberId){
	//'TABLE Receipts(id INTEGER NOT NULL PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, company TEXT NOT NULL, amount INTEGER NOT NULL, meetingdate TEXT NOT NULL, paymentmethod TEXT NOT NULL)'
	       if(debug) console.log('saveReceipt changeAmount: ' + changeAmount); 

	if(changeAmount > 0){
    db.transaction(function(transaction) {
		transaction.executeSql('INSERT INTO Receipts(name,email,company,amount,meetingdate,paymentmethod,sent) VALUES (?,?,?,?,?,?,?)',
			[fullName,member_email,member_company,changeAmount,my_date,payBy,0],
			addToLog2(changeAmount,newBalance,selectedMemberId),
			errorHandler);
	});
	}else{
		addToLog2(changeAmount,newBalance,selectedMemberId);
	}
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

function addToLog2(valueEntered,newBalance,selectedMemberId) { 
// records meeting fee deduction to log
    var my_date = getdate();
    var my_time = gettime();

    //var meetingFeeInPay = window.localStorage.getItem("meetingFee");
    var vistor = 0;
    var action = "SignIn -$"+meetingFeeInPay;
    
    var payBy;
    if(document.getElementById('payment_cash').checked) {
        payBy = "Cash";
    }else if(document.getElementById('payment_check').checked) {
        payBy = "Cheque"
    }
    
    var changeAmount =valueEntered;
    var signOrpay = 2;
        
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
                   transaction.executeSql('INSERT INTO Log(log_date, log_time,log_name,log_visitor,log_action,log_balance,log_paidBy,memberInLogId,changeAmount,signinOrPay) VALUES (?,?,?,?,?,?,?,?,?,?)',[my_date,my_time,fullName,vistor,action,newBalance,payBy,selectedMemberId,changeAmount,signOrpay],paymentSuccess,errorHandler);
                   });
    
    
}


function addToLog(valueEntered,newBalance,selectedMemberId) {
//records payment to log when only payment is made (not signin)
	var my_date = getdate();
    var my_time = gettime();
    
    var vistor = 0;
    var action = "Paid +$"+valueEntered;

    var payBy;
    if(document.getElementById('payment_cash').checked) {
        payBy = "Cash";
    }else if(document.getElementById('payment_check').checked) {
        payBy = "Cheque"
    }
    
    var changeAmount =valueEntered;
    var signOrpay = 0;
    
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
                   transaction.executeSql('INSERT INTO Log(log_date, log_time,log_name,log_visitor,log_action,log_balance,log_paidBy,memberInLogId,changeAmount,signinOrPay) VALUES (?,?,?,?,?,?,?,?,?,?)',[my_date,my_time,fullName,vistor,action,newBalance,payBy,selectedMemberId,changeAmount,signOrpay],
				   function(){
					if(changeAmount > 0){
						db.transaction(function(transaction) {
							transaction.executeSql('INSERT INTO Receipts(name,email,company,amount,meetingdate,paymentmethod,sent) VALUES (?,?,?,?,?,?,?)',
								[fullName,member_email,member_company,changeAmount,my_date,payBy,0],
								addToLog2(changeAmount,newBalance,selectedMemberId),
								errorHandler);
						});
					}
				   }
				   ,errorHandler);
                   });
}

function paymentSuccess (tx, resultset){
    //alert("Payment Sucess");
    //document.getElementById("paymentAmount").value = '';
    window.location.href = "index.html";
    return false;
}

function getDetailsFromUrl() {
	var vars = [], hash;
	var hashes = window.location.href.slice(
                                            window.location.href.indexOf('?') + 1).split('&');
	for ( var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

