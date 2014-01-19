
$(document).ready(function() {
                  $('input[type="email"]').keyup(function() {
                                                if($('#saveEmail').val() != ''){
                                                $('#saveEmail').removeAttr('disabled');
                                                }
                                                });
                                   
                  
                  });

function onBodyLoadEmailSetup(){
    
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {  

      var sql = 'SELECT * FROM Setting';
      
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length > 6) {
                               window['Groups']=true;
                               document.getElementById("emailSetupText").value = result.rows.item(6).value;
                               console.log("On load email");
                        
                    }else{
                       
                        window['Groups']=false;
                        document.getElementById("emailSetupText").value = emailSetting;

                    }
                },errorHandler);
            },errorHandler,nullHandler);
}


function clearButtonPressedInEmailSetup() {
    window.location.href = "generalSettings.html";
    return false;
}


$('#saveEmail').click(function(event){
    event.preventDefault();
    var emailSetupValue = $('#emailSetupText').val();
    
    if(emailSetupValue == "") {
        alert("Enter email!");
    }else{
        
        if(!window['Groups']){
            db.transaction(function(transaction) {
            transaction.executeSql('INSERT INTO Setting (id, nameSetting, value) VALUES (?,?,?)',[7,'email',emailSetupValue ],function (){
                alert("Saved");
                console.log("se agrego el email");
                window.location.href = "generalSettings.html";
            },errorHandler);
            });

        }else{
            db.transaction(function(transaction) {
                transaction.executeSql('UPDATE Setting SET value=? where id = ?', [emailSetupValue, 7 ],function(){
                console.log("se actualizo la fila de settings");
                alert("Saved");
                window.location.href = "generalSettings.html";
                },errorCB);
            },errorHandler,nullHandler);    
        
        }
    }
});

