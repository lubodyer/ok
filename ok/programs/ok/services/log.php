<?php

if (!isset($_POST['messages'])) {
	$ok->debug("Unknown error processing log message(s).");
	return;
}

$messages = (int) $_POST['messages'];

$ok->debug("----------------- CLIENT LOG EVENT ----------------- ");

for ($i=0; $i<$messages; $i++)
{
	$time = (int) $_POST['time' . $i];
	$module = (string) $_POST['module' . $i];
    if (strlen($module) > 40) {
        $message = substr($message, 0, 40);
    }
	$message = (string) urldecode($_POST['message'.$i]);
    if (strlen($message) > 2048) {
        $message = substr($message, 0, 2048);
    }
	
	$ok->debug("[$time] $message", 0, $module);
}
