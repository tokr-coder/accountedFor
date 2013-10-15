function onBodyLoadGeneralSettings(){

    var meetingFeeTextValue = window.localStorage.getItem("meetingFee");
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
    }

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
        window.localStorage.setItem("meetingFee", mFees);
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
        return false;

    }
    
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
                window.localStorage.setItem("meetingFee", mFees);
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
                window.location.href = "emailSetup.html";
            }

        }else{
            window.location.href = "emailSetup.html";
        }
    }else{
        window.location.href = "emailSetup.html";
    }
}

