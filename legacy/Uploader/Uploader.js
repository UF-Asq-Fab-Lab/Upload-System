<link rel='stylesheet' href='<?php echo wire("config")->urls->siteModules?>ProcessUploader/uploader-style.css' />
<script src='<?php echo wire("config")->urls->siteModules?>ProcessUploader/lib/jquery.min.js'></script>
<?php
  //format email for outlook (yay microsoft)
  /*function mail_utf8($to, $from_user, $from_email, $subject = '(No subject)', $message = ''){
      $from_user = "=?UTF-8?B?".base64_encode($from_user)."?=";
      $subject = "=?UTF-8?B?".base64_encode($subject)."?=";

      $headers = "From: $from_user <$from_email>\r\n".
               "MIME-Version: 1.0" . "\r\n" .
               "Content-type: text/html; charset=UTF-8" . "\r\n";

     return mail($to, $subject, $message, $headers);
   }*/

  $data = wire('modules')->getModuleConfigData('ProcessUploader'); 
 
  $message = '';
 
  if(wire('input')->post->submit && strpos($_SERVER['REQUEST_URI'], $data['uploader_page']['value']) !== false){
    wire('log')->save('uploadsystem', 'Post Received');
      // tmp upload folder for additional security
      // possibly restrict access to this folder using htaccess:
      // # RewriteRule ^.tmp_uploads(.*) - [F]
      $upload_path = wire('config')->paths->root . ".tmp_uploads/";
      

      
      //process the upload form data
      $timestamp = date("m-d-Y_H:i:s");
      $title = wire('sanitizer')->pageName(wire('user')->name);
      $email = wire('sanitizer')->email(wire('user')->email);
      $notes = wire('sanitizer')->textarea(wire('input')->post->notes);
      $material = wire('input')->post->material;
      $units = wire('input')->post->units;
      $dimensions = wire('sanitizer')->text(wire('input')->post->dimensions);
   
      // new wire upload
      $u = new WireUpload('uploads');
      $u->setMaxFiles(1);
      //$u->setMaxFileSize($maxFileSize); NOT IN PW 2.2.9
      $u->setOverwrite(false);
      $u->setDestinationPath($upload_path);
      $u->setValidExtensions(explode(" ", $data['allowed_filetypes']));

      // execute upload and check for errors
      $files = $u->execute();
      
      if(!$u->getErrors()){
        foreach($files as $filename){
          $title .= wire('sanitizer')->text($filename);
        }
        $title .= $timestamp;
        // create the new page to add the file
        $uploadpage = new Page();
        $uploadpage->template = wire('templates')->get("name=upload");
        $uploadpage->title = $title;
        $uploadpage->username = wire('user')->name;
        $uploadpage->ufid = wire('user')->ufid;
        $uploadpage->material = wire('pages')->get("template=material, title=$material");
        $uploadpage->units = $units;
        $uploadpage->dimensions = $dimensions;
        $uploadpage->process = wire('modules')->get('ProcessUploadEmailer');
        $title = wire('sanitizer')->pageName($title);
        $uploadpage->hash = md5($title);
        $processconfirmid = wire('modules')->getModuleID("ProcessUploadConfirm");
        $confirmpage = wire('pages')->get("process=$processconfirmid");
        $confirmpage->hashes.= ",".$uploadpage->hash;
        //need a way do this in the new system
        //ProcessUploader maybe could handle it?
        //Everytime a file uploads, make an upublished page
        //name and title of page is a md5 hash.
        //Page has a Process that, when someone accesses the page, flips the checkbox
        //on the appropriate upload page, emails the manager.
        //Each upload also needs a process with a button to send an auto email with a link to the
        //auto generated page.
        $uploadpage->set('timestamp', $timestamp);

        $processuploadid = wire('modules')->getModuleID("ProcessUpload");
        $uploadparent = wire('pages')->get("process=$processuploadid");
        $uploadpage->parent = $uploadparent;
        $uploadpage->email = $email;
        $uploadpage->save();
 
        // add files upload
        foreach($files as $filename) {
            $uploadpage->upload_file = $upload_path . $filename;
        }
        // save page
        $uploadpage->save();

        wire('log')->save('uploadsystem', $uploadpage);

        $name = wire('user')->name;
        $fileName = $files[0];
        $email = $data['email'];
        // Send confirmation to user
        $body  = str_replace('%name%', $name, $data['emailBody']);
        $body = str_replace('%filename%', $fileName, $body);
        $mailer = wireMail();
        $mailer->to(wire('user')->email, wire('user')->name)->from($email, 'UF A² Fab Lab Uploads Manager');
        $mailer->subject($data['emailSubject'])->body($body);
        $recepients = $mailer->send();

        // Send notification to manager
        $body = str_replace('%filename%', $fileName, $data['managerEmailBody']);
        $body = str_replace('%name%', $name, $body);
        $mailer = wireMail();
        $mailer->to($email, "UF A² Fab Lab Uploads Manager")->from("uploads@fablab.arts.ufl.edu", 'UF A² Fab Lab Uploads');
        $mailer->subject($data['managerEmailSubject'])->body($body);
        $recepients = $mailer->send();
   
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

<form id="upload-form" method="post" action="./" enctype="multipart/form-data">
  <p><label for="checklist">Ready to Print Checklist:</label></p>
  <p><input class="upload-form-input" name="cb0" type="checkbox" /> Is your model water-tight?<span class="upload-form-error"></span></p>
  <p><input class="upload-form-input"name="cb1" type="checkbox" /> Is your model scaled to the correct size?<span class="upload-form-error"></span></p>
  <p><input class="upload-form-input"name="cb2" type="checkbox" /> Does the file contain only solid 3D geometry? (no curves or open surfaces)<span class="upload-form-error"></span></p>
  <p><label for="material">Material</label></p>
  <p><select class="upload-form-input" name="material" id="materialsdropdown">
  </select><span class="upload-form-error"></span></p>
  <p><label for="units">Units</label></p>
    <p><select class="upload-form-input" name="units" id="units">
      <option selected="selected">Inches</option>
      <option>Millimeters</option>
    </select><span class="upload-form-error"></span></p>
  <!-- TO DO: Eventually I would like to be able to have the user upload the file first, 
  parse it with javascript, and display it in a window on the form. Then we can
  automatically fill in the dimensions once we have specified the units. For now, we'll
  have to let a human verify the values input here by the user. (Thus the confirmation step).
  If we could parse the file before submitting, we could even provide a rough cost estimate!
  -->
  <p><label for="dimensions">Dimensions</label></p>
    <p><input class="upload-form-input"type='text' id="dimensions" name='dimensions' placeholder='LxWxH' /><span class="upload-form-error"></span></p>
  <p><label for="comments">File Details or Comments for Printing:</label></p>
  <p><textarea name="comments" id="comments" rows="5" ></textarea></p>
  <p><label for="file">File:</label></p>
  <p><input class="upload-form-input"type="file" id="upload" name="uploads" size="40" /><span class="upload-form-error"></span></p>
  <?php
    $data = wire('modules')->getModuleConfigData('ProcessUploader');
    $filetypes = str_replace(" ", ", ", $data["allowed_filetypes"]);
    echo "<p>Accepted file types: $filetypes. Max file size: 128 MB.<br></p>"
  ?>
  
  <p><input class="upload-form-input"type="submit" name="submit" id="submit" value="Upload"/></p>
</form>

<script type="text/javascript">
$(document).ready(function() {

  //fill the printer dropdown
  var materialsMenu = $("#materialsdropdown");
  $.each(materials, function() {
    if(this.available) materialsMenu.append("<option>"+this.title+"</option>");
  });
  /*go through each input
    if the input value evaluates to false
    prevent default
    add message to its parent p html*/
  $("#upload-form").submit(function(event){
    var inputs = $(".upload-form-input");
    $.each(inputs, function (){
      console.log($(this).attr('name') + " " + $(this).val());
      if(($(this).val() == "" || ($(this).is(':checkbox') && !$(this).is(':checked'))) && $(this).attr("name") != "comments"){
        event.preventDefault();
        var err = $(this).next();
        err.html(" This field is required!");
      } else {
        var err = $(this).next();
        err.html("");
      }
      if($(this).attr('type') === "file"){
        var filename = $(this).val();
        if(filename.length > 0){
          var ext = filename.slice(filename.lastIndexOf(".")+1);
          var allowed = config.allowed_filetypes.split(" ");
          if(!allowed.some(function (cv) { return cv === ext; })){
            // if the extension is not in config
            event.preventDefault();
            var err = $(this).next();
            err.html(" " + ext +" is not an acceptable file type!");
          } else {
            var err = $(this).next();
            err.html("");
          }
        }
      }
    });
  });

});
</script>