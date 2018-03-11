<?php

define("OK_HTTPD", realpath(dirname(__FILE__) . '/..'));
define("OK_ROOT", OK_HTTPD . "/ok");
define("OK_PROGRAMS", OK_HTTPD . "/programs");
define("OK_DATA", OK_HTTPD . "/.ok");

// --

$RX_NODE = "/^[a-z0-9\_][a-z0-9_\-\.]*$/i";
$url = parse_url($_SERVER["REQUEST_URI"]);

if (isset($url['path'])) 
{
	// Security check
	$_url = preg_replace("/^\//", "", preg_replace("/\/$/", "", $url['path']));
	$node_path = explode("/", preg_replace("/^\//", "", $_url));
	for ($i = 0, $nodes = count($node_path); $i < $nodes; $i++) {
		$node = $node_path[$i];
		if ($node && !preg_match($RX_NODE, $node)) {
			header('HTTP/1.0 404 Not Found');
			echo "<h1>404 Not Found</h1>\n";
			echo "The page you have requested could not be found.";
			exit;
		}
	}
	
	// Start OK Server
	if ($_url != "favicon.ico") {
		require(OK_ROOT . "/ok.php");
		exit;
	}
}

// --

header('HTTP/1.0 404 Not Found');
echo "<h1>404 Not Found</h1>\n";
echo "The page you have requested could not be found.";
