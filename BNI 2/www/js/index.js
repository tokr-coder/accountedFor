// global variables
var db;
var shortName = 'BNISqlDB';
var version = '1.0';
var displayName = 'BNISqlDB';
var maxSize = 65535;

var meetingFee;

// this is called when an error happens in a transaction
function errorHandler(transaction, error) {
    alert('Error: ' + error.message + ' code: ' + error.code);
    
}

function successCallBack() {
   // alert("DEBUGGING: success");
}

function nullHandler(){ //alert("added");
};

function onBodyLoad(){
    
    document.addEventListener("deviceready", onDeviceReady(), false);
}


function onDeviceReady()
{
    
    //alert("DEBUGGING: we are in the onBodyLoad() function");
    
    
    
        if (!window.openDatabase) {
            alert('Databases are not supported in this browser.');
            return;
        }
        db = openDatabase(shortName, version, displayName,maxSize);
        db.transaction(function(tx){
                       tx.executeSql('CREATE TABLE IF NOT EXISTS Members(member_id INTEGER NOT NULL PRIMARY KEY, member_firstname TEXT NOT NULL, member_lastname TEXT NOT NULL, member_email TEXT NOT NULL, member_phonenumber TEXT NOT NULL, member_company TEXT NOT NULL, member_balance INTEGER NOT NULL, member_checkintime TEXT NOT NULL, member_active INTEGER NOT NULL)',
                                 [],nullHandler,errorHandler);
                    },errorHandler,CreateLogTable);
    
}

function CreateLogTable() {
    
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(tx){
                   tx.executeSql('CREATE TABLE IF NOT EXISTS Log(log_id INTEGER NOT NULL PRIMARY KEY, log_date TEXT NOT NULL, log_time TEXT NOT NULL, log_name TEXT NOT NULL, log_visitor INTEGER NOT NULL, log_action TEXT NOT NULL,log_balance INTEGER NOT NULL, log_paidBy TEXT NOT NULL, memberInLogId INTEGER NOT NULL, changeAmount INTEGER NOT NULL, signinOrPay INTEGER NOT NULL)',
                                 [],nullHandler,errorHandler);
                   },errorHandler,ListAllMembers);
}

