<?php
$filename= 'log.txt';
$today = date("m.d.y");  
file_put_contents($filename, "opened ". $today ."\r\n",FILE_APPEND);

$memberBalanceToSendArray = $_POST['memberBalanceToSendArray'];    
$memberEmailToSendArray = $_POST['memberEmailToSendArray']; 
$memberNameToSendArray = $_POST['memberNameToSendArray']; 
$paymentMethodToSendArray = $_POST['paymentMethodToSendArray']; 
$descriptionToSendArray = $_POST['descriptionToSendArray'];
$meetingDateToSendArray = $_POST['meetingDateToSendArray'];

$meetingStartedTime = $_POST['meetingStartedTime'];
 
file_put_contents($filename, "memberEmailToSendArray ". join(", ", $memberEmailToSendArray) . "\r\n",FILE_APPEND);
file_put_contents($filename, "memberBalanceToSendArray ". join(", ", $memberBalanceToSendArray) . "\r\n",FILE_APPEND);
file_put_contents($filename, "memberNameToSendArray ". join(", ", $memberNameToSendArray) . "\r\n",FILE_APPEND);
file_put_contents($filename, "paymentMethodToSendArray ". join(", ", $paymentMethodToSendArray) . "\r\n",FILE_APPEND);
file_put_contents($filename, "descriptionToSendArray ". join(", ", $descriptionToSendArray) . "\r\n",FILE_APPEND);
file_put_contents($filename, "meetingDateToSendArray ". join(", ", $meetingDateToSendArray) . "\r\n",FILE_APPEND);

$totalcountarray = count($memberBalanceToSendArray);

for ($i=0; $i<$totalcountarray; $i++){
	$payment_method = $paymentMethodToSendArray[$i];
	$meeting_date = $meetingDateToSendArray[$i];
	$products = $descriptionToSendArray[$i];
	$email_to = trim($memberEmailToSendArray[$i]);
	$balance = $memberBalanceToSendArray[$i];
	$sold_to=$memberNameToSendArray[$i];
	$groupName=$_POST['groupName'];
	$emailSetupValue = $_POST['emailSetupValue'];

	file_put_contents($filename, "send:".",".$payment_method.",".$meeting_date.",".$products.",".$email_to.",".$balance.",".$sold_to.",".$groupName.",".$emailSetupValue.","."\r\n",FILE_APPEND);

	$sent = sendMail($payment_method,$meeting_date,$products,$email_to,$balance,$sold_to,$groupName,$emailSetupValue);
	if(!$sent){$failcount += 1;}
	$successArray[]=$sent;
}
	file_put_contents($filename, "failed:".$failcount."\r\n",FILE_APPEND);

    $response['status'] ="ok";
    $response['failcount'] = $failcount;
    $response['details'] =$successArray;
    //~ $response['memberBalanceToSendArray'] =$memberBalanceToSendArray[0];
    //~ $response['memberEmailToSendArray'] =$memberEmailToSendArray;
    //~ $response['memberNameToSendArray'] =$memberNameToSendArray;
    //~ $response['paymentMethodToSendArray'] =$paymentMethodToSendArray;
    //~ $response['descriptionToSendArray'] =$descriptionToSendArray;
    //~ $response['meetingStartedTime'] =$meetingStartedTime;
    //~ $response['totalcountarray'] =$totalcountarray;
    echo json_encode($response);
    
        
    function sendMail($payment_method,$meeting_date,$products,$email_to,$balance,$sold_to,$groupName,$emailSetupValue)
    {
        
//~ <!--         $subjects = explode(",", $products);
        //~ foreach ($subjects as $i => $value) {
            //~ if($value!=""){
                //~ $value.'<br />';
                //~ $getnegfirstpart=0;
                //~ $getposfirstpart=0;
                //~ if (strpos($value,'-$') !== false) {
                    //~ $neg_val = explode("-$", $value);
                    //~ foreach ($neg_val as $i => $aaa) {
                        //~ $originalval=$aaa;
                        //~ if($getnegfirstpart==0){
                            //~ $originalval1=$aaa;
                        //~ }
                        //~ $getnegfirstpart++;
                    //~ }
                    //~ '-'.$originalval.'<br />'.$originalval1.'<br />';
                //~ }else{
                    //~ $pos_val = explode("$", $value);
                    //~ foreach ($pos_val as $i => $aaa) {
                        //~ $originalval=$aaa;
                        //~ if($getposfirstpart==0){
                            //~ $originalval1=$aaa;
                        //~ }
                        //~ $getposfirstpart++;
                    //~ }
                    //~ '+'.$originalval.'<br />'.$originalval1.'<br />';
                //~ }
                
            //~ }
        //~ } -->
        
        
        $from=$emailSetupValue;
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
        <td align="center"  style="border-right:1px solid #666;">'.$meeting_date.'</td>
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
        <td>Payment was received.</td>
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
        </tr><tr>
                <td style="border-right:1px solid #666;">'.$products.' - ' .$groupName.'</td>
                <td align="right">'.$balance.'</td>
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
        <td  style="border-right:1px solid #666;">&nbsp;</td>
        <td>&nbsp;</td>
        </tr>
        <tr>
        <td style="border-top:1px solid #666; border-right:1px solid #666;">Thank-you for attending.</td>
        <td style="border-top:1px solid #666;" align="right"> Total:  $'.number_format($balance,2).'</td>
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
        $from = 'web@accountedfor.biz';
        $to= $email_to;
        $headers .= "Reply-To:".$from." <".$from.">\r\n"; 
        $headers .= "Return-Path: ".$from." <".$from.">\r\n"; 
        $headers .= "From: Sales Receipt<".$from.">\r\n"; 
        $headers .= "Organization: http://accountedfor.biz\r\n"; 
        $headers .= "Content-type:text/html;charset=iso-8859-1\r\n"; 
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "X-Mailer: php";
	$filename='log.txt';
	$sent = mail($to,$subject,$message,$headers);
	if($sent){
		file_put_contents($filename, "email was sent to $to\r\n",FILE_APPEND);
		return true;
	}else{
		file_put_contents($filename, "sending email for $to failed!\r\n",FILE_APPEND);
		return false;
	}
}
    
    
?>
 