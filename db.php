<?php

    $host = 'mars.cs.qc.cuny.edu';
    $user = 'dech9604';
    $password = '23309604';
    $dbname = 'dech9604';
    
    $dsn = 'mysql:host=' . $host . '; dbname=' .$dbname;

    try{
        $pdo = new PDO($dsn, $user, $password);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
       //echo "connected";
    } catch(PDOException $e){
        echo "Connection failed: " . $e->getMessage();
    }
    
?>