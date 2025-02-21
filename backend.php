<?php
$requisicao = file_get_contents('php://input');
$data = json_decode($requisicao,true);
$arquivoJson = 'cadastro.json';

switch ($data['operacao']){
    case 'inserir':
        saveData($data,$arquivoJson);
        break;
    case 'editar':
        editData($data,$arquivoJson);
        break;
    case 'buscar':
        searchData($data["id"],$arquivoJson);
        break;
    case 'ler':
        readData($arquivoJson);
        break;
    case 'excluir':
        deleteData($data['id'],$arquivoJson);
        break;
    default:
        echo json_decode("A operação não existe");
        break;
}

function saveData($data,$arquivoJson){
    $arquivoJsonAtual = json_decode(file_get_contents($arquivoJson),true);
    $arquivoJsonAtual [] = $data;
    file_put_contents($arquivoJson,json_encode($arquivoJsonAtual,JSON_PRETTY_PRINT));
    echo json_encode('Cadastro salvo.');
}

function editData($data,$arquivoJson) {
    $arquivoJsonAtual = json_decode(file_get_contents($arquivoJson),true);
    $id = $data['id'];
    $novoJson = [];
    for ($i=0; $i < count($arquivoJsonAtual); $i++){
        if($arquivoJsonAtual[$i]['id'] == $id){
            unset($arquivoJsonAtual[$i]);
            $arquivoJsonAtual [] = $data;
            $novoJson = array_values($arquivoJsonAtual);
            file_put_contents($arquivoJson,json_encode($novoJson,JSON_PRETTY_PRINT));
        }
    }
}

function searchData($data,$arquivoJson) {
    $arquivoJsonAtual = json_decode(file_get_contents($arquivoJson),true);

    for ($i=0; $i < count($arquivoJsonAtual); $i++){
        if($arquivoJsonAtual[$i]['id'] == $data){
            echo json_encode($arquivoJsonAtual[$i]);
        }
    }
}

function readData($arquivoJson){
    $arquivoJsonAtual = json_decode(file_get_contents($arquivoJson),true);
    echo json_encode($arquivoJsonAtual);
}

function deleteData($data,$arquivoJson){
    $arquivoJsonAtual = json_decode(file_get_contents($arquivoJson),true);
    $novoJson = [];
        for ($i=0; $i < count($arquivoJsonAtual); $i++){
            if($arquivoJsonAtual[$i]['id'] == $data){
                unset($arquivoJsonAtual[$i]);
                $novoJson = array_values($arquivoJsonAtual);
                file_put_contents($arquivoJson,json_encode($novoJson,JSON_PRETTY_PRINT));
            }
        }
}