function ListAllMembers() {
   // alert("List Members");
    meetingFee = window.localStorage.getItem("meetingFee");
    var groupName=  window.localStorage.getItem("groupName");
    var meetingTime = window.localStorage.getItem("meetingTime");
    var imageURI = window.localStorage.getItem("imageLocation");
    var welcome = window.localStorage.getItem("showWelcomeScreen");

    
    document.getElementById("GroupNameDiv").innerHTML=groupName;
    if (window.localStorage.getItem("isMeetingStarted")!='1') document.getElementById("meeting_status").innerHTML = "- Meeting not started";
    var largeImage = document.getElementById('largeImage');
    if(imageURI == null){
        largeImage.src = "images/accountedforicon.png";
    }else{
        largeImage.src = imageURI;
    }
    
    
    if(meetingFee == null || groupName == null) {
		if (welcome == null) {
			window.localStorage.setItem("showWelcomeScreen", "0");
			window.location.href = "help.html";
		}else{
			document.getElementById("GroupNameDiv").innerHTML = "Group Name";
			alert("Enter meeting details in the Administration tab !!");
		}
    }else{


    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
                   transaction.executeSql('SELECT * FROM Members ORDER BY member_firstname;', [],function(transaction, result) {
                            if (result != null && result.rows != null) {
                                //alert(result.rows.length);
                                for (var i = 0; i < result.rows.length; i++) {
                                    var row = result.rows.item(i);
                                    var fname = row.member_firstname;
                                    var lname = row.member_lastname;
                                    var names = [fname, lname];
                                    var fullName = names.join(' ');
                                    var html; 
                                    var activeOrNot =row.member_active;
                                    var disabled = '';
									if (window.localStorage.getItem("isMeetingStarted")=='0') disabled = 'disabled';
                                          
                                    if(activeOrNot==1){
                                          var htmlRow = '<ul><li class="wid1"';
										  if(IsLate(row.member_checkintime, meetingTime)){htmlRow += ' style="color:red;"';}
										  htmlRow += '>'+ fullName +'</li><li class="wid2 sign'+ row.member_id +'">'+ row.member_checkintime +'</li><li class="wid2" style="border-right:none;"><a class="fee'+ row.member_id +'" style="color: #000000" href="payment.html?fromlink=ok&id='+ row.member_id+'">Paid</a></li></ul>';
                                          $('#MemberList').append(htmlRow);
                                          
                                    }else{
                                          
                                          if(row.member_balance >= meetingFee) {
												html = '<ul><li class="wid1">'+ fullName +'</li><li class="wid2 sign'+ row.member_id +'"><input ';
												if (disabled == '') html += 'onClick="signInPressed((this.id))" ';
												html += 'type="button" class="login" value="Sign in" id="'+row.member_id+'" '+disabled+'/></li><li class="wid2" style="border-right:none;"><a class="fee'+ row.member_id +'" style="color: #000000" href="payment.html?fromlink=ok&id='+ row.member_id+'">Pre Paid</a></li></ul>';
                                                $('#MemberList').append(html);
                                          
                                          }else {
                                                html = '<ul><li class="wid1">'+ fullName +'</li><li class="wid2"><a class="fee'+ row.member_id +'" ';
												if (disabled == '') html += 'href="payment.html?fromlink=no&id=' +row.member_id+'"';
												html += '><input type="button" class="login_pay" value="Pay &amp; Sign In" '+disabled+'/></a></li><li class="wid2" style="border-right:none;"><a class="fee'+ row.member_id +'" style="color: red;" href="payment.html?fromlink=ok&id='+ row.member_id+'">Payment needed</a></li></ul>';
												$('#MemberList').append(html);
                                          }
                                          
                                    }
                                }
                                          
                            }
                    },errorHandler);
            },errorHandler,nullHandler);
    }
    return;

}

function signInPressed(clicked_id){
  
    var currentdate = new Date();
    
    var hourInFull = currentdate.getHours();
    if(hourInFull>12){
        hourInFull = hourInFull - 12;
    }
    if(hourInFull<10){
        hourInFull = "0"+hourInFull;
    }
    
    var minutInFull = currentdate.getMinutes();
    if(minutInFull<10){
        minutInFull = "0"+minutInFull;
    }
    
    var dateInFull = currentdate.getDate();
    if(dateInFull<10){
        dateInFull = "0"+dateInFull;
    }
    
    var monthInFull = currentdate.getMonth()+1;
    if(monthInFull<10){
        monthInFull = "0"+monthInFull;
    }
    
    var datetime = "" + dateInFull + "/"
    + monthInFull  + "/"
    + currentdate.getFullYear() + "  "
    + hourInFull + ":"
    + minutInFull + ":"
    + currentdate.getSeconds();
    var active = 1;
    var memberbalance;
    
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
   
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
                   transaction.executeSql('SELECT * FROM Members where member_id = ?', [clicked_id],function(transaction, result) {
                                          if (result != null && result.rows != null) {
                                             for (var i = 0; i < result.rows.length; i++) {
                                                var row = result.rows.item(i);
                                                memberbalance = row.member_balance;
                                          
                                                var fname = row.member_firstname;
                                                var lname = row.member_lastname;
                                                var names = [fname, lname];
                                                var fullName = names.join(' ');
                                          
                                                var newMemberBalance = parseFloat(memberbalance) - parseFloat(meetingFee);
                                                db.transaction(function(transaction) {
                                                         transaction.executeSql('UPDATE Members SET  member_balance=? , member_checkintime=? , member_active=? where member_id = ?', [newMemberBalance,datetime,active,clicked_id],  addToLogAfterSignIn(fullName,newMemberBalance,clicked_id,datetime), errorCB);
                                                    },errorHandler,nullHandler);
                                          
                                              }
                                          }
                                    },errorHandler);
                   },errorHandler,nullHandler);

}


