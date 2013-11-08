
function onBodyVisitorReport(){
    
    listVisitorTable();
}

function listVisitorTable() {
    
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    
    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {

      var sql = 'SELECT name, COUNT(name) as numberVisit, email, company, phone, signature, meetingdate FROM Visitors WHERE meetingdate >('+dateSixMonthsAgo(6)+') GROUP By name ORDER BY numberVisit DESC';
      
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result != null && result.rows != null) {
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);
                              
                               var name = row.name;
                               var email =row.email;
                               var phone =row.phone;
                               var company =row.company;
                               var signature =row.signature;
                               var meetingdate =row.meetingdate;
                               var numberVisit = row.numberVisit;
                               if(company.length == 0)
                                company = '-';
                               if(phone.length == 0)
                                phone = '-';
                               
                              $('#VisitorList').append('<ul><li class="wid1_6">'+name+'</li><li class="wid1_6">'+email+'</li><li class="wid1_5">'+company+'</li><li class="wid1_6">'+phone+'</li><li class="wid1_l">'+numberVisit+'</li></ul>');
                        }
                    }
                },errorHandler);
            },errorHandler,nullHandler);
    return;
    
}

function dateSixMonthsAgo(months){

  var date = new Date();
        var  y = date.getFullYear();
        var  m = date.getMonth();
        var  d = date.getDate();
        
        m=m+1;
        if(d<10)
           d = "0"+d; 
        if(m<10)
         m="0"+m;

       m = m - months;
       if(m<0){
        m = 12 - m;
        y = y -1;
       }
       if(m<10)
         m="0"+m;

      var sixMonthsAgo= d+"/"+m+"/"+y; 
      console.log("date sixMonthsAgo"+ sixMonthsAgo);
                
      return sixMonthsAgo;

}
