// Put your custom code here

function onBodyLoadAddMember(){
    
}

function SubmitPressed() {
   
    if($('#newMemberFirstName').val()==""){
        alert("Enter First Name");
    }else if($('#newMemberLastName').val()=="") {
        alert("Enter Last Name");
    }else if($('#newMemberEmail').val()=="") {
        alert("Enter Email");
    }else{
        AddValueToDB();
    }
    
}

function ValidateEmail(inputText)
{		
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    
    if(inputText.match(pattern) == null){
        return false;
    }else{
        return true;
    }
}


function AddValueToDB() {
    //alert("Hi");
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    
    db = openDatabase(shortName, version, displayName,maxSize);
    var balance = 0;
    var checkintime = "No";
    var active = 0;
    
    var phoneNumber = $('#newMemberPhone').val();
    var CompanyValue = $('#newMemberComapny').val();
    
    if(phoneNumber=="") {
        phoneNumber = "NO";
    }else if(CompanyValue=="") {
       CompanyValue = "NO";
    }
    
    db.transaction(function(transaction) {
                   transaction.executeSql('INSERT INTO Members(member_firstname, member_lastname,member_email,member_phonenumber,member_company,member_balance,member_checkintime,member_active) VALUES (?,?,?,?,?,?,?,?)',[$('#newMemberFirstName').val(), $('#newMemberLastName').val(), $('#newMemberEmail').val(), phoneNumber, CompanyValue, balance, checkintime, active],addedSucess,errorHandler);
                   });

   
    return false;
}

function addedSucess(){
    alert("Member Saved");
    location.reload();
    return false;
    
    /*document.getElementById("newMemberFirstName").value = '';
    document.getElementById("newMemberLastName").value = '';
    document.getElementById("newMemberEmail").value = '';
    document.getElementById("newMemberPhone").value = '';
    document.getElementById("newMemberComapny").value = '';*/
};



