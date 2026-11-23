
"use strict";

// ==========================================
// MATHLAB PRO - CONVERSOR DE BASES
// INTEGRADO AO SUPABASE
// ==========================================

let historicoBases = [];

// ==========================================
// INTERFACE
// ==========================================

function baseHTML() {

    return `
        <div class="card">

            <h2>Conversor de Bases</h2>

            <input
                id="baseInput"
                placeholder="Digite o número"
                oninput="validateInput()"
                autocomplete="off"
            >

            <div class="row">

                <select
                    id="fromBase"
                    onchange="validateInput()"
                >
                    <option value="10">Decimal</option>
                    <option value="2">Binário</option>
                    <option value="16">Hexadecimal</option>
                    <option value="8">Octal</option>
                </select>

                <span>→</span>

                <select id="toBase">
                    <option value="2">Binário</option>
                    <option value="10">Decimal</option>
                    <option value="16">Hexadecimal</option>
                    <option value="8">Octal</option>
                </select>

            </div>

            <button class="action" onclick="convertBase()">
                Converter
            </button>

            <p id="baseResult"></p>

            <p id="baseStatus"></p>

            <div class="explicacao">

                <h3>Como funciona a conversão de bases?</h3>

                <p>
                    Sistemas numéricos são formas diferentes de representar
                    números utilizando bases distintas.
                </p>

                <ul>
                    <li><strong>Base 2 (Binário):</strong> utiliza 0 e 1.</li>
                    <li><strong>Base 8 (Octal):</strong> utiliza números de 0 a 7.</li>
                    <li><strong>Base 10 (Decimal):</strong> utiliza números de 0 a 9.</li>
                    <li><strong>Base 16 (Hexadecimal):</strong> utiliza 0–9 e A–F.</li>
                </ul>

                <h4>Como o cálculo é feito?</h4>

                <p>
                    Primeiro, o número é convertido para decimal.
                    Depois, o valor decimal é convertido para a base desejada.
                </p>

                <p>
                    <strong>
                        Valor Decimal = soma dos dígitos × (base^posição)
                    </strong>
                </p>

                <h4>Exemplo</h4>

                <p>
                    Converter o número binário 1011 para decimal:
                </p>

                <p>
                    (1×2³) + (0×2²) + (1×2¹) + (1×2⁰)
                    = 8 + 0 + 2 + 1 = <strong>11</strong>
                </p>

                <p>
                    Convertendo 11 para hexadecimal, temos:
                    <strong>B</strong>.
                </p>

                <p>
                    Esse processo é amplamente utilizado na computação,
                    principalmente em sistemas digitais e programação.
                </p>

            </div>

        </div>

        <div class="card">

            <h3>Histórico de conversões</h3>

            <div id="baseHistory">
                Carregando histórico...
            </div>

        </div>
    `;
}

// ==========================================
// VALIDAÇÃO
// ==========================================

function validateInput() {

    const input = document.getElementById("baseInput");
    const fromElement = document.getElementById("fromBase");

    if (!input || !fromElement) return;

    const base = Number(fromElement.value);

    let value = input.value.toUpperCase();

    if (base === 2) {
        value = value.replace(/[^01]/g, "");
    } else if (base === 8) {
        value = value.replace(/[^0-7]/g, "");
    } else if (base === 10) {
        value = value.replace(/[^0-9]/g, "");
    } else if (base === 16) {
        value = value.replace(/[^0-9A-F]/g, "");
    }

    input.value = value;
}

// ==========================================
// CONVERSÃO PARA BIGINT
// PERMITE NÚMEROS INTEIROS GRANDES
// ==========================================

function converterParaDecimalBigInt(numero, base) {

    const digitos = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let resultado = 0n;

    numero = numero.toUpperCase();

    for (const caractere of numero) {

        const valor = digitos.indexOf(caractere);

        if (valor < 0 || valor >= base) {

            throw new Error(
                "Número inválido para a base selecionada."
            );

        }

        resultado =
            resultado * BigInt(base) + BigInt(valor);

    }

    return resultado;
}

// ==========================================
// CONVERSÃO PRINCIPAL
// ==========================================

