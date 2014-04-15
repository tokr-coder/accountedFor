 function emailValidation(value) {
    if (/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/.test(value)) {
        return true;
    } else {
        return false;
    }
}

$(document).ready(function() {

      function successfullyConnectionMandrill(obj){
	      console.log("respuesta "+JSON.stringify(obj)); 
	      
        if(obj[0]['status'] == 'sent'){
	         alert("Message sent successfully");
           window.location="settings.html";
	      }else{
	       console.log("Mensaje no enviado reason "+obj[0]['status']);
	      } 
      }

      function incorrectConnectionMandrill(obj){
         console.log("mala "+JSON.stringify(obj));
         alert("Unsent message, please try later");
         window.location="settings.html";
      }
      
      function sendEmail(){
      
      	var m = new mandrill.Mandrill('');
  		
    		var params = {
                "message": {
                    "from_email":"mail@twoviewsstudio.com",
                    "to":[{"email":"apps@twoviewsstudio.com"}],
                    "subject": "Feedback from AccountedFor App",
                    "html": "<p> Name: "+$('#name').val()+"</p></br><p>Email: "+$('#email').val()+"</p></br>"+
                    "<p>Subject: "+$('#subject').val()+"</p></br>"+"<p>Message: "+$('#message').val()+"</p>"+
                    '<p>Version app:'+VersionApp+' </p>';
                }
            };
  		
        m.messages.send(params,successfullyConnectionMandrill,incorrectConnectionMandrill);
      }

      $('#send').click(function(e){
      	e.preventDefault();
      	if( $('#name').val()=="" || $('#message').val() == ""){
      		alert("The field name and messaage are required");
      	}else{

      		if($('#email').val()!=""){
      			if(!emailValidation($('#email').val())){
      				alert("invalid email");
      			}else{
      				sendEmail();
      			}
      		
      		}else{
					sendEmail();
      		}
      	}

      });
                                   
                  
});