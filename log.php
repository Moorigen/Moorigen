<?php

$val = $_REQUEST["val"];

$file = fopen("text.txt", "a");
fwrite($file, $val . PHP_EOL);
fclose($file);

echo $val;

?>