async function convertBase() {

    const inputElement = document.getElementById("baseInput");
    const fromElement = document.getElementById("fromBase");
    const toElement = document.getElementById("toBase");

    const resultElement = document.getElementById("baseResult");
    const statusElement = document.getElementById("baseStatus");

    if (
        !inputElement ||
        !fromElement ||
        !toElement ||
        !resultElement ||
        !statusElement
    ) {
        return;
    }

    const input = inputElement.value.trim();

    const fromBase = Number(fromElement.value);
    const toBase = Number(toElement.value);

    resultElement.textContent = "";
    statusElement.textContent = "";

    if (!input) {

        resultElement.textContent =
            "Digite um número para converter.";

        return;
    }

    const basesValidas = [2, 8, 10, 16];

    if (
        !basesValidas.includes(fromBase) ||
        !basesValidas.includes(toBase)
    ) {

        resultElement.textContent =
            "Selecione uma base válida.";

        return;
    }

    try {

        // Converter o número original para decimal
        const decimal = converterParaDecimalBigInt(
            input,
            fromBase
        );

        // Converter decimal para a base desejada
        const resultado = decimal
            .toString(toBase)
            .toUpperCase();

        resultElement.innerHTML = `
            <div class="history-item">
                <h3>Resultado da conversão</h3>
                <p>
                    <strong>${escaparHTMLBase(resultado)}</strong>
                </p>
            </div>
        `;

        const expressao =
            `${input.toUpperCase()} (base ${fromBase}) → ` +
            `${resultado} (base ${toBase})`;

        // Atualizar histórico local
        historicoBases.unshift({
            expressao: expressao,
            resultado_texto: resultado,
            created_at: new Date().toISOString()
        });

        historicoBases = historicoBases.slice(0, 5);

        atualizarHistoricoBases();

        statusElement.textContent = "Salvando conversão...";

        // Salvar no Supabase
        await salvarConversaoBase(
            expressao,
            resultado
        );

    } catch (erro) {

        resultElement.textContent =
            "Número inválido para a base selecionada.";

        console.error("Erro na conversão:", erro);

    }

}

// ==========================================
// SALVAR NO SUPABASE
// ==========================================

async function salvarConversaoBase(expressao, resultado) {

    const statusElement = document.getElementById("baseStatus");

    try {

        if (
            typeof supabaseClient === "undefined" ||
            !supabaseClient
        ) {

            throw new Error(
                "Conexão com Supabase não encontrada."
            );

        }

        const { data: sessionData, error: sessionError } =
            await supabaseClient.auth.getSession();

        if (sessionError) throw sessionError;

        if (!sessionData.session) {

            throw new Error("Usuário não autenticado.");

        }

        const { error } = await supabaseClient
            .from("calculos")
            .insert({

                tipo: "conversor_bases",

                expressao: expressao,

                resultado_texto: resultado

            });

        if (error) throw error;

        if (statusElement) {

            statusElement.textContent =
                "Conversão salva no histórico!";

        }

        await carregarHistoricoBases();

    } catch (erro) {

        console.error("Erro ao salvar conversão:", erro);

        if (statusElement) {

            statusElement.textContent =
                "Conversão realizada, mas não foi possível salvar no banco.";

        }

    }

}

// ==========================================
// CARREGAR HISTÓRICO DO SUPABASE
// ==========================================

async function carregarHistoricoBases() {

    const historyElement = document.getElementById("baseHistory");

    if (!historyElement) return;

    try {

        if (
            typeof supabaseClient === "undefined" ||
            !supabaseClient
        ) {

            throw new Error("Supabase indisponível.");

        }

        const { data, error } = await supabaseClient
            .from("calculos")
            .select("expressao, resultado_texto, created_at")
            .eq("tipo", "conversor_bases")
            .order("created_at", { ascending: false })
            .limit(5);

        if (error) throw error;

        historicoBases = data || [];

        atualizarHistoricoBases();

    } catch (erro) {

        console.error("Erro ao carregar histórico:", erro);

        historyElement.textContent =
            "Não foi possível carregar o histórico.";

    }

}

// ==========================================
// ATUALIZAR HISTÓRICO NA INTERFACE
// ==========================================

function atualizarHistoricoBases() {

    const historyElement = document.getElementById("baseHistory");

    if (!historyElement) return;

    if (historicoBases.length === 0) {

        historyElement.textContent =
            "Nenhuma conversão realizada ainda.";

        return;
    }

    historyElement.innerHTML = historicoBases
        .slice(0, 5)
        .map(item => `

            <div class="history-item">

                <p>
                    <strong>
                        ${escaparHTMLBase(item.expressao)}
                    </strong>
                </p>

                <small>
                    ${formatarDataBase(item.created_at)}
                </small>

            </div>

        `)
        .join("");

}

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function escaparHTMLBase(texto) {

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

function formatarDataBase(data) {

    if (!data) return "";

    return new Date(data).toLocaleString("pt-BR");

}

// ==========================================
// TECLADO
// ==========================================

document.addEventListener("keydown", function(event) {

    const input = document.getElementById("baseInput");

    if (!input || document.activeElement !== input) return;

    if (event.key === "Enter") {

        event.preventDefault();

        convertBase();

    }

});
