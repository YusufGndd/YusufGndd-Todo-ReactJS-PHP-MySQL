<?php 

header("Access-Control-Allow-Origin: *");

/*
#####################
Database bağlantısı
#####################

$yo_sunucu="sql113.epizy.com";
$yo_kullanici="epiz_33068576";
$yo_sifre="WdEtTlQ8ISJL";
$yo_adi="epiz_33068576_reactPHP";

try {
    $db = new PDO ("mysql:host=$yo_sunucu;dbname=$yo_adi",$yo_kullanici,$yo_sifre);
}catch(PDOException $e){
    die($e->getMessage());
}
*/

$yo_sunucu="localhost";
$yo_kullanici="root";
$yo_sifre="";
$yo_adi="yazilim-ogren";

try {
    $db = new PDO ("mysql:host=$yo_sunucu;dbname=$yo_adi",$yo_kullanici,$yo_sifre);
}catch(PDOException $e){
    die($e->getMessage());
}



$action = $_POST['action'];
$response = [];

switch ($action){

    case 'todos':
        $response = $db->query('select * from todos order by id desc')->fetchAll(PDO::FETCH_ASSOC);
        
        break;

    case 'add-todo':
        $todo = $_POST['todo'];
        $data = [
            'todo' => $todo,
            'done' => 0
        ];

        $query = $db->prepare('INSERT INTO todos SET todo= :todo, done= :done');
        $insert = $query->execute($data);

        if ($insert){
            $data['id'] = $db->lastInsertId();
            $response = $data;
        }else {
            $response['error'] = "Bir sorun oluştu ve todo eklenemedi";
        }

        break;

    case 'delete-todo':
        $id= $_POST['id'];

        if(!$id){
            $response['error']= 'id eksik olamaz';
        }else{
            $delete = $db->exec('delete from todos where id = "'. $id .'"');
            if ($delete){
                $response['deleted'] = true;
            }else{
                $response['error']= "Todo silinemedi";
            }
        }


        break;

    case 'done-todo':
        $id= $_POST['id'];
        $done = $_POST['done'];
        if(!$id){
            $response['error']= 'id eksik olamaz';
        }else{
            $query = $db->prepare('select id from todos where id = :id');
            $todo = $query->execute([
                'id' => $id
            ]);
            $todo = $query->fetch(PDO::FETCH_ASSOC);
            if(!$todo){
                $response['error']='Gönderdiğiniz idye ait todo bulunamadı';
            }else{
                $query = $db->prepare('update todos set done = :done where id=:id');
                $update = $query->execute([
                    'done'=> $done,
                    'id' => $id
                ]);
                if($update){
                    $response['done'] = true;
                }else {
                    $response['error'] = 'Todo güncellenirken bir sorun oluştu';
                }
            }
        }


        break;

}

echo json_encode($response);