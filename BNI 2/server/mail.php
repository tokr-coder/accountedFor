<!-- this file is not used anymore. It was for sending a single receipt -->

<!--http://198.1.74.28/~spaniac1/recepit/mail.php?invoice_no=20&sold_to=Andy Story Odessa Doors Ltd&payment_method=Cash&meeting_date=01-05-2013&products=BNI meeting fee-110.00,GST on Zero Rated sales-100.00&email_to=minu@spaniac.com-->


<?php

   $payment_method = $_POST['payment_method'];
    $meeting_date = $_POST['meeting_date'];
     $products = $_POST['products'];
    $email_to = $_POST['email_to'];
    $balance = $_POST['balance'];
	  $sold_to=$_POST['sold_to'];
          $groupName=$_POST['groupName'];
          $emailSetupValue = $_POST['emailSetupValue'];

$subjects = explode(",", $products);
	   foreach ($subjects as $i => $value) {
	   if($value!=""){
	     $value.'<br />';
	   $getnegfirstpart=0;
	   $getposfirstpart=0;
	   if (strpos($value,'-$') !== false) {
		   $neg_val = explode("-$", $value);
		   foreach ($neg_val as $i => $aaa) {
		   $originalval=$aaa;
		   if($getnegfirstpart==0){
		   $originalval1=$aaa;
		   }
		   $getnegfirstpart++;
		   }
		     '-'.$originalval.'<br />'.$originalval1.'<br />';
		}else{
		$pos_val = explode("$", $value);
		   foreach ($pos_val as $i => $aaa) {
		   $originalval=$aaa;
		   if($getposfirstpart==0){
		   $originalval1=$aaa;
		   }
		   $getposfirstpart++;
		   }
		      '+'.$originalval.'<br />'.$originalval1.'<br />';
		}

	   }
	   }	
	   
	  
$from= $emailSetupValue;		
$subject="Sales Receipt";
$message='<div style="width:700px; padding:20px; background:#f6f6f6; border:1px solid #ccc; margin:20px auto; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:20px;">
<table width="100%" border="0" cellspacing="5" cellpadding="10">
  <tr>
    <td width="42%" align="left" valign="top">'.$groupName.'<br />
      </td>
    <td colspan="2"  valign="top"><h2 style="padding:0px; margin:0px; margin-bottom:10px;">Sales Receipt</h2> 
<table width="100%" border="0" style="border:1px solid #666;" cellspacing="0" cellpadding="5" align="center">
  <tr>
    <td align="center" style="border-right:1px solid #666; border-bottom:1px solid #666;">Date</td>
    <td align="center" style="border-bottom:1px solid #666;">Invoice No.</td>
  </tr>
  <tr>
    <td align="center"  style="border-right:1px solid #666;">'.date('d/m/Y').'</td>
    <td align="center">'.uniqid().'</td>
  </tr>
</table></td>
    </tr>
  
  <tr>
    <td colspan="3">
    <table width="40%" border="0" cellspacing="0" cellpadding="5"  style="border:1px solid #666;" >
  <tr>
    <td style="border-bottom:1px solid #666;">Sold To</td>
  </tr>
  <tr>
    <td>'.$sold_to.'</td>
  </tr>
</table>    </td>
    </tr>
  <tr>
  <td>Meeting Date: '.$meeting_date.' </td>
    <td colspan="2" align="right">
    <table width="60%" border="0" style="border:1px solid #666;" cellspacing="0" cellpadding="5" align="right">
  <tr>
    <td align="center" style="border-bottom:1px solid #666;  ">Payment Method</td>
    </tr>
  <tr>
    <td align="center" >'.$payment_method.'</td>
    </tr>
</table>    </td>
    </tr>
  <tr>
    <td colspan="3">
    <table width="100%" border="0" cellspacing="0" cellpadding="5"  style="border:1px solid #666;" >
  <tr>
    <td width="68%"  style="border-right:1px solid #666; border-bottom:1px solid #666;">Description</td>
    <td width="14%"  style="  border-bottom:1px solid #666;" align="right">Amount </td>
  </tr>';
  $getthefulltotal=0;
  foreach ($subjects as $i => $value) {
	   if($value!=""){
	     $getnegfirstpart=0;
	     $getposfirstpart=0;
	    
	   
	   if (strpos($value,'-$') !== false) {
		   $neg_val = explode("-$", $value);
		   foreach ($neg_val as $i => $aaa) {
		   $originalval='$'.$aaa;
		   if($getnegfirstpart==0){
		   $originalval1=$aaa;
		   }else{
		   $getthefulltotal=$getthefulltotal+$aaa;
		   }
		   $getnegfirstpart++;
		   }
		    
		}else{
		   $pos_val = explode("+$", $value);
		   foreach ($pos_val as $i => $aaa) {
		   $originalval='$'.$aaa;
		   if($getposfirstpart==0){
		   $originalval1=$aaa;
		   }else{
		   $getthefulltotal=$getthefulltotal+$aaa;
		   }
		   $getposfirstpart++;
		   }
		      
		}

if (strpos($originalval1,'Paid To') !== false) {
}else{
   $originalval1 = "Meeting Fees";
}
   
 $message .=' <tr>
    <td style="border-right:1px solid #666;">'.$originalval1.'</td>
    <td align="right">'.$originalval.'</td>
  </tr>';
  
  
  }}
  
 $message .='  <tr>
    <td  style="border-right:1px solid #666;">&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td  style="border-right:1px solid #666;">&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td  style="border-right:1px solid #666;">&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td  style="border-right:1px solid #666;">&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td style="border-top:1px solid #666; border-right:1px solid #666;">&nbsp;</td>
    <td style="border-top:1px solid #666;" align="right" nowrap > Total: $'.number_format($getthefulltotal,2).'</td>
  </tr>
</table>

    </td>
    </tr>
    
     <tr>
    <td colspan="3" align="left">
    <br />
      </td>
     </tr>
</table>

</div>';
 
 $to= $email_to;
$headers .= "Reply-To:".$from." <".$from.">\r\n"; 
    $headers .= "Return-Path: ".$from." <".$from.">\r\n"; 
    $headers .= "From: Sales Receipt<".$from.">\r\n"; 
    $headers .= "Organization: http://openseed.com.au/\r\n"; 
    $headers .= "Content-type:text/html;charset=iso-8859-1\r\n"; 
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "X-Mailer: php";
if($getthefulltotal > 0){
 mail($to,$subject,$message,$headers);
}
$response['status'] ="ok";

    echo json_encode($response);
?>
 