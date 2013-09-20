// Put your custom code here


function onBodyLog(){
    
    listLogIntoTable();
}


function ClearLogPressed() {
 
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
                   transaction.executeSql('DELETE  FROM Log', [],function(transaction, result) {
                                          
                                          alert("Log Cleared");
                                          location.reload();
                                          return false;
                                          
                                          },errorHandler);
                   },errorHandler,nullHandler);
 
}

function listLogIntoTable() {
    // alert("List Members");
    
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
                               var logbalance =row.log_balance;
                               var logPaidBy = row.log_paidBy;
                               
                               var balanceInDollaer;
                               
                               if(logbalance == "-") {
                                   balanceInDollaer = logbalance;
                               }else{
                                   balanceInDollaer = "$"+logbalance;
                               }
                               
                               /*alert(logDate);
                               alert(logTime);
                               alert(logName);
                               alert(logVisitor);
                               alert(logbalance);
                               alert(logPaidBy);*/
                               
                              
                
                               if(logVisitor == 0){
                               $('#LogList').append('<ul><li class="wid6_l"><div class="plus">+</div></li><li class="wid1_l">'+logDate+'</li><li class="wid1_l">'+logTime+'</li><li class="wid2_l">'+logName+'</li><li class="wid4_l"><div class="check_box_l"><input type="checkbox" disabled = "disabled"/></div></li><li class="wid2_l">'+logAction+'</li><li class="wid2_l">'+balanceInDollaer+'</li><li class="wid2_l" style="border-right:none;">'+logPaidBy+'</li><li class="wid6_l"><div class="undo" onClick="divClosePressed((this.id))" id="'+row.log_id+'">Delete</div></li></ul>');
                               }else {
                               $('#LogList').append('<ul><li class="wid6_l"><div class="plus">+</div></li><li class="wid1_l">'+logDate+'</li><li class="wid1_l">'+logTime+'</li><li class="wid2_l">'+logName+'</li><li class="wid4_l"><div class="check_box_l"><input type="checkbox" disabled = "disabled" checked/></div></li><li class="wid2_l">'+logAction+'</li><li class="wid2_l">'+balanceInDollaer+'</li><li class="wid2_l" style="border-right:none;">'+logPaidBy+'</li><li class="wid6_l"><div class="undo" onClick="divClosePressed((this.id))" id="'+row.log_id+'">Delete</div></li></ul>');
                               }
                               
                               
                        }
                    }
                },errorHandler);
            },errorHandler,nullHandler);
    return;
    
}

function divClosePressed(clicked_id){
    
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
                   transaction.executeSql('SELECT * FROM Log where log_id = ?', [clicked_id],function(transaction, result) {
                            if (result != null && result.rows != null) {
                                    for (var i = 0; i < result.rows.length; i++) {
                                          var row = result.rows.item(i);
                                          
                                          var memberIdInLogTable = row.memberInLogId;
                                          var AmountTochange = row.changeAmount;
                                          var SignOrPay = row.signinOrPay;
                                          
//                                          alert(memberIdInLogTable);
//                                          alert(AmountTochange);
//                                          alert(SignOrPay);
                                          
                                          if(SignOrPay == 0){
                                             updateMemberDetailsForPay(memberIdInLogTable,AmountTochange,clicked_id);
                                          }else if(SignOrPay == 1){
                                             updateMemberDetailsForSignIn(memberIdInLogTable,AmountTochange,clicked_id);
                                          }else if(SignOrPay == 2){
                                             updateMemberDetailsForSignInToSignOut(memberIdInLogTable,AmountTochange,clicked_id);
                                          }else if(SignOrPay == 3){
                                            deleteLogEntryfromTable(clicked_id)
                                          }
                                          
                                          
                                        }
                                }
                     },errorHandler);
    },errorHandler,nullHandler);
    
}

function updateMemberDetailsForSignInToSignOut(memberIdInLogTable,AmountTochange,clicked_id) {
    
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    
    var active = 0;
    
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
                   transaction.executeSql('SELECT * FROM Members where member_id = ?', [memberIdInLogTable],function(transaction, result) {
                                          if (result != null && result.rows != null) {
                                          for (var i = 0; i < result.rows.length; i++) {
                                          var row = result.rows.item(i);
                                          
                                          var memberbalanceToChange = row.member_balance;
                                          var newMemberBalance = parseFloat(memberbalanceToChange) + parseFloat(AmountTochange);
                                          
                                          db.transaction(function(transaction) {
                                                         transaction.executeSql('UPDATE Members SET  member_active=?  where member_id = ?', [active,memberIdInLogTable],  deleteLogEntryfromTable(clicked_id), errorCB);
                                                         },errorHandler,nullHandler);
                                          
                                          }
                                          }
                                          },errorHandler);
                   },errorHandler,nullHandler);
    
}


function updateMemberDetailsForSignIn(memberIdInLogTable,AmountTochange,clicked_id) {
    
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
                   transaction.executeSql('SELECT * FROM Members where member_id = ?', [memberIdInLogTable],function(transaction, result) {
                            if (result != null && result.rows != null) {
                                for (var i = 0; i < result.rows.length; i++) {
                                          var row = result.rows.item(i);
                                          
                                          var memberbalanceToChange = row.member_balance;
                                          var newMemberBalance = parseFloat(memberbalanceToChange) + parseFloat(AmountTochange);
                                          
                                          db.transaction(function(transaction) {
                                                         transaction.executeSql('UPDATE Members SET  member_balance=?  where member_id = ?', [newMemberBalance,memberIdInLogTable],  deleteLogEntryfromTable(clicked_id), errorCB);
                                                         },errorHandler,nullHandler);
                                          
                                    }
                                }
                        },errorHandler);
        },errorHandler,nullHandler);
    
}

function updateMemberDetailsForPay(memberIdInLogTable,AmountTochange,clicked_id) {
    
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
                   transaction.executeSql('SELECT * FROM Members where member_id = ?', [memberIdInLogTable],function(transaction, result) {
                                          if (result != null && result.rows != null) {
                                          for (var i = 0; i < result.rows.length; i++) {
                                          var row = result.rows.item(i);
                                          
                                          var memberbalanceToChange = row.member_balance;
                                          var newMemberBalance = parseFloat(memberbalanceToChange) - parseFloat(AmountTochange);
                                          
                                          db.transaction(function(transaction) {
                                                         transaction.executeSql('UPDATE Members SET  member_balance=?  where member_id = ?', [newMemberBalance,memberIdInLogTable],  deleteLogEntryfromTable(clicked_id), errorCB);
                                                         },errorHandler,nullHandler);
                                          
                                          }
                                          }
                                          },errorHandler);
                   },errorHandler,nullHandler);
    
}

function deleteLogEntryfromTable(clicked_id) {
    
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
                   transaction.executeSql('DELETE  FROM Log where log_id = ?', [clicked_id],function(transaction, result) {
                                alert("Undo Sucessfull");
                                location.reload();
                                return false;
                                
                    },errorHandler);
    },errorHandler,nullHandler);
}








