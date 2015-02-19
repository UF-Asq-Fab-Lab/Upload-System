
<h1 class="pageheader">Upload 3D File</h1>

<form method="post" action="./" enctype="multipart/form-data">
	<p><label for="checklist">Ready to Print Checklist:</label></p>
	<p><input type="checkbox" required/> Is your model <a href="/faq/3d-printing-faq/">water-tight?</a><br></p>
	<p><input type="checkbox" required/> Is your model <a href="/faq/3d-printing-faq/">scaled</a> to the correct size?<br></p>
	<p><input type="checkbox" required/> Does the file contain only solid 3D geometry? <a href="/faq/3d-printing-faq/">(no curves or open surfaces)</a><br></p>
	<p><label for="machine">3D Printer</label></p>
	<p><select name="machine" id="machinesdropdown">
		<option selected="selected">Choose a Machine</option>
		
	</select></p>
	<p><label for="material">Material</label></p>
	<p><select name="material" id="materialsdropdown">
	<option selected="selected">Choose a Material</option>
	</select></p>
	<p><label for="material">Color</label></p>
	<p><select name="color" id="colorsdropdown">
	<option selected="selected">Choose a Color</option>
	</select></p>
	<p><label for="units">Units</label></p>
		<p><select name="units" id="units">
			<option selected="selected">Specify Units</option>
			<option>Inches</option>
			<option>Millimeters</option>
		</select></p>
	<p><label for="dimensions">Dimensions (L x W x H)</label></p>
		<p><input type='text' id="dimensions" name='dimensions' placeholder='__x__x__' required/></p>
    <p><label for="comments">File Details or Comments for Printing:</label></p>
    <p><textarea name="comments" id="comments" rows="18" required></textarea></p>
    <p><label for="file">File:</label></p>
    <p><input type="file" id="upload" name="uploads[]" size="40" required/></p>
    <p>Accepted file types: stl, 3ds, obj. Max file size: 128 MB.<br></p>
    <p><input type="submit" name="submit" id="submit" value="Upload"/></p>
</form>