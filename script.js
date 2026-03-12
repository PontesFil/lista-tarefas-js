let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

const input = document.getElementById("inputTarefa");
const botao = document.getElementById("btnAdicionar");
const lista = document.getElementById("lista");
const btnLimpar = document.getElementById("btnLimpar");
const contador = document.getElementById("contador");
const filtroTodas = document.getElementById("filtroTodas");
const filtroPendentes = document.getElementById("filtroPendentes");
const filtroConcluidas = document.getElementById("filtroConcluidas");

let filtroAtual = localStorage.getItem("filtroAtual") || "todas";

function salvarNoLocalStorage() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function removerTarefa(id) {

    tarefas = tarefas.filter(function (tarefa) {
        return tarefa.id !== id;
    });

    salvarNoLocalStorage();

    renderizarTarefas();

}

function limparTarefas() {

    const confirmar = confirm("Tem certeza que deseja apagar todas as tarefas?");

    if (!confirmar) return;

    tarefas = [];

    salvarNoLocalStorage();

    renderizarTarefas();

}

function alternarConclusao(id) {

    tarefas = tarefas.map(function (tarefa) {

        if (tarefa.id === id) {
                tarefa.concluida = !tarefa.concluida;
        }

        return tarefa;

    });

    salvarNoLocalStorage();

    renderizarTarefas();

}

function renderizarTarefas() {

        lista.innerHTML = "";

        const total = tarefas.length;
        const pendentes = tarefas.filter(t => !t.concluida).length;
        const concluidas = tarefas.filter(t => t.concluida).length;

        contador.textContent = `Total: ${total} | Pendentes: ${pendentes} | Concluídas: ${concluidas}`;

        filtroTodas.classList.remove("filtro-ativo");
        filtroPendentes.classList.remove("filtro-ativo");
        filtroConcluidas.classList.remove("filtro-ativo");

        if (filtroAtual === "todas") filtroTodas.classList.add("filtro-ativo");
        if (filtroAtual === "pendentes") filtroPendentes.classList.add("filtro-ativo");
        if (filtroAtual === "concluidas") filtroConcluidas.classList.add("filtro-ativo");
        
        let tarefasFiltradas = tarefas;

         if (filtroAtual === "pendentes") {
            tarefasFiltradas = tarefas.filter(function (tarefa) {
                return tarefa.concluida === false;
             });
        }

        if (filtroAtual === "concluidas") {
            tarefasFiltradas = tarefas.filter(function (tarefa) {
                return tarefa.concluida === true;
            });
        }

    tarefasFiltradas.forEach(function (tarefa) {

            const li = document.createElement("li");

            if (tarefa.concluida) {
                li.style.textDecoration = "line-through";
                li.style.opacity = "0.6";
            }

            li.textContent = tarefa.texto;

            li.addEventListener("click", function (e) {

                if (e.target.tagName !== "BUTTON") {
                    alternarConclusao(tarefa.id);
                }

            });

            const botaoRemover = document.createElement("button");
            botaoRemover.textContent = "Remover";

            botaoRemover.onclick = function () {

                const confirmar = confirm("Deseja remover esta tarefa?");

                 if (!confirmar) return;

                removerTarefa(tarefa.id);

};

            const botaoEditar = document.createElement("button");
            botaoEditar.textContent = "Editar";

            botaoEditar.onclick = function () {

                let novoTexto = prompt("Editar tarefa:", tarefa.texto);

                if (novoTexto === null) return;

                tarefa.texto = novoTexto.trim();

                salvarNoLocalStorage();

                renderizarTarefas();
            };

            const containerBotoes = document.createElement("div");

                containerBotoes.appendChild(botaoEditar);
                containerBotoes.appendChild(botaoRemover);

                li.appendChild(containerBotoes);
                lista.appendChild(li);

        });

}

btnLimpar.onclick = function () {
         limparTarefas();
}

botao.onclick = function () {

        const texto = input.value.trim();

        if (texto === "") return;

         tarefas.push({
            id: Date.now(),
            texto: texto,
            concluida: false
        });

        salvarNoLocalStorage();

        renderizarTarefas();

        input.value = "";

        input.focus();

}

filtroTodas.onclick = function () {
    filtroAtual = "todas";
    localStorage.setItem("filtroAtual", filtroAtual);
    renderizarTarefas();
}

filtroPendentes.onclick = function () {
    filtroAtual = "pendentes";
    localStorage.setItem("filtroAtual", filtroAtual);
    renderizarTarefas();
}

filtroConcluidas.onclick = function () {
    filtroAtual = "concluidas";
    localStorage.setItem("filtroAtual", filtroAtual);
    renderizarTarefas();
}

input.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            botao.click();
        }

});

    renderizarTarefas();