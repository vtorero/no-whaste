<?php
$url="https://franz.kvconsult.com/fapi-dev/cron.php/data/api"; // a aqui tu url
$page = file_get_contents($url);
echo $page;


?>