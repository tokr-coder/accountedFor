
$(document).ready(function() {
                  $('input[type="email"]').keyup(function() {
                                                if($('#emailSetupText').val() != ''){
                                                $('input[type="button"]').removeAttr('disabled');
                                                }
                                                });
                                   
                  
                  });

function onBodyLoadEmailSetup(){
    
    var emailSetupValue = window.localStorage.getItem("emailSetupValue");
    
    if(emailSetupValue == null) {
        document.getElementById("emailSetupText").value = "bni@bni.com";
    }else{
        document.getElementById("emailSetupText").value = emailSetupValue;
    }
}


function clearButtonPressedInEmailSetup() {
    window.location.href = "settings.html";
    return false;
}

function savePressedInEmailSetup() {
    
    var emailSetupValue = $('#emailSetupText').val();
    
    if(emailSetupValue == "") {
        alert("Enter email!");
    }else{
        window.localStorage.setItem("emailSetupValue", emailSetupValue);
        alert("Saved");
        
        location.reload();
        return false;

    }
    
}
