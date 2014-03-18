function onBodyLoadGeneralSettings(){

    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {  

      var sql = 'SELECT * FROM Setting';
      
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length > 6) {
                               window['Groups']=true;
                               //var row = result.rows.item(i);
                               document.getElementById("meetingFeeEntered").value = result.rows.item(1).value;
                               document.getElementById("Groupname").value = result.rows.item(0).value;
                               document.getElementById("meetingTime").value = result.rows.item(2).value
                               if(result.rows.item(3).value == 'false') document.getElementById("visitorAllow").checked = false;
                               if(result.rows.item(4).value == 'false') document.getElementById("requireSig").checked = false;
                               emailSetting = result.rows.item(6).value;
                        
                    }else{
                        document.getElementById("meetingFeeEntered").value = '';
                        document.getElementById("Groupname").value = '';
                        document.getElementById("meetingTime").value = '';
                        document.getElementById("visitorAllow").checked = true;
                        document.getElementById("requireSig").checked = true;
                        window['Groups']=false;

                    }
                },errorHandler);
            },errorHandler,nullHandler);

}


function saveClicked() {
    //alert($('#meetingFeeEntered').val());
    var mFees = $('#meetingFeeEntered').val();
    var groupName = $('#Groupname').val();
    var meetingTime = $('#meetingTime').val();
    
    if(groupName == ""){
        alert("Enter Group Name !!");
    }else if(mFees == ""){
         alert("Enter meeting fee !!");
    }else if(meetingTime == ""){
        alert("Enter meeting Time !!");
    }else {
        
        
        if(!window['Groups']){
            //insert
            insertIntoDB('settings.html');

        }else{
            //update
            updateIntoDB('settings.html');
        }
        
    }
    
}

function insertIntoDB(redirects){
    if(document.getElementById("visitorAllow").checked == true){
            var meetingPayForVisitor =  'true';
    }else{
        var meetingPayForVisitor =  'false';
    }
    
    if(document.getElementById("requireSig").checked == true){
        var meetingRequireSig = 'true';
    }else{
        var meetingRequireSig = 'false';
    }

    db.transaction(function(transaction) {
        transaction.executeSql('INSERT INTO Setting(id, nameSetting, value) VALUES (?,?,?)',[1,'nameGroup',$('#Groupname').val()]);
        transaction.executeSql('INSERT INTO Setting(id, nameSetting, value) VALUES (?,?,?)',[2,'meetingFee',$('#meetingFeeEntered').val()]); 
        transaction.executeSql('INSERT INTO Setting(id, nameSetting, value) VALUES (?,?,?)',[3,'meetingTime',$('#meetingTime').val()]);
        transaction.executeSql('INSERT INTO Setting(id, nameSetting, value) VALUES (?,?,?)',[4,'meetingPayForVisitor',meetingPayForVisitor]);
        transaction.executeSql('INSERT INTO Setting(id, nameSetting, value) VALUES (?,?,?)',[5,'meetingRequireSig',meetingRequireSig]);
        transaction.executeSql('INSERT INTO Setting(id, nameSetting, value) VALUES (?,?,?)',[6,'imageURI',iconImg]);
        transaction.executeSql('INSERT INTO Setting(id, nameSetting, value) VALUES (?,?,?)',[7,'email',emailSetting]);
        transaction.executeSql('INSERT INTO Setting(id, nameSetting, value) VALUES (?,?,?)',[8,'policy','none']);

            alert("Saved");
            window.location.href = redirects;
        },errorHandler);
}

function updateIntoDB(redirects){
    if(document.getElementById("visitorAllow").checked == true){
            var meetingPayForVisitor =  'true';
    }else{
        var meetingPayForVisitor =  'false';
    }
    
    if(document.getElementById("requireSig").checked == true){
        var meetingRequireSig = 'true';
    }else{
        var meetingRequireSig = 'false';
    }

    db.transaction(function(transaction) {
        transaction.executeSql('UPDATE Setting SET value=? where id = ?', [$('#Groupname').val(), 1 ]);
        transaction.executeSql('UPDATE Setting SET value=? where id = ?', [$('#meetingFeeEntered').val(), 2 ]);
        transaction.executeSql('UPDATE Setting SET value=? where id = ?', [$('#meetingTime').val(), 3 ]);
        transaction.executeSql('UPDATE Setting SET value=? where id = ?', [meetingPayForVisitor, 4 ]);
        transaction.executeSql('UPDATE Setting SET value=? where id = ?', [meetingRequireSig, 5 ]);
            alert("Update");
            window.location.href = redirects;
        },errorHandler);
}

function cancelClicked(){
    window.location.href = "settings.html";
}


function emailSetupClicked() {
    var mFees = $('#meetingFeeEntered').val();
    var groupName = $('#Groupname').val();
    var meetingTime = $('#meetingTime').val();
    
    if(mFees != "" || groupName != ""|| meetingTime != ""){
        
        var retVal = confirm("Do you want to save settings ?");
        if( retVal == true ){
            
            if(groupName == ""){
                alert("Enter Group Name !!");
            }else if(mFees == ""){
                alert("Enter meeting fee !!");
            }else if(meetingTime == ""){
                alert("Enter meeting Time !!");
            }else {
                
                if(!window['Groups']){
                    //insert
                    insertIntoDB('emailSetup.html');

                }else{
                    //update
                    updateIntoDB('emailSetup.html');
                }
                /*window.localStorage.setItem("meetingFee", mFees);
                window.localStorage.setItem("groupName", groupName);
                window.localStorage.setItem("meetingTime", meetingTime);
                
                
                if(document.getElementById("visitorAllow").checked == true){
                    window.localStorage.setItem("visitorAllow", "1");
                }else{
                    window.localStorage.setItem("visitorAllow", "0");
                }
                if(document.getElementById("requireSig").checked == true){
                    window.localStorage.setItem("requireSig", "1");
                }else{
                    window.localStorage.setItem("requireSig", "0");
                }
                window.location.href = "emailSetup.html";*/

            }

        }else{
            window.location.href = "emailSetup.html";
        }
    }else{
        window.location.href = "emailSetup.html";
    }
}

