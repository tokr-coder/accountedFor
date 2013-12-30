function onBodyLoadGeneralSettings(){

    db = openDatabase(shortName, version, displayName,maxSize);
    db.transaction(function(transaction) {  

      var sql = 'SELECT * FROM Settings';
      
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length > 0) {
                        for (var i = 0; i < result.rows.length; i++) {
                               window['Groups']=true;
                               var row = result.rows.item(i);
                               document.getElementById("meetingFeeEntered").value = row.meetingFee ;
                               document.getElementById("Groupname").value = row.nameGroup;
                               document.getElementById("meetingTime").value = row.meetingTime;
                               if(!row.meetingPayForVisitor) document.getElementById("visitorAllow").checked = false;
                               if(!row.meetingRequireSig) document.getElementById("requireSig").checked = false;
                               emailSetting = row.email;
                        }
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

    /*var meetingFeeTextValue = window.localStorage.getItem("meetingFee");
    var meetingGroupTextValue = window.localStorage.getItem("groupName");
    var meetingTimeTextValue = window.localStorage.getItem("meetingTime");
    var meetingPayForVisitor = window.localStorage.getItem("visitorAllow");
    var meetingRequireSig = window.localStorage.getItem("requireSig");
    
    if(meetingFeeTextValue != null && meetingGroupTextValue != null && meetingTimeTextValue != null && meetingPayForVisitor != null) {
       document.getElementById("meetingFeeEntered").value = meetingFeeTextValue ;
        document.getElementById("Groupname").value = meetingGroupTextValue;
        document.getElementById("meetingTime").value = meetingTimeTextValue;
		if(meetingPayForVisitor == "0") document.getElementById("visitorAllow").checked = false;
		if(meetingRequireSig == "0") document.getElementById("requireSig").checked = false;
    } else {
        document.getElementById("meetingFeeEntered").value = '';
        document.getElementById("Groupname").value = '';
        document.getElementById("meetingTime").value = '';
		document.getElementById("visitorAllow").checked = true;
		document.getElementById("requireSig").checked = true;
    }*/

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
            insertSetting();

        }else{
            //update
            updateSetting();
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
        
        alert("Saved");
        window.location.href = "settings.html";
        return false;*/

    }
    
}

function insertSetting(){
    console.log("insert setting");
    if(document.getElementById("visitorAllow").checked == true){
            var meetingPayForVisitor =  true;
    }else{
        var meetingPayForVisitor =  false;
    }
    
    if(document.getElementById("requireSig").checked == true){
        var meetingRequireSig = true;
    }else{
        var meetingRequireSig = false;
    }
    db.transaction(function(transaction) {
            transaction.executeSql('INSERT INTO Settings(nameGroup, meetingFee,meetingTime,meetingPayForVisitor,meetingRequireSig,imageURI,email) VALUES (?,?,?,?,?,?,?)',[$('#Groupname').val(),$('#meetingFeeEntered').val(),$('#meetingTime').val(),meetingPayForVisitor,meetingRequireSig,iconImg,emailSetting],function (){
                alert("Saved");
                console.log("se agrego la configuracio");
                window.location.href = "settings.html";
            },errorHandler);
            });
}

function insertSettingFromEmail(){
    console.log("insert setting");
    if(document.getElementById("visitorAllow").checked == true){
            var meetingPayForVisitor =  true;
    }else{
        var meetingPayForVisitor =  false;
    }
    
    if(document.getElementById("requireSig").checked == true){
        var meetingRequireSig = true;
    }else{
        var meetingRequireSig = false;
    }
    db.transaction(function(transaction) {
            transaction.executeSql('INSERT INTO Settings(nameGroup, meetingFee,meetingTime,meetingPayForVisitor,meetingRequireSig,imageURI,email) VALUES (?,?,?,?,?,?,?)',[$('#Groupname').val(),$('#meetingFeeEntered').val(),$('#meetingTime').val(),meetingPayForVisitor,meetingRequireSig,iconImg,emailSetting],function (){
                alert("Saved");
                console.log("se agrego la configuracio");
                window.location.href = "emailSetup.html";
            },errorHandler);
            });
}

function updateSetting(){
    console.log("update setting");
    if(document.getElementById("visitorAllow").checked == true){
            var meetingPayForVisitor =  true;
    }else{
        var meetingPayForVisitor =  false;
    }
    
    if(document.getElementById("requireSig").checked == true){
        var meetingRequireSig = true;
    }else{
        var meetingRequireSig = false;
    }
    
    db.transaction(function(transaction) {
        transaction.executeSql('UPDATE Settings SET meetingFee=? , nameGroup=? , meetingTime=?, meetingPayForVisitor=? , meetingRequireSig=?, imageURI=?, email=? where setting_id = ?', [$('#meetingFeeEntered').val(),$('#Groupname').val(),$('#meetingTime').val(),meetingPayForVisitor,meetingRequireSig,iconImg,emailSetting, 1 ],function(){
            console.log("se actualizo la fila de settings");
            alert("Update");
            window.location.href = "settings.html";
        },errorCB);
        },errorHandler,nullHandler);

}

function updateSettingFromEmail(){
    console.log("update setting");
    if(document.getElementById("visitorAllow").checked == true){
            var meetingPayForVisitor =  true;
    }else{
        var meetingPayForVisitor =  false;
    }
    
    if(document.getElementById("requireSig").checked == true){
        var meetingRequireSig = true;
    }else{
        var meetingRequireSig = false;
    }
    
    db.transaction(function(transaction) {
        transaction.executeSql('UPDATE Settings SET meetingFee=? , nameGroup=? , meetingTime=?, meetingPayForVisitor=? , meetingRequireSig=?, imageURI=?, email=? where setting_id = ?', [$('#meetingFeeEntered').val(),$('#Groupname').val(),$('#meetingTime').val(),meetingPayForVisitor,meetingRequireSig,iconImg,emailSetting, 1 ],function(){
            console.log("se actualizo la fila de settings");
            alert("Update");
            window.location.href = "emailSetup.html";
        },errorCB);
        },errorHandler,nullHandler);

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
                    insertSettingFromEmail();

                }else{
                    //update
                    updateSettingFromEmail();
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

