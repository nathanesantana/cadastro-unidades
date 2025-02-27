$(document).ready(function(){
    lerDados()

    $("#formulario").submit(function (e){
        e.preventDefault()

        function getData(){
            return dados = {
                'id': $("#id").val(),
                'nome' : $("#nome").val(),
                'endereco' : $("#endereco").val(),
                'cep' : $("#cep").val(),
                'cidade' : $("#cidade").val(),
                'estado' : $("#estado").val(),
                'internacao' : $(`input[type="radio"]:checked`).val(),
                'quartos': $("#quartos").val(),
                'leitos': $("#leitos").val(),
                'diretor': $("#diretor").val()
            }
        }

        function validacaoDeCampos(){
            let nome =  $("#nome").val()
            let endereco = $("#endereco").val()
            let cidade = $("#cidade").val()
            let estado = $("#estado").val()
            let internacao =  $(`input[type="radio"]:checked`).val()
            let quartos = $("#quartos").val()
            let leitos =  $("#leitos").val()

            if(nome === ""){
                $("#nome").addClass("validacao")
                $("#nomeError").text(' O nome é um campo obrigatório').show()
                return false;
            } else if(!isNaN(nome)){
                $("#nome").addClass("validacao")
                $("#nomeError").text('O nome não pode ser um número').show()
                return false;
            } else if(nome.length < 3){
                $("#nome").addClass("validacao")
                $("#nomeError").text('O nome não pode ter menos que 3 letras').show()
                return false;
            } else if(endereco == ""){
                $("#endereco").addClass("validacao")
                $("#enderecoError").text('O endereço é um campo obrigatório').show()
                return false;
            } else if (endereco.length < 3){
                $("#endereco").addClass("validacao")
                $("#enderecoError").text('O endereço não pode ter menos que 3 letras').show()
                return false;
            } else if(cidade === ""){
                $("#cidade").addClass("validacao")
                $("#cidadeError").text('Informe a cidade').show()
                return false;
            } else if(!isNaN(cidade)){
                $("#cidade").addClass("validacao")
                $("#cidadeError").text('O nome da cidade não pode ser um número').show()
                return false;
            } else if(cidade.length < 3){
                $("#cidade").addClass("validacao")
                $("#cidadeError").text('A cidade não pode ter menos que 3 letras').show()
                return false;
            } else if(estado == "NULL"){
                $("#estado").addClass("validacao")
                $("#estadoError").text('Informe o estado').show()
                return false;
            } else if(!internacao){
                $("#internacao").addClass("validacao")
                $("#internacaoError").text('O questionário é um campo obrigatório').show()
                return false;
            } else if(quartos === ""){
                $("#quartos").addClass("validacao")
                $("#quartosError").text('Informe o número de quartos').show()
                return false;
            } else if(quartos < 0){
                $("#quartos").addClass("validacao")
                $("#quartosError").text('O número de quartos é inválido').show()
                return false;
            } else if(leitos === ""){
                $("#leitos").addClass("validacao")
                $("#leitosError").text('Informe o número de leitos').show()
                return false;
            } else if(leitos < 0){
                $("#leitos").addClass("validacao")
                $("#leitosError").text('O número de leitos é inválido').show()
                return false;
            } else {
                $("#nomeError, #enderecoError, #cidadeError, #internacaoError, #estadoError, #quartosError, #leitosError").hide()
                $("#nome, #endereco, #cidade, #estado, #internacao, #quartos, #leitos").removeClass("validacao")
            }
            return true;
        } 

            if(validacaoDeCampos() == false){
               return;
            }

            let data = getData();
            if(data.id === ""){
                data.operacao = 'inserir'
                data.id = crypto.randomUUID();
            } else {
                data.operacao = 'editar'
            }
            $.ajax({
                url : 'backend.php',
                type: 'POST',
                contentType : 'application/json',
                data : JSON.stringify(data),
                success: function(response) {
                    console.log('sucesso ao salvar')
                    lerDados()
                    $("#formulario")[0].reset()
                    
                },
                erro: function () {
                    console.log('erro ao salvar')
                }
            })
    })

    function preencherTable(response) {
        let dados = typeof response === "string" ? JSON.parse(response) : response

        if ($.fn.DataTable.isDataTable("#table")) {
            $("#table").DataTable().destroy();
        }

        $("tbody").empty();
        let tbody = '';
        for (let i = 0; i < dados.length; i++){
            let paciente = dados[i]
            
            tbody += `
            <tr>
                <td>${paciente.id}</td>
                <td>${paciente.nome}</td>
                <td>${paciente.endereco}</td>
                <td>${paciente.cidade}</td>
                <td>${paciente.estado}</td>
                <td>${paciente.possui_internacao}</td>
                <td>${paciente.num_quartos}</td>
                <td>${paciente.num_leitos}</td>
                <td><button type="button" class="editar" data-id ="${paciente.id}" title="Editar" style="border: none"><i class="bi bi-pencil-square"></i></button></td>
                <td><button type="button" class="excluir" data-id="${paciente.id}" title="Excluir" style="border: none"><i class="bi bi-trash3"></i></button></td>
            </tr> `;
        }
        $("#table tbody").html(tbody)

        $("#table").DataTable({
            paging: true,
            searching: true,
            lengthMenu: [3, 5, 10],
            destroy: true,
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.13.5/i18n/pt-BR.json"
            }
        })
        
    }

    $(document).on("click", ".editar, .excluir", function () {
        let idPaciente = $(this).data("id");

        if ($(this).hasClass("editar")){
            buscarDados(idPaciente)
        } else if ($(this).hasClass("excluir")) {
            confirmarDelete(idPaciente)
        }
        
    });

    function lerDados(){
        $.ajax({
            url : 'backend.php',
            type: 'POST',
            contentType : 'application/json',
            data : JSON.stringify({operacao : 'ler'}),
            success: function(response){
                preencherTable(response)
                console.log('Sucesso ao ler dados')
            },
            error: function () {
                console.log('Erro ao ler dados')
            }
        })
    }

    function buscarDados(idPaciente){
        $.ajax({
            url : 'backend.php',
            type: 'POST',
            contentType : 'application/json',
            data : JSON.stringify({operacao : 'buscar', 'id': idPaciente}),
            success: function(response) {
                console.log('Sucesso ao buscar dados')
                preencherFormulario(response)
            },
            erro: function () {
                console.log('Erro ao buscar dados')
            }
        })
    }

    function preencherFormulario(response){
        let data = typeof response === "string" ? JSON.parse(response) : response
        $("#id").val(data.id),
        $("#nome").val(data.nome)
        $("#endereco").val(data.endereco),
        $("#cep").val(data.cep),
        $("#cidade").val(data.cidade),
        $("#estado").val(data.estado),
        $(`input[name="pergunta"][value="${data.possui_internacao}"]`).prop("checked", true),
        $("#quartos").val(data.num_quartos),
        $("#leitos").val(data.num_leitos),
        $("#diretor").val(data.diretor)
    }

    function confirmarDelete(idPaciente){
        if(confirm('Tem certeza que deseja excluir esse cadastro')){
            deleteData(idPaciente)
        } else {
            alert('Operação cancelada!')
        }
    }

    function deleteData(idPaciente){
        $.ajax({
            url : 'backend.php',
            type: 'POST',
            contentType : 'application/json',
            data : JSON.stringify({operacao : 'excluir', 'id': idPaciente}),
            success: function(response) {
                lerDados()
                console.log('Sucesso ao excluir dados')
            },
            erro: function () {
                console.log('Erro ao excluir dados')
            }
        })
    }
})