<?php
session_start();
require 'flight/Flight.php';
$link = mysqli_connect('localhost', 'root', 'root', 'geobase');
Flight:: set('db',$link);


Flight::route('/', function() {
  Flight::render('pesquet');
});


Flight::start();
?>


