
"use strict";

// ==========================================
// MATHLAB PRO - ESTATÍSTICA
// INTEGRADO AO SUPABASE
// ==========================================

// ==========================================
// INTERFACE
// ==========================================

function statisticsHTML() {

    return `
        <div class="card">

            <h2>Estatística</h2>

            <p>
                Digite números separados por vírgula.
                Utilize ponto para casas decimais.
                Exemplo: 2, 4, 6, 8.5
            </p>

            <input
                id="nums"
                type="text"
                placeholder="Digite os números separados por vírgula"
            >

            <button class="action" onclick="calcStats()">
                Calcular
            </button>

            <div id="statResult"></div>

            <p id="statsStatus"></p>

        </div>

        <div class="card">

            <h3>Histórico de análises</h3>

            <div id="statsHistory">
                Carregando histórico...
            </div>

        </div>

        <div class="card">

            <div class="explicacao">

                <h3>O que são Média e Desvio Padrão?</h3>

                <p>
                    A média e o desvio padrão são medidas estatísticas
                    utilizadas para analisar um conjunto de dados.
                </p>

                <h4>Média Aritmética</h4>

                <p>
                    <strong>
                        Média = (x₁ + x₂ + ... + xₙ) / n
                    </strong>
                </p>

                <p>
                    A média representa o valor médio de um conjunto de números.
                </p>

                <h4>Variância</h4>

                <p>
                    A variância mede a dispersão dos valores em relação à média.
                </p>

                <p>
                    <strong>
                        Variância = Σ(x - média)² / n
                    </strong>
                </p>

                <h4>Desvio Padrão</h4>

                <p>
                    <strong>
                        σ = √(Σ(x - média)² / n)
                    </strong>
                </p>

                <p>
                    O desvio padrão indica o quanto os valores estão
                    dispersos em relação à média.
                </p>

                <h4>Etapas do cálculo</h4>

                <ol>
                    <li>Calcular a média dos valores.</li>
                    <li>Subtrair a média de cada valor.</li>
                    <li>Elevar cada resultado ao quadrado.</li>
                    <li>Somar os resultados.</li>
                    <li>Dividir pela quantidade de valores.</li>
                    <li>Calcular a raiz quadrada.</li>
                </ol>

                <h4>Exemplo</h4>

                <p>Dados: 2, 4, 6, 8</p>

                <p>Média = 5</p>
                <p>Variância = 5</p>
                <p>Desvio padrão = √5 ≈ 2,24</p>

                <p>
                    Essas medidas são utilizadas em análise de dados,
                    pesquisas e inteligência de negócios.
                </p>

            </div>

        </div>
    `;
}

// ==========================================
// INTERPRETAR ENTRADA NUMÉRICA
// ==========================================

function interpretarNumerosEstatisticos(entrada) {

    const partes = entrada.split(",");

    if (partes.length === 0) {
        return null;
    }

    const valores = partes.map(valor => {

        const texto = valor.trim();

        if (texto === "") {
            return NaN;
        }

        return Number(texto);

    });

    if (
        valores.some(valor => !Number.isFinite(valor))
    ) {
        return null;
    }

    return valores;
}

// ==========================================
// CALCULAR ESTATÍSTICA
// ==========================================

async function calcStats() {

    const input = document.getElementById("nums");

    const resultElement = document.getElementById("statResult");

    const statusElement = document.getElementById("statsStatus");

    if (!input || !resultElement || !statusElement) {
        return;
    }

    const entrada = input.value.trim();

    resultElement.textContent = "";
    statusElement.textContent = "";

    if (!entrada) {

        resultElement.textContent =
            "Digite os números para calcular.";

        return;
    }

    const arr = interpretarNumerosEstatisticos(entrada);

    if (!arr) {

        resultElement.textContent =
            "Digite apenas números válidos separados por vírgula. Exemplo: 2, 4, 6, 8.5.";

        return;
    }

    // ======================================
    // SOMA
    // ======================================

    const soma = arr.reduce(
        (total, valor) => total + valor,
        0
    );

    if (!Number.isFinite(soma)) {

        resultElement.textContent =
            "Os valores informados são muito elevados.";

        return;
    }

    // ======================================
    // MÉDIA
    // ======================================

    const media = soma / arr.length;

    // ======================================
    // VARIÂNCIA POPULACIONAL
    // ======================================

    const variancia = arr.reduce(
        (total, valor) => {

            return total + Math.pow(valor - media, 2);

        },
        0
    ) / arr.length;

    // ======================================
    // DESVIO PADRÃO POPULACIONAL
    // ======================================

    const desvio = Math.sqrt(variancia);

    if (
        !Number.isFinite(media) ||
        !Number.isFinite(variancia) ||
        !Number.isFinite(desvio)
    ) {

        resultElement.textContent =
            "Não foi possível calcular. Verifique os valores informados.";

        return;
    }

    // ======================================
    // EXIBIR RESULTADO
    // ======================================

    resultElement.innerHTML = `

        <div class="history-item">

            <h3>Resultado da Análise</h3>

            <p>
                <strong>Quantidade:</strong>
                ${arr.length}
            </p>

            <p>
                <strong>Soma:</strong>
                ${formatarNumeroStats(soma)}
            </p>

            <p>
                <strong>Média:</strong>
                ${formatarNumeroStats(media)}
            </p>

            <p>
                <strong>Variância:</strong>
                ${formatarNumeroStats(variancia)}
            </p>

            <p>
                <strong>Desvio padrão:</strong>
                ${formatarNumeroStats(desvio)}
            </p>

        </div>

    `;

    // ======================================
    // SALVAR NO SUPABASE
    // ======================================

    await salvarEstatistica(
        entrada,
        arr.length,
        media,
        variancia,
        desvio
    );

}

