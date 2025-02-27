<?php
header('Content-Type: application/json');

try {
    $conn = new PDO("mysql:host=localhost;dbname=cadastro-unidade", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erro de conexão: " . $e->getMessage());
}

$requisicao = file_get_contents('php://input');
$data = json_decode($requisicao,true);

switch ($data['operacao']){
    case 'inserir':
        saveData($data,$conn);
        break;
    case 'editar':
        editData($data,$conn);
        break;
    case 'buscar':
        searchData($data["id"],$conn);
        break;
    case 'ler':
        readData($conn);
        break;
    case 'excluir':
        deleteData($data['id'],$conn);
        break;
    default:
        echo json_decode("A operação não existe");
        break;
}

function saveData($data,$conn){
    $sql = "INSERT INTO unidades (id,nome,endereco,cep,estado,cidade,possui_internacao,num_quartos, num_leitos, diretor)
            VALUES (:id ,:nome, :endereco, :cep, :estado, :cidade, :internacao, :quartos, :leitos , :diretor)";
    $stmt = $conn->prepare($sql);
    $stmt->execute(["id"=>$data['id'], "nome"=>$data['nome'], "endereco"=>$data['endereco'], "cep"=>$data['cep'], "estado"=>$data['estado'], "cidade"=>$data['cidade'], "internacao"=>$data['internacao'], "quartos"=>$data['quartos'], "leitos"=>$data['leitos'], "diretor"=>$data['diretor']]);
    echo json_encode('Cadastro salvo!');
}

function editData($data,$conn){
    $sql = "UPDATE unidades set nome = :nome, endereco= :endereco, cep = :cep, estado = :estado, cidade = :cidade, possui_internacao = :internacao, num_quartos = :quartos, num_leitos = :leitos, diretor = :diretor WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->execute(["id"=>$data['id'], "nome"=>$data['nome'], "endereco"=>$data['endereco'], "cep"=>$data['cep'], "estado"=>$data['estado'], "cidade"=>$data['cidade'], "internacao"=>$data['internacao'], "quartos"=>$data['quartos'], "leitos"=>$data['leitos'], "diretor"=>$data['diretor']]);
    echo json_encode('Cadastro salvo!');
}

function searchData($data,$conn){
    $sql = "SELECT * from unidades WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->execute(["id"=> $data]);
    echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));    
}

function readData($conn){
    $sql = "SELECT * from unidades";
    $stmt = $conn->query($sql);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

function deleteData($data,$conn){
    $sql = "DELETE from unidades where id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->execute(['id' => $data]);
    echo json_encode("Cadastro excluído!");
    
}