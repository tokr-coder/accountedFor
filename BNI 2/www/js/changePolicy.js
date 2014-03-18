function onBodyLoadChangePolicy(){

	db = openDatabase(shortName, version, displayName,maxSize);
  db.transaction(function(transaction) {  

      var sql = 'SELECT * FROM Setting';
      
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length > 6) {
                      window['Groups']=true;
                         if(result.rows.item(7).value == 'none'){
                           $('#policy').html(defaultPolicy.replace(/<br><br>/g,"\n\n"));
                         }else{
                          $('#policy').html(result.rows.item(7).value.replace(/<br><br>/g,"\n\n"));
                         }
                    }
                    else{
                           $('#policy').html(defaultPolicy.replace(/<br><br>/g,"\n\n"));
                        }
                },errorHandler);
            },errorHandler,nullHandler);
}

  function updatePolicy(){
    if(window['Groups']){
      db.transaction(function(transaction) {
        defaultPolicy = $('#policy').val();
        transaction.executeSql('UPDATE Setting SET value=? where id = ?', [defaultPolicy.replace(/\n\n/g,"<br><br>"), 8],function(){
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
      $('#policy').val(''+defaultPolicy.replace(/\n\n/g,"<br><br>"));
      updatePolicy();
  });

  $('#savePolicy').on('click',function(event){
      event.preventDefault();
      if($('#policy').val()==""){
        alert("Privacy policy can not be empty");
      }else
      updatePolicy();
  });

});

