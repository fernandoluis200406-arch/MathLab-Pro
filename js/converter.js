
"use strict";

// ========================================
// MATHLAB PRO - CONVERSOR DE COMPRIMENTO
// INTEGRAÇÃO COM SUPABASE
// ========================================

const units = {
    mm: 0.001,
    cm: 0.01,
    dm: 0.1,
    m: 1,
    dam: 10,
    hm: 100,
    km: 1000
};

let historicoConversoes = [];

// ========================================
// INTERFACE
// ========================================

function converterHTML() {

    return `
        <div class="card">

            <h2>Conversor de Comprimento</h2>

            <input
                type="number"
                id="value"
                placeholder="Valor"
                step="any"
            >

            <select id="fromUnit">
                ${createOptions()}
            </select>

            <select id="toUnit">
                ${createOptions()}
            </select>

            <button class="action" onclick="convert()">
                Converter
            </button>

            <div id="convResult"></div>

            <p id="conversionStatus"></p>

            <h3>Histórico de Conversões</h3>

            <ul id="conversionHistory"></ul>

            <div class="explicacao">

                <h3>📘 Como funciona a conversão?</h3>

                <p>
                    A conversão de unidades de comprimento é feita
                    utilizando o metro (m) como base padrão.
                    Todas as outras unidades são convertidas primeiro
                    para metros e depois para a unidade desejada.
                </p>

                <h4>📐 Etapas do cálculo:</h4>

                <p>
                    1. Converter o valor inicial para metros:
                    <br>
                    <strong>
                        metros = valor × fator da unidade de origem
                    </strong>
                </p>

                <p>
                    2. Converter de metros para a unidade desejada:
                    <br>
                    <strong>
                        resultado = metros ÷ fator da unidade destino
                    </strong>
                </p>

                <h4>📊 Exemplo:</h4>

                <p>Converter 2 km para metros:</p>

                <p>
                    1. 2 × 1000 = 2000 m
                    <br>
                    2. Resultado final: <strong>2000 m</strong>
                </p>

                <p>
                    Isso funciona porque o sistema métrico é baseado
                    em múltiplos de 10, facilitando conversões entre
                    as unidades.
                </p>

                <h4>📏 Unidades disponíveis</h4>

                <ul>
                    <li>Milímetro (mm)</li>
                    <li>Centímetro (cm)</li>
                    <li>Decímetro (dm)</li>
                    <li>Metro (m)</li>
                    <li>Decâmetro (dam)</li>
                    <li>Hectômetro (hm)</li>
                    <li>Quilômetro (km)</li>
                </ul>

            </div>

        </div>
    `;
}

// ========================================
// OPÇÕES DE UNIDADES
// ========================================

function createOptions() {

    return Object.keys(units)
        .map(unit => {
            return `<option value="${unit}">${unit}</option>`;
        })
        .join("");

}

// ========================================
// FORMATAR RESULTADO
// ========================================

function formatarConversao(valor) {

    return Number(valor).toLocaleString("pt-BR", {
        maximumFractionDigits: 10
    });

}

// ========================================
// REALIZAR CONVERSÃO
// ========================================

async function convert() {

    const input = document.getElementById("value");
    const fromElement = document.getElementById("fromUnit");
    const toElement = document.getElementById("toUnit");

    const resultElement = document.getElementById("convResult");
    const status = document.getElementById("conversionStatus");

    if (
        !input ||
        !fromElement ||
        !toElement ||
        !resultElement ||
        !status
    ) {
        return;
    }

    const value = Number(input.value);

    const from = fromElement.value;
    const to = toElement.value;

    resultElement.textContent = "";
    status.textContent = "";

    // ====================================
    // VALIDAÇÃO
    // ====================================

    if (
        input.value.trim() === "" ||
        !Number.isFinite(value)
    ) {

        resultElement.textContent =
            "Informe um valor numérico válido.";

        return;
    }

    if (
        !Object.prototype.hasOwnProperty.call(units, from) ||
        !Object.prototype.hasOwnProperty.call(units, to)
    ) {

        resultElement.textContent =
            "Selecione unidades de comprimento válidas.";

        return;
    }

    // ====================================
    // CÁLCULO
    // ====================================

    const metros = value * units[from];

    const resultado = metros / units[to];

    if (
        !Number.isFinite(metros) ||
        !Number.isFinite(resultado)
    ) {

        resultElement.textContent =
            "Não foi possível realizar a conversão. Verifique o valor informado.";

        return;
    }

    const resultadoFormatado = formatarConversao(resultado);

    const expressao =
        `${formatarConversao(value)} ${from} = ${resultadoFormatado} ${to}`;

    resultElement.innerHTML = `
        <div class="history-item">
            <h3>Resultado da conversão</h3>
            <p><strong>${escaparHTMLConversao(expressao)}</strong></p>
        </div>
    `;

    status.textContent = "Salvando conversão...";

    // ====================================
    // HISTÓRICO LOCAL
    // ====================================

    historicoConversoes.unshift({
        expressao: expressao,
        resultado: resultado
    });

    historicoConversoes = historicoConversoes.slice(0, 5);

    atualizarHistoricoConversoes();

    // ====================================
    // SALVAR NO SUPABASE
    // ====================================

    await salvarConversao(value, from, to, resultado);

}

