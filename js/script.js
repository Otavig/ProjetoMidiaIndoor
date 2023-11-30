// --------------------
// DECLARAR AS VARS 
// --------------------

// URL
const URL_API = "http://10.111.9.16:3000"

// NAVBAR
const btn_Cadastrar = document.getElementById("btn_Cadastrar");
const btn_Atualizar = document.getElementById("btn_Atualizar");
const btn_Busca = document.getElementById("btn_Busca");
const btn_Exibir = document.getElementById("btn_Exibir");

// CADASTRO
const cadastro_nome_midia = document.getElementById("cadastro_nome_midia");
const cadastro_tipos = document.getElementById("cadastro_tipo"); // Corrigido: troquei para o ID correto
const cadastro_data_inicio = document.getElementById("cadastro_data_inicio");
const cadastro_data_fim = document.getElementById("cadastro_data_fim");
const cadastro_status = document.getElementById("cadastro_status");
const cadastro_tempo = document.getElementById("cadastro_tempo");
const cadastro_url = document.getElementById("cadastro_url");

const cadastro_btn_cadastro = document.getElementById("cadastro_btn_cadastro");
const cadastro_btn_limpar = document.getElementById("cadastro_btn_limpar");
const cadastro_btn_voltar = document.getElementById("cadastro_btn_voltar");

// ATUALIZAR
const atualizar_id_editar = document.getElementById("atualizar_id_editar");
const atualizar_nome_midia = document.getElementById("atualizar_nome_midia"); // Corrigido: estava com erro de digitação
const atualizar_tipos = document.getElementById("atualizar_tipos");
const atualizar_data_inicio = document.getElementById("atualizar_data_inicio");
const atualizar_data_fim = document.getElementById("atualizar_data_fim");
const atualizar_status = document.getElementById("atualizar_status");
const atualizar_tempo = document.getElementById("atualizar_tempo");
const atualizar_url = document.getElementById("atualizar_url");

const atualizar_btn_dados = document.getElementById("atualizar_btn_dados");
const atualizar_btn_limpar = document.getElementById("atualizar_btn_limpar");
const atualizar_btn_voltar = document.getElementById("atualizar_btn_voltar")


// BUSCA
let modoEdicaoAtivo = false;
const input_busca = document.getElementById("input_busca");
const busca_opcoes = document.getElementById("busca_opcoes");
const busca_btn_verificar = document.getElementById("busca_btn_verificar");
const busca_saida = document.getElementById("busca_saida");

// ---------------------
// FUNÇÕES DO CÓDIGO
// ---------------------


/**
 * Função para atualizar o ocultar
 */

function toggleOculto() {
    var navItem = document.querySelector('.oculto');

    if (navItem.classList.contains('oculto')) {
        navItem.classList.remove('oculto');
    } else {
        navItem.classList.add('oculto');
    }
}

/**
 * Função para mostrar/ocultar divs
 */

function mostrarDiv(id) {
    // Obtém todas as divs
    var divs = document.querySelectorAll('.content');

    // Oculta todas as outras divs
    divs.forEach(div => {
        if (div.id !== id) {
            div.style.display = 'none';
        }
    });

    // Obtém a div desejada
    var div = document.getElementById(id);

    // Verifica o estado atual da div
    var estaVisivel = div.style.display === 'block';

    // Alterna a visibilidade da div
    div.style.display = estaVisivel ? 'none' : 'block';
}


/**
 * Função para limpar os campos do formulário de cadastro
 */



// ---------------------
// EVENTOS DO CÓDIGO
// ---------------------

// Evento cadastrar
btn_Cadastrar.addEventListener("click", async () => {
    let nome = document.getElementById("cadastro_nome_midia").value
    let tipo = document.getElementById("cadastro_tipo").value
    let data_inicio = document.getElementById("cadastro_data_inicio").value
    let data_fim = document.getElementById("cadastro_data_fim").value
    let status = document.getElementById("cadastro_status").value
    let tempo = document.getElementById("cadastro_tempo").value
    let url = document.getElementById("cadastro_url").value

    let dados = await fetch(`${URL_API}/api/midia_indoor`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome: nome, tipo: tipo, data_inicio: data_inicio, data_fim: data_fim, status: status, tempo: tempo, ur: url }),
    });

    if (dados.ok) {
        btn_Busca.click()
        busca_btn_verificar.click()
    }

})

// Evento buscar {REFAZER COM AS NOVAS OPÇÕES}