// ==========================================
// FORMATAR NÚMEROS
// ==========================================

function formatarNumeroStats(valor) {

    return Number(valor).toLocaleString("pt-BR", {

        minimumFractionDigits: 2,

        maximumFractionDigits: 6

    });

}

// ==========================================
// SALVAR NO SUPABASE
// ==========================================

async function salvarEstatistica(
    entrada,
    quantidade,
    media,
    variancia,
    desvio
) {

    const statusElement =
        document.getElementById("statsStatus");

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

        const expressao =
            `Dados: ${entrada} | ` +
            `Quantidade: ${quantidade} | ` +
            `Média: ${media.toFixed(6)} | ` +
            `Variância: ${variancia.toFixed(6)} | ` +
            `Desvio padrão: ${desvio.toFixed(6)}`;

        const { error } = await supabaseClient
            .from("calculos")
            .insert({

                tipo: "estatistica",

                expressao: expressao,

                valor_inicial: quantidade,

                taxa: variancia,

                resultado: media,

                resultado_texto: desvio.toFixed(6)

            });

        if (error) throw error;

        if (statusElement) {

            statusElement.textContent =
                "Análise estatística salva no histórico!";

        }

        await carregarHistoricoEstatistico();

    } catch (erro) {

        console.error(
            "Erro ao salvar estatística:",
            erro
        );

        if (statusElement) {

            statusElement.textContent =
                "Cálculo realizado, mas não foi possível salvar no banco.";

        }

    }

}

// ==========================================
// CARREGAR HISTÓRICO
// ==========================================

async function carregarHistoricoEstatistico() {

    const historyElement =
        document.getElementById("statsHistory");

    if (!historyElement) return;

    try {

        if (
            typeof supabaseClient === "undefined" ||
            !supabaseClient
        ) {

            throw new Error("Supabase indisponível.");

        }

        const { data: sessionData, error: sessionError } =
            await supabaseClient.auth.getSession();

        if (sessionError) throw sessionError;

        if (!sessionData.session) {

            window.location.href = "login.html";

            return;
        }

        const { data, error } = await supabaseClient
            .from("calculos")
            .select(
                "expressao, valor_inicial, taxa, resultado, resultado_texto, created_at"
            )
            .eq("tipo", "estatistica")
            .order("created_at", {
                ascending: false
            })
            .limit(5);

        if (error) throw error;

        if (!data || data.length === 0) {

            historyElement.textContent =
                "Nenhuma análise realizada ainda.";

            return;
        }

        historyElement.innerHTML = data.map(item => `

            <div class="history-item">

                <p>
                    <strong>
                        ${escaparHTMLStats(item.expressao)}
                    </strong>
                </p>

                <small>
                    ${formatarDataStats(item.created_at)}
                </small>

            </div>

        `).join("");

    } catch (erro) {

        console.error(
            "Erro ao carregar histórico:",
            erro
        );

        historyElement.textContent =
            "Não foi possível carregar o histórico.";

    }

}

// ==========================================
// PROTEÇÃO DE TEXTO HTML
// ==========================================

function escaparHTMLStats(texto) {

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

// ==========================================
// FORMATAR DATA
// ==========================================

function formatarDataStats(data) {

    if (!data) return "";

    const dataFormatada = new Date(data);

    if (Number.isNaN(dataFormatada.getTime())) {
        return "";
    }

    return dataFormatada.toLocaleString("pt-BR");

}