// ========================================
// SALVAR CONVERSÃO NO SUPABASE
// ========================================

async function salvarConversao(value, from, to, result) {

    const status = document.getElementById("conversionStatus");

    try {

        if (
            typeof supabaseClient === "undefined" ||
            !supabaseClient
        ) {
            throw new Error("Conexão com Supabase não encontrada.");
        }

        const { data: sessionData, error: sessionError } =
            await supabaseClient.auth.getSession();

        if (sessionError) throw sessionError;

        if (!sessionData.session) {
            throw new Error("Usuário não autenticado.");
        }

        const expressao =
            `${formatarConversao(value)} ${from} = ` +
            `${formatarConversao(result)} ${to}`;

        const { error } = await supabaseClient
            .from("calculos")
            .insert({

                tipo: "conversor_comprimento",

                expressao: expressao,

                valor_inicial: value,

                resultado: result

            });

        if (error) throw error;

        if (status) {
            status.textContent = "Conversão salva na nuvem.";
        }

        await carregarHistoricoConversoes();

    } catch (error) {

        console.error("Erro ao salvar conversão:", error);

        if (status) {

            status.textContent =
                "Conversão realizada, mas não foi possível salvar no banco.";

        }

    }

}

// ========================================
// CARREGAR HISTÓRICO DO SUPABASE
// ========================================

async function carregarHistoricoConversoes() {

    const status = document.getElementById("conversionStatus");

    const lista = document.getElementById("conversionHistory");

    if (
        typeof supabaseClient === "undefined" ||
        !supabaseClient
    ) {

        if (lista) {
            lista.textContent = "Conexão com Supabase indisponível.";
        }

        return;
    }

    try {

        const { data, error } = await supabaseClient
            .from("calculos")
            .select("expressao, resultado, created_at")
            .eq("tipo", "conversor_comprimento")
            .order("created_at", { ascending: false })
            .limit(5);

        if (error) throw error;

        historicoConversoes = data || [];

        atualizarHistoricoConversoes();

        if (status) {

            status.textContent = historicoConversoes.length
                ? "Histórico sincronizado com o Supabase."
                : "Nenhuma conversão registrada ainda.";

        }

    } catch (error) {

        console.error("Erro ao carregar conversões:", error);

        if (status) {

            status.textContent =
                "Não foi possível carregar o histórico.";

        }

    }

}

// ========================================
// EXIBIR HISTÓRICO
// ========================================

function atualizarHistoricoConversoes() {

    const lista = document.getElementById("conversionHistory");

    if (!lista) return;

    lista.innerHTML = "";

    if (historicoConversoes.length === 0) {

        const li = document.createElement("li");

        li.textContent = "Nenhuma conversão registrada ainda.";

        lista.appendChild(li);

        return;
    }

    historicoConversoes.slice(0, 5).forEach(item => {

        const li = document.createElement("li");

        li.textContent = item.expressao;

        lista.appendChild(li);

    });

}

// ========================================
// PROTEÇÃO DE TEXTO HTML
// ========================================

function escaparHTMLConversao(texto) {

    return String(texto ?? "").replace(/[&<>"']/g, caractere => {

        const entidades = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entidades[caractere];

    });

}

// ========================================
// TECLADO
// ========================================

document.addEventListener("keydown", function(event) {

    const input = document.getElementById("value");

    if (!input || document.activeElement !== input) return;

    if (event.key === "Enter") {

        event.preventDefault();

        convert();

    }

});