function addToLogAfterSignIn(fullName,newMemberBalance,clicked_id,datetime) {
    
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
    
    var my_date = month+"/"+day+"/"+year;
    

    
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
    
    var vistor = 0;
    var action = "SignIn -$"+meetingFee;
    
    var payBy = "Cash";
    
    var changeAmount =meetingFee;
    var signOrpay = 1;
    /*alert(my_date);
     alert(my_time);
     alert(fullName);
     alert(vistor);
     alert(action);
     alert(newBalance);
     alert(payBy);*/
    $('a.fee'+ clicked_id).html('Paid');
	$('li.sign' + clicked_id).html(my_date +' '+ my_time);
	if(IsLate(datetime, window.localStorage.getItem("meetingTime"))){$('.sign'+clicked_id).css('color','red');}
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
                   transaction.executeSql('INSERT INTO Log(log_date, log_time,log_name,log_visitor,log_action,log_balance,log_paidBy,memberInLogId,changeAmount,signinOrPay) VALUES (?,?,?,?,?,?,?,?,?,?)',[my_date,my_time,fullName,vistor,action,newMemberBalance,payBy,clicked_id,changeAmount,signOrpay],SignInSuccess,errorHandler);
                   });
    
    
}


function SignInSuccess (tx, resultset){
    //alert("Signed In Success");
    //location.reload();
    return false;
}

function Update() {
    alert("ok");
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    
    db.transaction(function(transaction) {
                   transaction.executeSql('SELECT * FROM User;', [],function(transaction, result) {
                                          
                                          if (result != null && result.rows != null) {
                                          for (var i = 0; i < result.rows.length; i++) {
                                          var row = result.rows.item(i);
                                          alert(row.UserId);
                                          if(row.UserId == 1) {
                                          alert("entered");
                                          transaction.executeSql('UPDATE User SET FirstName=? where UserId = 1', [$('#txFirstName').val()],  updatetable, errorCB);
                                          
                                          
                                          }
                                          
                                          }
                                          }
                                          },errorHandler);
                   },errorHandler,nullHandler);
    ListDBValues();
    return false;
}

function updatetable (tx, resultset){
    console.log("updated something");
}

function errorCB(err)
{
    alert("Error processing SQL: " + err.code);
}

function validate(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode( key );
    var regex = /[0-9]|\./;
    if( !regex.test(key) ) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();
    }
}
function IsLate(checkintime, meetingTime){
	var MyDate= checkintime ;
	var MD_Y=MyDate.substring(6,10);
	var MD_D=MyDate.substring(0,2); // Jan-Dec=01-12
	var MD_M=MyDate.substring(3,5);
	var MD_H=MyDate.substring(12,14);
	var MD_N=MyDate.substring(15,17);
	var MD_S=0;
	 MD_M=MD_M-1; // Jan-Dec=00-11
	var DObj=new Date(MD_H, MD_N, MD_S);
	  
	var meetingTimeFromDB = meetingTime ;
	var M_M=meetingTimeFromDB.substring(3,5);
	var M_H=meetingTimeFromDB.substring(0,2);
	var M_S=0;
	var DObjSavedTime=new Date(M_H, M_M, M_S);

	var MD_H_float = parseFloat(MD_H);
	var MD_N_float = parseFloat(MD_N);
	var M_M_float = parseFloat(M_M);
	var M_H_float = parseFloat(M_H);

	var lateORnot;
	if(M_H_float == MD_H_float){
		if(M_M_float < MD_N_float){
			return true;
		}else if(M_M_float > MD_N_float){
				return false;
		}else{
				return false;
		}
	}
	else if(M_H_float < MD_H_float){
		return true;
	}else{
		return false;
	}
}
/*
 var query = location.href.substring((location.href.indexOf('?')+1), location.href.length);
 if(location.href.indexOf('?') < 0) query = '';
 querysplit = query.split('&');
 query = new Array();
 
 for(var i = 0; i < querysplit.length; i++){
 var namevalue = querysplit[i].split('=');
 namevalue[1] = namevalue[1].replace(/\+/g, ' ');
 query[namevalue[0]] = unescape(namevalue[1]);
 }
 
 alert(query['date']);*/
