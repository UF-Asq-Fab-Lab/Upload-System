# Upload-System

ProcessWire Module for handling, managing uploads, communicating with users

Version 1

Thomas R Storey

---

##Installation

---

1. Place Uploader folder, ProcessUpload.module, ProcessMaterial.module, and UploadFormBuilder.module inside the sites/modules directory of the site.
2. Navigate to http://yoururl.edu/processwire
3. Sign in as an account with admin privileges
4. Navigate to the Modules admin page
5. Install "A² Fab Lab Upload System"
6. Navigate to Setup > Fields > material and click "Save"
7. Navigate to Setup > Fields > upload_status and click "Save"
8. Edit the "Upload" and "Confirm Upload for Printing" pages to set them to "hidden" if you don't want them to show up in the navigation bar of your site.


##Usage

---

###Admin

####Configuration

All configuration settings can be found by navigating through the admin interface to Modules > A² Fab Lab Upload System > Settings.

#####Upload path and id

These first two settings specify to the module what page should be considered the upload page. This path and id should refer to a page accessible to a user. It doesn't matter what is on the page as long as it has a Body field and that body field contains the tag [uploader] written somewhere in that body - that is what the module uses to insert the Uploader form into the page. The default values are fine for the default configuration, but if you want to move the upload page you'll have to specify the path and id for the destination page here.

#####Confirm path and id

These two settings are just like the "upload path and id" seen above, except they refer to the confirmation page. This is the page that users will be sent to when they click the link in the email that is sent to them when a lab intern or assistant determines an official price estimate for the model. (See Workflow: Confirmation below). As long as the page specified here has a Body field and the tag [confirm] written somewhere in the body, the module will insert the confirmation interface there (which is just a message telling the user if their printing job was successfully confirmed or not).

#####Email Address

This setting specifies the email address to which all module-generated Uploader-related correspondence will be sent. When a user uploads a file, this email address will receive a notification.

#####Upload Confirmation Email Settings

These settings allow the configuration of the subject and body of the email sent to users immediately upon uploading a file. It should be some sort of message notifying the user that the file was received successfully and will be attended to by a lab intern and assistant soon. Any instance of the tag [username] will be replaced with the users username and any instance of the tag [filename] will be similarly replaced with the name of the file uploaded.

#####Upload Notification Email Settings

Like the settings immediately above, these settings allow you to set the subject and body of automated emails sent immediately when the file is uploaded. The email should probably Just let the intern or assistant know that a new file was uploaded and where to find it so they can do something about it (See Workflow: Receiving below). Any instance of the tag [username] will be replaced with the users username and any instance of the tag [filename] will be similarly replaced with the name of the file uploaded.

#####Allowed file extensions list

This should be a list of file extensions that the module will except as valid uploads. Do _not_ include commas or periods - only a list of the extension letter codes separated by spaces.

#####Confirmation Request Email Settings

These settings let you determine the subject and body of generated emails sent to the user to request that they confirm their upload for printing. This message should include a link to the confirm page (inserted automatically at the [url] tag), the name of the file to confirm (placed where the [filename] tag is), and the the estimated price for the piece (injected at the [price] tag). Additionally you can configure the automated email sent to the intern or assistant in charge of uploads, with the same rules as above (use [filename] to insert the name of the file. [url] and [price] are not necessary).

#####Roles setting

This setting is a comma delimited list of role names that a user must have to be able to view the upload form on the front end.

#####Unauthorized message.

This setting allows you to configure the message that will be presented to the user upon trying to view the upload page while not logged or not in possession of one or more of the roles present in the Roles setting detailed above.

####Workflow

#####Receiving Files

* When a user uploads a file, an email will be sent to the email address specified in the configuration settings. (See Configuration: Email Address above) This email should state that a file has been uploaded, who uploaded it, what the name of the file is, and provide some general instructions for what to do next. (See Configuration: Upload Notification Email Settings above)

* The upload manager should log in to the website backend (yoururl.com/processwire), navigate to Uploader > Uploads > Name of Uploaded File > Content tab, and click on the file in the Upload File field to download it.

#####Confirmation

* Once the upload manager has obtained a price estimate, she should enter it into the Estimated Price field on that same page, and click Save.

* Then, she should navigate to the Request Confirmation Tab of that same page. Once there, she should modify the Confirmation Request subject and message as necessary (if the Confirmation Request Email settings in the configuration settings are set correctly, the manager usually shouldn't have to change anything).

* Once the request message is ready to send, she should click the Send Message button. The user who uploaded the file will receive an email asking them to confirm that they would indeed like to print this file. If they follow the link in that email, the manager will receive another email saying that this file has been confirmed for printing.

#####Printing

* When the manager receives an email saying that a file has been confirmed for printing, she should go ahead and use the downloaded file from earlier and print the file. At this point, make sure to set the uploaded file's Upload Status (at Uploader > Uploads > Name of File > Content Tab) to "Printing". This will keep the user appraised of the status of the upload.

* Once the print is done, the manager should set the Upload Status to "Complete". Once the printed file is cleaned and ready for pickup, the manager should change the Upload Status for the file to "Ready"

* If the print fails and cannot be completed, the manager should set the status to "Failed" and send the user an email explaining why the print failed and perhaps how they might fix their file to be more successful in a future attempt.

#####Charging

* If the Charger module is installed, the manager can generate and upload a charge file for the uploaded file once the job is complete.

* First, she should input the final price into the Final Price field of the uploaded file's page (Uploader > Uploads > Name of File > Content tab). Should be a decimal number with two decimal places. Examples: 24.00, 5.00, 122.00, etc.

* Then, navigate to the Generate Charge tab, and inspect the text of the charge file in the Charge File field. This is the text that will put in a text file and uploaded the WebDAV server.

* If everything looks to be in order, the manager should hit the Send Charge button.

* The user will now be charged from their student account for the amount specified in the Final Price field.

###User

#####Uploading

* To upload a file, a user has to be logged in as a user that has one of the roles specified in the Roles configuration setting (See Admin:Configuration:Roles setting above).

* The user navigates to the page specifed in the Upload path and id setting (See Admin:Configuration:Upload path and id above). There, she is presented with a form to fill out.

* Every field is required except for the Comments field, which can be left blank. Unless every field is filled out, the form will not submit.

* Once she has filled every field and specifed her file to upload (which should be of one of the types specified in the "Allowed file extensions list" configuration setting (see above)), she clicks the Upload button

* The file will upload, which can take up to a couple minutes depending on internet speed and filesize.

#####Confirming

* Immediately upon uploading, the user will be sent an email confirming that the file was successfully uploaded, and the file can now be viewed and tracked on the users account page.

* Once the file has been received and a cost estimated, the user will receive an email that details the cost of the print and provides a link to follow in order to confirm the print job.

* The user clicks the link and is given a message saying that the print was successfully confirmed.

#####Completing

* The user can now track the progress of her print from her account page and go to the lab to pick up her model once its status changes to "Ready".

* If the status changes to "Failed", she should check her email for a message from the lab explaining why the print failed and what can be done to improve it for future attempts.
