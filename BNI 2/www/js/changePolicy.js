function onBodyLoadChangePolicy(){

	db = openDatabase(shortName, version, displayName,maxSize);
  db.transaction(function(transaction) {  

      var sql = 'SELECT * FROM Settings';
      
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length > 0) {
                      window['Groups']=true;
                        for (var i = 0; i < result.rows.length; i++) {
                               var row = result.rows.item(i);
                               if(row.policy == null){
                                 $('#policy').html('We respect your right to privacy and wish to make you aware of how we will handle your personal information. By providing us with your personal information, you agree that we may collect your Personal Information (as defined by the Federal Personal Information Protection and Electronic Documents Act. PIPEDA) and may do the following with your personal information.\n\n'+
                                                   '1) Disclose your personal information to our organization (and you also consent to the collection of your personal information by this organization.)\n\n'+
                                                   '2) Use your personal information to advise you of upcoming events and promotions.\n\n'+
                                                   'In agreeing to the above, you acknowledge that the Privacy Laws, as set out in PIPEDA, do not apply to the collection, use and disclosure of your Personal Information by any of the entities named above. Notwithstanding the above, our group, will not sell or disclose your Personal Information in a list form to any other company or entity');
                               }else{
                                $('#policy').html(row.policy);
                               }
                        }
                    }
                    else{
                           $('#policy').html('We respect your right to privacy and wish to make you aware of how we will handle your personal information. By providing us with your personal information, you agree that we may collect your Personal Information (as defined by the Federal Personal Information Protection and Electronic Documents Act. PIPEDA) and may do the following with your personal information.\n\n'+
                                                   '1) Disclose your personal information to our organization (and you also consent to the collection of your personal information by this organization.)\n\n'+
                                                   '2) Use your personal information to advise you of upcoming events and promotions.\n\n'+
                                                   'In agreeing to the above, you acknowledge that the Privacy Laws, as set out in PIPEDA, do not apply to the collection, use and disclosure of your Personal Information by any of the entities named above. Notwithstanding the above, our group, will not sell or disclose your Personal Information in a list form to any other company or entity');
                        }
                },errorHandler);
            },errorHandler,nullHandler);

}

  function insertSetting(){
    if(window['Groups']){
      db.transaction(function(transaction) {
        transaction.executeSql('UPDATE Settings SET policy=? where setting_id = ?', [$('#policy').val(), 1 ],function(){
            alert("Update");
            window.location.href = "settings.html";
        },errorCB);
        },errorHandler,nullHandler);

    }else{
      alert("You must first complete the basic configuration ");
      window.location.href = "generalSettings.html";
    }
    
} 
  
  

$(document).ready(function() {

  $('#resetPolicy').on('click',function(event){
      event.preventDefault();
      $('#policy').html('We respect your right to privacy and wish to make you aware of how we will handle your personal information. By providing us with your personal information, you agree that we may collect your Personal Information (as defined by the Federal Personal Information Protection and Electronic Documents Act. PIPEDA) and may do the following with your personal information.\n\n'+
                                                   '1) Disclose your personal information to our organization (and you also consent to the collection of your personal information by this organization.)\n\n'+
                                                   '2) Use your personal information to advise you of upcoming events and promotions.\n\n'+
                                                   'In agreeing to the above, you acknowledge that the Privacy Laws, as set out in PIPEDA, do not apply to the collection, use and disclosure of your Personal Information by any of the entities named above. Notwithstanding the above, our group, will not sell or disclose your Personal Information in a list form to any other company or entity');
      insertSetting();
  });

  $('#savePolicy').on('click',function(event){
      event.preventDefault();
      if($('#policy').val()==""){
        alert("Privacy policy can not be empty");
      }else
      insertSetting();
      //console.log(" guardando el valor de la politica "+$('#policy').val());
  });

});

