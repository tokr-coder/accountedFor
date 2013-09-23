// Put your custom code here
var meetingTime;
var paymentMethod = "";
var idTosend;
var memberBalanceToSend;
var memberEmailToSend;
var descriptionString = "";
var memberNameToSend;
var ids, q;
var memberIdToSendArray = new Array();
var memberBalanceToSendArray = new Array();
var memberEmailToSendArray = new Array();
var memberNameToSendArray = new Array();
var descriptionToSendArray = new Array();
var paymentMethodToSendArray = new Array();
var meetingDateToSendArray = new Array();


var started = 0;

function onBodyLoadRemoveMember(){
    
    meetingTime = window.localStorage.getItem("meetingTime");
	ReloadList()
}

function ReloadList(){
	$('#List').html('<ul><li class="li_bold wid1">Name</li><li class="li_bold wid2">Meeting Date</li><li class="li_bold wid2" style="border-right:none;">Sent</li></ul>');
    fillReceiptsFromDatabase();
}

function fillReceiptsFromDatabase(){
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(tx) {
		var sql="SELECT * FROM Receipts ORDER BY sent, meetingdate, name";
		//tx.executeSql( SQL string, arrary of arguments, success callback function, failure callback function)
		tx.executeSql(sql,[],function(tx,result){
			if (result !=null && result.rows != null){
				//meetingdate, sent, name, id
				var html = "";
				var row;
				for (var i = 0; i < result.rows.length; i++){
					row = result.rows.item(i);
					html += '<ul class="';
					if (row.sent == 1) {html +=	'sent';}else{html += 'notsent';}
					html += '"><li class="wid1">' + row.name + '</li>' +
                    '<li class="wid2">' + row.meetingdate + '</li>' +
                    '<li class="wid2" style="border-right:none;">';
					if (row.sent == 1) {
						html +=	'<img src="images/check.png" /><label for="sent_chk'+i+'"> re-send:</label><input type="checkbox" name="sent_chk'+i+'" id="' + row.id +'" />';
					}else{
						html +=	'<label for="sent_chk'+i+'"> send:</label><input type="checkbox" name="sent_chk'+i+'" id="' + row.id +'" checked />';
					}
					html +='</li></ul>';
				}
				$('#List').append(html);
			}
		},errorHandler);
	},errorHandler,nullHandler);

}

function sendReceiptsClicked(){
//create a list of receipt ids from the checked checkboxes
//prepare arrays for sending to email server
	$('input:checkbox:checked').each(function(){
		ids.push($(this).attr('id'));
		q += (q == "" ? "" : ", ") + "?";// makes a string of "?, ?, ?" without a "," at the begining or end.
	});
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}
	db = openDatabase(shortName, version, displayName,maxSize);
	db.transaction(function(tx) {
		var sql="SELECT * FROM Receipts WHERE id IN ("+q+")";
		tx.executeSql(sql, ids, function(tx,result){
			if (result != null && result.rows != null) {
				for (var i = 0; i < result.rows.length; i++) {
					var row = result.rows.item(i);
					/**************
					// the meeting date is not being sent!!!
					// only the date of sending is used << wrong !
					**************/
					meetingDateToSendArray[i] = row.meetingdate;
					memberBalanceToSendArray[i] = row.amount;
					memberEmailToSendArray[i] = row.email;
					memberNameToSendArray[i] = row.name;
					descriptionToSendArray[i] = 'meeting fee';
					paymentMethodToSendArray[i] = row.paymentmethod;
				}
			}
		},errorHandler);
	},errorHandler,sendMemberSuccessAfterFetchingFromDbToAll);

}

function sendMemberSuccessAfterFetchingFromDbToAll(){
    
    //http://127.0.0.1:8888/BNI/login.php
    //http://198.1.74.28/~spaniac1/bni/mail.php
    
    var meetingStartedTimeForReceipts = window.localStorage.getItem("meetingStartedTimeForReceipts");
    var groupName=  window.localStorage.getItem("groupName");
    var meetingTimeFromDB = window.localStorage.getItem("meetingTime");
    var emailSetupValue = window.localStorage.getItem("emailSetupValue");
    if(emailSetupValue == null) {
        emailSetupValue = "bni@bni.com";
    }
    
					/**************
					// the meeting date is not being sent!!!
					// only the date of sending is used << wrong !
					**************/
					//meetingDateToSendArray[i];

    $.ajax({
           type: "POST",
           url: 'http://198.1.74.28/~spaniac1/bni/mail1.php',
           dataType: 'json',
           data: {"memberBalanceToSendArray":memberBalanceToSendArray, "memberEmailToSendArray":memberEmailToSendArray,"memberNameToSendArray":memberNameToSendArray,"paymentMethodToSendArray":paymentMethodToSendArray,"descriptionToSendArray":descriptionToSendArray,"meetingStartedTime":meetingStartedTimeForReceipts , "groupName":groupName , "emailSetupValue":emailSetupValue},
           timeout: 7000,
           success: function(data, status){
				meetingDateToSendArray = [];
                memberBalanceToSendArray = [];
                memberEmailToSendArray = [];
                memberNameToSendArray = [];
                paymentMethodToSendArray = [];
                descriptionToSendArray = [];
				db = openDatabase(shortName, version, displayName,maxSize);
				db.transaction(function(tx) {
					var sql="UPDATE Receipts SET sent = 1 WHERE id IN ("+q+")";
					tx.executeSql(sql,ids);
				},errorHandler,nullHandler);
				
                alert("Receipts Sent Successfully..");
				ReloadList();
            },
           error: function(){
				meetingDateToSendArray = [];
                memberBalanceToSendArray = [];
                memberEmailToSendArray = [];
                memberNameToSendArray = [];
                paymentMethodToSendArray = [];
                descriptionToSendArray = [];
                alert("Receipts not Sent ..");
                location.reload();     }
           });
    
}





