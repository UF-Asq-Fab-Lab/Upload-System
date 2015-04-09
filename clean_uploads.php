#!/usr/bin/php
<?php
chdir('../');
include(getcwd()."/index.php"); //bootstrap processwire
$uploadSystemData = wire("modules")->getModuleConfigData("UploadSystem");
$uploadspage = wire("pages")->get("id={$uploadSystemData['uploadsPage_id']}");
echo "interval: " . $uploadSystemData['uploadsLifetime'] . " done \n";
$filePages = $uploadspage->children("include=all");
$now = time();
echo "count: " . $filePages->count() . " done \n";
echo "now: " . $now . " done \n";
foreach($filePages as $fp){
	$fp->setOutputFormatting(false);
	echo "created: " . $fp->created . " done \n";
	echo "difference" . $now - $fp->created . " done \n";
	if($now - $fp->created > $uploadSystemData['uploadsLifetime']){ //a week in seconds
		foreach ($fp->file as $file) {
			$fp->file->delete($file);
		}
		$fp->save();
		$fp->delete();
	}
	if($fp){
		$fp->setOutputFormatting(true);
	}
}
?>