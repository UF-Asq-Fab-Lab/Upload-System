<?php
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//Function to correctly format email for UTF-8
	//See: http://php.net/manual/en/function.mail.php
	////////////////////////////////////////////////////////////////////////////////////////////////////
	function mail_utf8($to, $from_user, $from_email, $subject = '(No subject)', $message = ''){
      $from_user = "=?UTF-8?B?".base64_encode($from_user)."?=";
      $subject = "=?UTF-8?B?".base64_encode($subject)."?=";

      $headers = "From: $from_user <$from_email>\r\n".
               "MIME-Version: 1.0" . "\r\n" .
               "Content-type: text/html; charset=UTF-8" . "\r\n";

     return mail($to, $subject, $message, $headers);
   }

	///////////////////////////////////////////////////////////////////////////////////////////////////////
	// front-end form with file upload
	///////////////////////////////////////////////////////////////////////////////////////////////////////
 
	$message = '';
 
	if($input->post->submit){
 
	    // tmp upload folder for additional security
	    // possibly restrict access to this folder using htaccess:
	    // # RewriteRule ^.tmp_uploads(.*) - [F]
	    $upload_path = $config->paths->root . ".tmp_uploads/";
	    $data = wire('modules')->getModuleConfigData('UploadSystem'); 

	    
	    //process the upload form data
	    $timestamp = date("Y-m-d H:i:s");
	    $title = $sanitizer->pageName($user->name);
	    $email = $sanitizer->email($user->email);
	    $comments = $sanitizer->textarea($input->post->comments);
	    $units = $input->post->units;
	    $dimensions = $sanitizer->text($input->post->dimensions);
	 
	    // new wire upload
	    $u = new WireUpload('uploads');
	    $u->setMaxFiles(1);
	    //$u->setMaxFileSize($maxFileSize); NOT IN PW 2.2.9
	    $u->setOverwrite(false);
	    $u->setDestinationPath($upload_path);
	    $u->setValidExtensions(array('stl', '3ds', 'obj'));

	 
	    // execute upload and check for errors
	    $files = $u->execute();
	 
	    if(!$u->getErrors()){
	    	foreach($files as $filename){
	    		$title .= $sanitizer->text($filename);
	    	}
	    	$title .= $timestamp;
	        // create the new page to add the file
	        $uploadpage = new Page();
	        $uploadpage->template = $templates->get("name={$data['uploadsTableName']}_T";
	        $uploadpage->title = $title;
	        $uploadpage->name = $title;
	        $uploadpage->ufid = $user->ufid;
	        $uploadpage->units = $units;
	        $uploadpage->dimensions = $dimensions;
	        $title = $sanitizer->pageName($title);
	        $uploadpage->set('printConfURL', $data['confURL'] . $title . "?confirm=1");
	        $uploadpage->set('timestamp', $timestamp);
	        $uploadpage->parent = $pages->get("name={$data['uploadsPageName']}");
	        $bodystring = "";
	        $bodystring .= "Machine: " . $input->post->printer . "<br>";
	        $bodystring .= "Material: " . $input->post->material . "<br>";
	        $bodystring .= "Color: " . $input->post->color . "<br>";
	        $bodystring .= "Comments: " . $comments . "<br>";
	        $uploadpage->set('body', $bodystring);
	        $uploadpage->email = $email;
	        $uploadpage->save();
	 
	        // add files upload
	        foreach($files as $filename) {
	            $uploadpage->File = $upload_path . $filename;
	        }
	        // save page
	        $uploadpage->save();

	        $name = $user->name;
	        $fileName = $files[0];
	        $email = $data['email'];

			$subject = $data['emailSubject'];
			$emailmessage  = str_replace('%name%', $name, $data['emailBody']);
			$emailmessage = str_replace('%filename%', $fileName, $emailmessage);
			$sentmail = mail_utf8($user->email, 'UF A² Fab Lab', $data['email'], $subject, $emailmessage);

			$noteEmail = $data['email'];
			$noteSubject = $data['noteSubject'];
			$noteMessage = str_replace('%filename%', $fileName, $data['noteBody']);
			$noteMessage = str_replace('%name%', $name, $noteMessage);
			$noteSentMail = mail_utf8($noteEmail, 'UF A² Fab Lab', $noteEmail, $noteSubject, $noteMessage); 
	 
	        // remove all tmp files uploaded
	        foreach($files as $filename) unlink($upload_path . $filename);
	        $message .= "<p class='message'>Upload Complete</p>";
	        
	 
	    } else {
	        // remove files
	        foreach($files as $filename) unlink($upload_path . $filename);
	 
	        // get the errors
	        foreach($u->getErrors() as $error) $message .= "<p class='error'>$error</p>";
	    }
}
 
 
?>