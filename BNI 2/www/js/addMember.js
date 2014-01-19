// Put your custom code here
var EditExisting_id;
function onBodyLoadAddMember(){
    fillSelectOptionFromDatabase();
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

function loadClicked(){
	var sel = document.getElementById("selectList");
    var idToLoad = sel.options[sel.selectedIndex].value;
	if(idToLoad == ""){alert("Select a member to edit");}
	else{
        if (!window.openDatabase) {
            alert('Databases are not supported in this browser.');
            return;
        }
        db = openDatabase(shortName, version, displayName,maxSize);
        db.transaction(function(transaction) {
                       transaction.executeSql('SELECT * FROM Members where member_id = ?', [idToLoad],function(transaction, result) {
							if(result != null && result.rows != null){
								var row = result.rows.item(0);
								$('#newMemberFirstName').val(row.member_firstname);
								$('#newMemberLastName').val(row.member_lastname);
								$('#newMemberEmail').val(row.member_email);
								$('#newMemberPhone').val(row.member_phonenumber);
								$('#newMemberComapny').val(row.member_company);
								$('#newMemberBalance').val(row.member_balance);
							}
					   
					   },  loadMemberSuccess(idToLoad), errorCB);
                       },errorHandler,nullHandler);		
	}

}
function loadMemberSuccess(id){
	EditExisting_id=id;
	$('#title').html('Editing Member with id: '+id);
	$('.buttons_s .cancel_outter').css('display','block');
}
function resetForm(){
	EditExisting_id='';
	$('#title').html('Add Member');
	$('.buttons_s .cancel_outter').css('display','none');
	$('#newMemberFirstName').val('');
	$('#newMemberLastName').val('');
	$('#newMemberEmail').val('');
	$('#newMemberPhone').val('');
	$('#newMemberComapny').val('');
	$('#newMemberBalance').val('');

}

function AddValueToDB() {
    //alert("Hi");
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    
    db = openDatabase(shortName, version, displayName,maxSize);
	
	if(EditExisting_id != ''){
        db.transaction(function(transaction) {
                       transaction.executeSql('DELETE FROM Members where member_id = ?', [EditExisting_id], replacesuccess, errorCB);
                       },errorHandler,nullHandler);	
	}
	
    var balance = $('#newMemberBalance').val();
	if(balance == ''){balance=0;}
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

function replacesuccess(){
//alert('deleted id '+ EditExisting_id);
}

function addedSucess(){
    $('#title_message').html("  -  Member Saved").delay(2000).fadeOut();
	$('#selectList').html('<option value="">Name</option>');
	fillSelectOptionFromDatabase();
    resetForm();
    return false;
    
    /*document.getElementById("newMemberFirstName").value = '';
    document.getElementById("newMemberLastName").value = '';
    document.getElementById("newMemberEmail").value = '';
    document.getElementById("newMemberPhone").value = '';
    document.getElementById("newMemberComapny").value = '';*/
};



