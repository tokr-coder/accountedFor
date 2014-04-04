// Put your custom code here


function onBodyLog(){
    
    listLogIntoTable();
}


function listLogIntoTable() {
    // alert("List Members");
    
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {
                   transaction.executeSql('SELECT * FROM Members ORDER BY member_balance DESC;', [],function(transaction, result) {
                         if (result != null && result.rows != null) {
                                //alert(result.rows.length);
                                var count = 1;
                                for (var i = 0; i < result.rows.length; i++) {
                                    
                                    var row = result.rows.item(i);
                                    var fname = row.member_firstname;
                                    var lname = row.member_lastname;
                                    var names = [fname, lname];
                                    var fullName = names.join(' ');
                                          
                                    var balanceFromDB = parseFloat(row.member_balance);
                                       
                                   // if(balanceFromDB <= 0){
                                           $('#MemberList').append('<ul><li class="wid2">'+ fullName +'</li><li class="wid2" style="border-right:none;">'+ balanceFromDB +'</li></ul>');
                                          count =count+1;
                                    //}
                                }
                                          
                            }
                        },errorHandler);
                   },errorHandler,nullHandler);
    return;
    
}








