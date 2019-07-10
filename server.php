<?php require 'connection.php'?>
<?php header('Content-Type: text/plain; charset=windows-1251'); //потому что по умолчанию сервер отдает данные браузеру в utf-8
// при этом сам файл должен быть в кодеровке Ansi/win-1251 т.к. если будет в utf-8 то автоматически в начало документа 
// добавяться три служебных байта и функция header() выдаст ошибку, т.к. перед ней не должно быть никакого вывода 

// alternative json_encode 
function _json_encode($val) // самописная функция заменяющая функцию json_encode, которая появилась в php только с версии 5.2
{
    if (is_string($val)) return '"'.addslashes($val).'"';
    if (is_numeric($val)) return $val;
    if ($val === null) return 'null';
    if ($val === true) return 'true';
    if ($val === false) return 'false';

    $assoc = false;
    $i = 0;
    foreach ($val as $k=>$v){
        if ($k !== $i++){
            $assoc = true;
            break;
        }
    }
    $res = array();
    foreach ($val as $k=>$v){
        $v = _json_encode($v);
        if ($assoc){
            $k = '"'.addslashes($k).'"';
            $v = $k.':'.$v;
        }
        $res[] = $v;
    }
    $res = implode(',', $res);
    return ($assoc)? '{'.$res.'}' : '['.$res.']';
}


if($_GET['check_email'] and $_GET['check_system']){ // проверка наличия email-адреса и системы в БД
     
    $check_email = $_GET['check_email'];
    $check_system = $_GET['check_system'];
    
    $check_email = iconv('UTF-8','windows-1251',$check_email);  //т.к. все идущие на сервер параметры GET/POST, кодируются в UTF-8, переводим их в windows-1251
    $check_system = iconv('UTF-8','windows-1251',$check_system);
    
    global $open_connection;  
    $query = "
                SELECT 1 FROM monitoring.dq_control_mail
                WHERE EMAIL = '$check_email'
                AND SYSTEM = '$check_system'
             " ;
                
    ora_parse($open_connection, $query, 0);         
	ora_exec($open_connection);
    while(ora_fetch_into($open_connection, $row))
    {   
        $data = $row;              
    } 
            
     if($data){ // если email-адрес и система есть в БД, запрос выдает строку и возвращается 1, если нету, то 0
        echo 1;
     }else{
        echo 0;
     }      
}

if($_GET['input_email']){  // insert email-а и названия системы в DQ_CONTROL_MAIL при подписке 
    
    $input_email = $_GET['input_email']; 
    $select_system = $_GET['select_system']; 
    
    $input_email = iconv('UTF-8','windows-1251',$input_email);  //т.к. все идущие на сервер параметры GET/POST, кодируются в UTF-8, переводим их в windows-1251
    $select_system = iconv('UTF-8','windows-1251',$select_system);
        
    global $open_connection;  
    $query = "
                insert into MONITORING.DQ_CONTROL_MAIL (EMAIL, SYSTEM)
                values ('$input_email', '$select_system')
             " ;
                
    ora_parse($open_connection, $query, 0);         
	ora_exec($open_connection);
        
    echo true;
}


if($_GET['select_load']){  // запрос систем для селекта 
            
    global $open_connection;  
    $query = "
                select distinct REP_SYSTEM from DQ_LIST_CONTROL 
             " ;
                
    ora_parse($open_connection, $query, 0);         
	ora_exec($open_connection);
    while(ora_fetch_into($open_connection, $row))
    {        
        $data[] = $row;        
    } 
    
    echo _json_encode($data);     
}


?>