<?php

$from = $_POST['emailSetupValue'];
$groupName = $_POST['groupName'];
$meetingTimeFromDB = $_POST['meeting_date'];
$memberEmailToSend = $_POST['email_to'];   
$memberNameToSendArray = $_POST['memberNameToSendArray'];
$memberEmailToSendArray = $_POST['memberEmailToSendArray'];
$memberPhoneToSendArray = $_POST['memberPhoneToSendArray'];
$memberBalanceToSendArray = $_POST['memberBalanceToSendArray'];
$memberCheckInTimeToSendArray = $_POST['memberCheckInTimeToSendArray'];

$totalcountarray = count($memberNameToSendArray);
$message='<div style="width:700px; padding:20px; background:#f6f6f6; border:1px solid #ccc; margin:20px auto; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:20px;">
<table width="100%" border="0" cellpadding="10" cellspacing="0">
  <tr>
    <td width="17%">Meeting Time:</td>
    <td width="83%">'.$meetingTimeFromDB.'</td>
    </tr>
  <tr>
    <td>Group Name:</td>
    <td>'.$groupName.'</td>
    </tr>
  
  <tr>
    <td colspan="2">
    <table width="100%" border="0" cellpadding="5" cellspacing="0" style="border:1px solid #ccc; border-bottom:none; border-right:none;">
  <tr>
    <td width="25%" style="border-right:1px solid #ccc;border-bottom:1px solid #ccc"><strong>Member Name</strong></td>
    <td width="28%"  style="border-right:1px solid #ccc;border-bottom:1px solid #ccc"><strong>Email</strong></td>
    <td width="22%" style="border-right:1px solid #ccc;border-bottom:1px solid #ccc"><strong>Phone Number</strong></td>
    <td width="10%" style="border-right:1px solid #ccc;border-bottom:1px solid #ccc"><strong>Balance</strong></td>
    <td width="15%" style="border-right:1px solid #ccc;border-bottom:1px solid #ccc" nowrap="nowrap"><strong>Checkin Time</strong></td>
  </tr>';


for ($i=0; $i<$totalcountarray; $i++)
  {
  
       $mname = $memberNameToSendArray[$i];
       $memail = $memberEmailToSendArray[$i];
	   $mphone = $memberPhoneToSendArray[$i];
      $mbalance = $memberBalanceToSendArray[$i];
      $mcheck = $memberCheckInTimeToSendArray[$i];
	  
$message .='<tr>
    <td style="border-right:1px solid #ccc;border-bottom:1px solid #ccc">'.$mname.'</td>
    <td style="border-right:1px solid #ccc;border-bottom:1px solid #ccc">'.$memail.'</td>
    <td style="border-right:1px solid #ccc;border-bottom:1px solid #ccc">'.$mphone.'</td>
    <td style="border-right:1px solid #ccc;border-bottom:1px solid #ccc">'.$mbalance.'</td>
    <td style="border-right:1px solid #ccc;border-bottom:1px solid #ccc">'.$mcheck.'</td>
  </tr>';
  
 }
  
$message .='</table>    </td>
    </tr>
    <tr>
    <td colspan="2">&nbsp;</td>
    </tr>
</table>

</div>';
 $to= $memberEmailToSend;
 $subject='Attendance Report';
        $headers .= "Reply-To:".$from." <".$from.">\r\n"; 
        $headers .= "Return-Path: ".$from." <".$from.">\r\n"; 
        $headers .= "From: AccountedFor App<".$from.">\r\n"; 
        $headers .= "Organization: http://accountedfor.biz\r\n"; 
        $headers .= "Content-type:text/html;charset=iso-8859-1\r\n"; 
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "X-Mailer: php";
        mail($to,$subject,$message,$headers);

    $response['status'] ="ok";

    echo json_encode($response);

?>