busca_btn_verificar.addEventListener("click", async () => {
    let busca = document.getElementById("input_busca").value;
    let opcao = document.getElementById("busca_opcoes").value;
    let html = `<table class="table">
                    <thead>
                    <tr>    
                        <th scope="col">id</th>
                        <th scope="col" class='text-start'>Nome</th>
                        <th scope="col" class='text-start'>Url</th>
                        <th scope="col">Editar</i></th>
                        <th scope="col">Excluir</th>
                    </tr>
                    </thead>
                    <tbody>`;

    document.getElementById("busca_saida").innerHTML = "";
    document.getElementById("input_busca").value = ""

    let resposta = "";
    if (opcao == "todos") {
        resposta = await fetch(`${URL_API}/api/midia_indoor`);
    } else if (opcao == "id") {
        resposta = await fetch(`${URL_API}/api/midia_indoor/id/${busca}`);
    } else if (opcao == "nome") {
        resposta = await fetch(`${URL_API}/api/midia_indoor/nome/${busca}`);
    }

    if (resposta.ok) {
        html = html;
        let array_resultado = await resposta.json();
        if (opcao == "todos" || opcao == "nome") {
            for (const dados of array_resultado) {
                html += `<tr>                
            <td>${dados.id}</td>
            <td class='text-start'>${dados.nome}</td>
            <td class='text-start'>${dados.url}</td>
            <td><i onclick="editar(${dados.id})" class="bi bi-pencil"></td>
            <td><i onclick="excluir(${dados.id})" class="bi bi-trash"></i></td>
            </tr>`;
            }
        } else if (opcao == "id") {
            html += `<tr>                
            <td>${array_resultado.id}</td>
            <td class='text-start'>${array_resultado.nome}</td>
            <td class='text-start'>${array_resultado.url}</td>
            <td><i class="bi bi-pencil"></td>
            <td><i class="bi bi-trash"></i></td>
            </tr>`;
        }

        html += `</tbody></table>`;
    }
    document.getElementById("busca_saida").innerHTML = html;


});


// Evento para atualizar os dados

atualizar_btn_voltar.addEventListener("click", async () => {
    let nome_atualizado = document.getElementById("atualizar_nome_midia").value
    let tipo_atualizado = document.getElementById("atualizar_tipos").value
    let data_inicio_atualizado = document.getElementById("atualizar_data_inicio").value
    let data_fim_atualizado = document.getElementById("atualizar_data_fim").value
    let status_atualizado = document.getElementById("atualizar_status").value
    let tempo_atualizado = document.getElementById("atualizar_tempo").value
    let url_atualizado = document.getElementById("atualizar_url").value
    let id = document.getElementById("atualizar_id_editar").value


    let dados = await fetch(`${URL_API}/api/midia_indoor`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, nome: nome_atualizado, tipo: tipo_atualizado, data_inicio: data_inicio_atualizado, data_fim: data_fim_atualizado, status: status_atualizado, tempo: tempo_atualizado, url: url_atualizado }),
    });

    if (dados.ok) {
        btn_Busca.click()
        busca_btn_verificar.click()
    }

})

/* Função para editar usuário
    */

async function editar(id) {

    let resposta = await fetch(`${URL_API}/api/midia_indoor/id/${id}`);

    if (resposta.ok) {
        let dados = await resposta.json();
        console.clear()
        console.log(dados)
        atualizar_btn_dados.click()

        document.getElementById("atualizar_nome_midia").value = dados.nome
        document.getElementById("atualizar_tipos").value = dados.tipo
        document.getElementById("atualizar_data_inicio").value = dados.data_inicio
        document.getElementById("atualizar_data_fim").value = dados.data_fim
        document.getElementById("atualizar_status").value = dados.status
        document.getElementById("atualizar_tempo").value = dados.tempo
        document.getElementById("atualizar_url").value = dados.url
        document.getElementById("atualizar_id_editar").value = dados.id

    }
}


/* Função para excluir usuário
*/


async function excluir(id) {

    let dados = await fetch(`${URL_API}/api/midia_indoor/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (dados.ok) {
        btn_Busca.click()
        busca_btn_verificar.click()
    }

}


// Evento para limpar os inputs do cadastrar
cadastro_btn_limpar.addEventListener("click", () => {
    // Chama a função para limpar os campos
    limparFormularioCadastro();
});

// Evento para limpar os inputs do Atualizar
atualizar_btn_limpar.addEventListener("click", () => {
    // Chama a função para limpar os campos
    limparFormularioAtualizacao();
});



// Copyright @ 2023
console.log("        /\\_/\\ Copyright © 2023");
console.log("       ( o.o ) Otávio, Breno, Isa e Kauana.");
console.log("        > ^ < Todos os direitos reservados.");