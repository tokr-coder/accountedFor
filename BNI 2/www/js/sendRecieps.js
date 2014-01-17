// Put your custom code here
var meetingTime;
var paymentMethod = "";
var idTosend;
var memberBalanceToSend;
var ids = new Array();
var q;
var memberIdToSendArray = new Array();
var memberBalanceToSendArray = new Array();
var memberEmailToSendArray = new Array();
var memberNameToSendArray = new Array();
var descriptionToSendArray = new Array();
var paymentMethodToSendArray = new Array();
var meetingDateToSendArray = new Array();
var TotalEmails = 0;
var positionActual = 0;
var meetingStartedTimeForReceipts;
var groupName;
var meetingTimeFromDB;
var emailSetupValue;


var started = 0;

function onBodyLoadRemoveMember(){
    if(!debug) $('.buttons_sr .options_outter_sr').hide();
    //meetingTime = window.localStorage.getItem("meetingTime");
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
		var sql="SELECT * FROM Receipts ORDER BY sent, meetingdate, name, email, amount";
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
					html += '"><li class="wid1">' + row.name + '<br>' + row.email + '</li>' +
                    '<li class="wid2">' + row.meetingdate + ' $'+ row.amount + '</li>' +
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
function doWithSelectedClicked(){
	ids = [];
	$('input:checkbox:checked').each(function(){
		ids.push($(this).attr('id'));
	});
	db = openDatabase(shortName, version, displayName,maxSize);
	var whatToDo = $('#selectWhatToDo').val();
	if(whatToDo == 'mark_sent'){
		db.transaction(function(tx) {
			var sql="UPDATE Receipts SET sent = 1 WHERE id IN ("+ids.join()+")";
			tx.executeSql(sql,null);
		},errorHandler,nullHandler);
	}else if(whatToDo == 'mark_notsent'){
		db.transaction(function(tx) {
			var sql="UPDATE Receipts SET sent = 0 WHERE id IN ("+ids.join()+")";
			tx.executeSql(sql,null);
		},errorHandler,nullHandler);
	}else if(whatToDo == 'remove'){
		db.transaction(function(tx) {
			var sql="DELETE FROM Receipts WHERE id IN ("+ids.join()+")";
			tx.executeSql(sql,null);
		},errorHandler,nullHandler);
	}
	ReloadList();
}
function sendReceiptsClicked(){
//create a list of receipt ids from the checked checkboxes
//prepare arrays for sending to email server
	$('input:checkbox:checked').each(function(){
		ids.push($(this).attr('id'));
		//q += (q == "" ? "" : ", ") + "?";// makes a string of "?, ?, ?" without a "," at the begining or end.
	});
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}
	db = openDatabase(shortName, version, displayName,maxSize);
	db.transaction(function(tx) {
		var sql="SELECT * FROM Receipts WHERE id IN ("+ids.join()+")";
		//var sql="SELECT * FROM Receipts WHERE id IN ("+q+")";
		//tx.executeSql(sql, ids, function(tx,result){
		tx.executeSql(sql, null, function(tx,result){
			if (result != null && result.rows != null) {
				for (var i = 0; i < result.rows.length; i++) {
					var row = result.rows.item(i);
					/**************
					// the meeting date is not being sent!!!
					// only the date of sending is used << wrong !
					**************/
					memberIdToSendArray[i]= row.id;
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
      db = openDatabase(shortName, version, displayName,maxSize);
      db.transaction(function(transaction) {  
      var sql = 'SELECT * FROM Settings';
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length > 0) {
                        for (var i = 0; i < result.rows.length; i++) {
                               var row = result.rows.item(i);
                               meetingStartedTimeForReceipts  = window.localStorage.getItem("meetingStartedTimeForReceipts");
    						   groupName=  row.nameGroup;
                               meetingTimeFromDB = row.meetingTime;
                               emailSetupValue = row.email;
                               totalEmails = memberBalanceToSendArray.length-1;
                               sendReciepsFromMandrill(totalEmails, positionActual,memberIdToSendArray, memberBalanceToSendArray,memberEmailToSendArray, memberNameToSendArray, paymentMethodToSendArray, descriptionToSendArray, meetingStartedTimeForReceipts, meetingDateToSendArray, groupName, emailSetupValue);

                                   /*$.ajax({
							           type: "POST",
							           url: 'http://accountedfor.biz/send/mail1.php',
							           dataType: 'json',
							           data: {"memberBalanceToSendArray":memberBalanceToSendArray, "memberEmailToSendArray":memberEmailToSendArray,"memberNameToSendArray":memberNameToSendArray,"paymentMethodToSendArray":paymentMethodToSendArray,"descriptionToSendArray":descriptionToSendArray,"meetingStartedTime":meetingStartedTimeForReceipts ,"meetingDateToSendArray":meetingDateToSendArray , "groupName":groupName , "emailSetupValue":emailSetupValue},
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
												var sql="UPDATE Receipts SET sent = 1 WHERE id IN ("+ids.join()+")";
												tx.executeSql(sql,null);
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
							           });*/
                        }
                    }
                },errorHandler);
            },errorHandler,nullHandler);


    /*var meetingStartedTimeForReceipts = window.localStorage.getItem("meetingStartedTimeForReceipts");
    var groupName=  window.localStorage.getItem("groupName");
    var meetingTimeFromDB = window.localStorage.getItem("meetingTime");
    var emailSetupValue = window.localStorage.getItem("emailSetupValue");

    if(emailSetupValue == null) {
        emailSetupValue = "bni@bni.com";
    }*/
}

function successfullyConnectionMandrill(obj){
	      
        if(obj[0]['status'] == 'sent'){
	         
	         if(positionActual != totalEmails){
	         	positionActual++;
	         	sendReciepsFromMandrill(totalEmails, positionActual, memberIdToSendArray, memberBalanceToSendArray,memberEmailToSendArray, memberNameToSendArray, paymentMethodToSendArray, descriptionToSendArray, meetingStartedTimeForReceipts, meetingDateToSendArray, groupName, emailSetupValue);
	         }else{
	         	meetingDateToSendArray = [];
                memberBalanceToSendArray = [];
                memberEmailToSendArray = [];
                memberNameToSendArray = [];
                paymentMethodToSendArray = [];
                descriptionToSendArray = [];
                memberIdToSendArray = [];
				db = openDatabase(shortName, version, displayName,maxSize);
				db.transaction(function(tx) {
					var sql="UPDATE Receipts SET sent = 1 WHERE id IN ("+ids.join()+")";
					tx.executeSql(sql,null);
				},errorHandler,nullHandler);
				
                alert("Receipts Sent Successfully..");
				ReloadList();
	         }

           //window.location="settings.html";
	      }else{
	       console.log("Failed to send your receipts, try again later"+obj[0]['status']);
	       alert("Failed to send your receipts, try again later");
	      } 
      }

      function incorrectConnectionMandrill(obj){
         console.log("Failed to send your receipts, try again later "+JSON.stringify(obj));
         alert("Failed to send your receipts, try again later");
         //window.location="settings.html";
      }

function sendReciepsFromMandrill(totalEmails, positionActual, memberIdToSendArray, memberBalanceToSendArray,memberEmailToSendArray, memberNameToSendArray, paymentMethodToSendArray, descriptionToSendArray, meetingStartedTimeForReceipts, meetingDateToSendArray, groupName, emailSetupValue){
    
    var message= '<div style="width:700px; padding:20px; background:#f6f6f6; border:1px solid #ccc; margin:20px auto; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:20px;">'+
        '<table width="100%" border="0" cellspacing="5" cellpadding="10">'+
        '<tr>'+
        '<td width="42%" align="left" valign="top">'+groupName+'<br />'+
        '</td><td colspan="2"  valign="top"><h2 style="padding:0px; margin:0px; margin-bottom:10px;">Sales Receipt</h2>'+
        '<table width="100%" border="0" style="border:1px solid #666;" cellspacing="0" cellpadding="5" align="center">'+
        '<tr>'+
        '<td align="center" style="border-right:1px solid #666; border-bottom:1px solid #666;">Date</td>'+
        '<td align="center" style="border-bottom:1px solid #666;">Invoice No.</td>'+
        '</tr>'+
        '<tr>'+
        '<td align="center"  style="border-right:1px solid #666;">'+meetingDateToSendArray[positionActual]+
        '<td align="center">'+memberIdToSendArray[positionActual]+'</td>'+
        '</tr>'+
        '</table></td>'+
        '</tr>'+
        '<tr>'+
        '<td colspan="3">'+
        '<table width="40%" border="0" cellspacing="0" cellpadding="5"  style="border:1px solid #666;" >'+
        '<tr>'+
        '<td style="border-bottom:1px solid #666;">Sold To</td>'+
        '</tr>'+
        '<tr>'+
        '<td>'+memberNameToSendArray[positionActual]+'</td>'+
        '</tr>'+
        '</table></td>'+
        '</tr>'+
        '<tr>'+
        '<td>Payment was received.</td>'+
        '<td colspan="2" align="right">'+
        '<table width="60%" border="0" style="border:1px solid #666;" cellspacing="0" cellpadding="5" align="right">'+
        '<tr>'+
        '<td align="center" style="border-bottom:1px solid #666;  ">Payment Method</td>'+
        '</tr>'+
        '<tr>'+
        '<td align="center" >'+paymentMethodToSendArray[positionActual]+'</td>'+
        '</tr>'+
        '</table>    </td>'+
        '</tr>'+
        '<tr>'+
        '<td colspan="3">'+
        '<table width="100%" border="0" cellspacing="0" cellpadding="5"  style="border:1px solid #666;" >'+
        '<tr>'+
        '<td width="68%"  style="border-right:1px solid #666; border-bottom:1px solid #666;">Description</td>'+
        '<td width="14%"  style="  border-bottom:1px solid #666;" align="right">Amount </td>'+
        '</tr><tr>'+
                '<td style="border-right:1px solid #666;">'+descriptionToSendArray[positionActual]+' - ' +groupName+'</td>'+
                '<td align="right">'+memberBalanceToSendArray[positionActual]+'</td>'+
                '</tr>'+
	'<tr>'+
        '<td  style="border-right:1px solid #666;">&nbsp;</td>'+
        '<td>&nbsp;</td>'+
        '</tr>'+
        '<tr>'+
        '<td  style="border-right:1px solid #666;">&nbsp;</td>'+
        '<td>&nbsp;</td>'+
        '</tr>'+
        '<tr>'+
        '<td  style="border-right:1px solid #666;">&nbsp;</td>'+
        '<td>&nbsp;</td>'+
        '</tr>'+
        '<tr>'+
        '<td  style="border-right:1px solid #666;">&nbsp;</td>'+
        '<td>&nbsp;</td>'+
        '</tr>'+
        '<tr>'+
        '<td style="border-top:1px solid #666; border-right:1px solid #666;">Thank-you for attending.</td>'+
        '<td style="border-top:1px solid #666;" align="right"> Total: $'+memberBalanceToSendArray[positionActual]+'</td>'+
        '</tr>'+
        '</table>'+
        '</td>'+
        '</tr>'+
        '<tr>'+
        '<td colspan="3" align="left">'+
        '<br />'+
            '</td>'+
        '</tr>'+
        '</table>'+
        '</div>';

        var m = new mandrill.Mandrill('EVe75fwrZLEaW0JZkYxmTQ');
        var params = {
              "message": {
                  "from_email":""+emailSetupValue,
                  "to":[{"email":""+memberEmailToSendArray[positionActual]}],
                  "subject": "Sales Receipt",
                  "html": ""+message
              }
          };
    
    m.messages.send(params,successfullyConnectionMandrill,incorrectConnectionMandrill);
    }





