// Put your custom code here

function onBodyLoadRemoveMember(){
    
    fillSelectOptionFromDatabase();
}

function cancelPressedInRemoveMember() {
    var list = document.getElementById("selectList");
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
                                          
                                          $('#selectList').append($("<option></option>").attr("value",row.member_id).text(fullName));
                                          
                                    }
                                }
                        },errorHandler);
            },errorHandler,nullHandler);
}

function removeClicked(){
    var sel = document.getElementById("selectList");
    var idToDelete = sel.options[sel.selectedIndex].value;

    if(idToDelete == ""){
        alert("Select a member to delete");
    }else{
        
        if (!window.openDatabase) {
            alert('Databases are not supported in this browser.');
            return;
        }
        db = openDatabase(shortName, version, displayName,maxSize);
        db.transaction(function(transaction) {
                       transaction.executeSql('DELETE FROM Members where member_id = ?', [idToDelete],  removeMemberSuccess, errorCB);
                       },errorHandler,nullHandler);
   }
    
}

function removeMemberSuccess (tx, resultset){
    alert("Member Removed");
    location.reload();
    return false;
};



