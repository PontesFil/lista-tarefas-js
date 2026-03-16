let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

const input = document.getElementById("inputTarefa");
const botao = document.getElementById("btnAdicionar");

const colunaTodo = document.querySelector("#todo .lista");
const colunaDoing = document.querySelector("#doing .lista");
const colunaDone = document.querySelector("#done .lista");

const btnLimpar = document.getElementById("btnLimpar");
const contador = document.getElementById("contador");

const filtroTodas = document.getElementById("filtroTodas");
const filtroPendentes = document.getElementById("filtroPendentes");
const filtroConcluidas = document.getElementById("filtroConcluidas");

let filtroAtual = localStorage.getItem("filtroAtual") || "todas";

/* Corrigir tarefas antigas */
tarefas = tarefas.map(t => ({
    id: t.id,
    texto: t.texto,
    data: t.data || new Date().toLocaleDateString(),
    status: t.status || "todo"
}));

function salvarNoLocalStorage(){
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function removerTarefa(id){

    if(!confirm("Deseja remover esta tarefa?")) return;

    tarefas = tarefas.filter(t => t.id !== id);

    salvarNoLocalStorage();
    renderizarTarefas();
}

function limparTarefas(){

    if(!confirm("Tem certeza que deseja apagar todas as tarefas?")) return;

    tarefas=[];

    salvarNoLocalStorage();
    renderizarTarefas();
}

function editarTarefa(tarefa){

    let novoTexto = prompt("Editar tarefa:", tarefa.texto);

    if(novoTexto===null) return;

    novoTexto = novoTexto.trim();

    if(novoTexto==="") return;

    tarefa.texto = novoTexto;

    salvarNoLocalStorage();
    renderizarTarefas();
}

function aplicarFiltro(lista){

    if(filtroAtual==="pendentes"){
        return lista.filter(t => t.status!=="done");
    }

    if(filtroAtual==="concluidas"){
        return lista.filter(t => t.status==="done");
    }

    return lista;
}

function atualizarFiltroVisual(){

    filtroTodas.classList.remove("filtro-ativo");
    filtroPendentes.classList.remove("filtro-ativo");
    filtroConcluidas.classList.remove("filtro-ativo");

    if(filtroAtual==="todas") filtroTodas.classList.add("filtro-ativo");
    if(filtroAtual==="pendentes") filtroPendentes.classList.add("filtro-ativo");
    if(filtroAtual==="concluidas") filtroConcluidas.classList.add("filtro-ativo");
}

function getCardDepoisDaPosicao(coluna, y) {

    const cards = [...coluna.querySelectorAll(".card:not(.arrastando)")];

    if (cards.length === 0) return null;

    return cards.reduce((maisProximo, card) => {

        const box = card.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > maisProximo.offset) {
            return { offset: offset, element: card };
        } else {
            return maisProximo;
        }

    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function renderizarTarefas(){

    colunaTodo.innerHTML="";
    colunaDoing.innerHTML="";
    colunaDone.innerHTML="";

    atualizarFiltroVisual();

    const tarefasFiltradas = aplicarFiltro(tarefas);

    contador.textContent = `Total de tarefas: ${tarefasFiltradas.length}`;

    tarefasFiltradas.forEach(tarefa => {

        const card = document.createElement("div");
        card.className="card";
        card.draggable = true;
        card.dataset.id = tarefa.id;

        card.addEventListener("dragstart", (e) => {

    card.classList.add("arrastando");

    e.dataTransfer.setData("text/plain", tarefa.id);
    e.dataTransfer.effectAllowed = "move";

});

card.addEventListener("dragend", () => {

    card.classList.remove("arrastando");

});

        const texto = document.createElement("p");
        texto.textContent=tarefa.texto;

        const data = document.createElement("small");
        data.textContent=tarefa.data;

        const btnEditar = document.createElement("button");
        btnEditar.textContent="Editar";
        btnEditar.onclick=()=>editarTarefa(tarefa);

        const btnRemover = document.createElement("button");
        btnRemover.textContent="Remover";
        btnRemover.onclick=()=>removerTarefa(tarefa.id);

        const botoes = document.createElement("div");

        botoes.appendChild(btnEditar);
        botoes.appendChild(btnRemover);

        card.appendChild(texto);
        card.appendChild(data);
        card.appendChild(botoes);

        if(tarefa.status==="todo") colunaTodo.appendChild(card);
        if(tarefa.status==="doing") colunaDoing.appendChild(card);
        if(tarefa.status==="done") colunaDone.appendChild(card);

    });
}

/* DRAG AND DROP */

function iniciarDragDrop(){

    const colunas = [colunaTodo, colunaDoing, colunaDone];

    colunas.forEach(coluna => {

        coluna.addEventListener("dragover", (e) => {

            e.preventDefault();

            const cardArrastando = document.querySelector(".arrastando");

            if (!cardArrastando) return;

            const depoisDoCard = getCardDepoisDaPosicao(coluna, e.clientY);

            if (depoisDoCard == null) {
                coluna.appendChild(cardArrastando);
            } else {
                coluna.insertBefore(cardArrastando, depoisDoCard);
            }

        });

        coluna.addEventListener("drop", () => {

            const cardArrastando = document.querySelector(".arrastando");

            if (!cardArrastando) return;

            const id = Number(cardArrastando.dataset.id);

            const tarefa = tarefas.find(t => t.id === id);

            if (coluna === colunaTodo) tarefa.status = "todo";
            if (coluna === colunaDoing) tarefa.status = "doing";
            if (coluna === colunaDone) tarefa.status = "done";

            salvarNoLocalStorage();
           
        });

    });

}

/* BOTÕES */

botao.onclick=function(){

    const texto=input.value.trim();

    if(texto==="") return;

    tarefas.push({
        id:Date.now(),
        texto:texto,
        data:new Date().toLocaleDateString(),
        status:"todo"
    });

    salvarNoLocalStorage();
    renderizarTarefas();

    input.value="";
    input.focus();
}

btnLimpar.onclick=limparTarefas;

filtroTodas.onclick=()=>{
    filtroAtual="todas";
    localStorage.setItem("filtroAtual",filtroAtual);
    renderizarTarefas();
};

filtroPendentes.onclick=()=>{
    filtroAtual="pendentes";
    localStorage.setItem("filtroAtual",filtroAtual);
    renderizarTarefas();
};

filtroConcluidas.onclick=()=>{
    filtroAtual="concluidas";
    localStorage.setItem("filtroAtual",filtroAtual);
    renderizarTarefas();
};

input.addEventListener("keydown",e=>{
    if(e.key==="Enter") botao.click();
});

iniciarDragDrop();
renderizarTarefas();