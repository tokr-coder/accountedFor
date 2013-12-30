
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

      var sql = 'SELECT * FROM Settings';
      
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length > 0) {
                        for (var i = 0; i < result.rows.length; i++) {
                               var row = result.rows.item(i);
                               window['Groups']=true;
                               document.getElementById("emailSetupText").value = row.email;
                               console.log("On load email");
                        }
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
            transaction.executeSql('INSERT INTO Settings(email) VALUES (?)',[emailSetupValue],function (){
                alert("Saved");
                console.log("se agrego el email");
                window.location.href = "generalSettings.html";
            },errorHandler);
            });

        }else{
            db.transaction(function(transaction) {
                transaction.executeSql('UPDATE Settings SET email=? where setting_id = ?', [emailSetupValue, 1 ],function(){
                console.log("se actualizo la fila de settings");
                alert("Saved");
                window.location.href = "generalSettings.html";
                },errorCB);
            },errorHandler,nullHandler);    
        
        }
    }
});

