
"use strict";

// ==========================================
// MATHLAB PRO - JUROS COMPOSTOS
// INTEGRADO AO SUPABASE
// ==========================================

// ==========================================
// INTERFACE
// ==========================================

function financeHTML() {

    return `
        <div class="card">

            <h2>Juros Compostos</h2>

            <input
                id="capital"
                type="number"
                min="0"
                step="0.01"
                placeholder="Capital Inicial"
            >

            <input
                id="taxa"
                type="number"
                min="0"
                step="0.01"
                placeholder="Taxa % ao mês"
            >

            <input
                id="tempo"
                type="number"
                min="1"
                step="1"
                placeholder="Meses"
            >

            <input
                id="aporte"
                type="number"
                min="0"
                step="0.01"
                placeholder="Aporte Mensal"
            >

            <button
                class="action"
                onclick="calcularJuros()"
            >
                Calcular
            </button>

            <div id="finResult"></div>

            <p id="financeStatus"></p>

            <div class="explicacao">

                <h3>Como funcionam os Juros Compostos?</h3>

                <p>
                    Juros compostos são aqueles em que os juros são calculados
                    sobre o valor inicial e também sobre os juros acumulados
                    ao longo do tempo. Isso é conhecido como
                    <strong>juros sobre juros</strong>.
                </p>

                <h4>Fórmula básica:</h4>

                <p>
                    <strong>M = C × (1 + i)<sup>t</sup></strong>
                </p>

                <p>Onde:</p>

                <ul>
                    <li><strong>M:</strong> Montante final</li>
                    <li><strong>C:</strong> Capital inicial</li>
                    <li><strong>i:</strong> Taxa de juros em decimal</li>
                    <li><strong>t:</strong> Tempo em meses</li>
                </ul>

                <h4>Com aporte mensal:</h4>

                <p>
                    Quando existe um valor sendo adicionado todos os meses,
                    o cálculo é feito de forma acumulativa:
                </p>

                <p>
                    <strong>
                        Montante = (Montante atual + Aporte) × (1 + i)
                    </strong>
                </p>

                <h4>Exemplo:</h4>

                <p>
                    Capital inicial: R$ 1.000,00<br>
                    Taxa: 1% ao mês<br>
                    Tempo: 3 meses<br>
                    Aporte: R$ 100,00
                </p>

                <p>
                    Mês 1: (1000 + 100) × 1,01 = 1111<br>
                    Mês 2: (1111 + 100) × 1,01 = 1223,11<br>
                    Mês 3: (1223,11 + 100) × 1,01 ≈ 1336,34
                </p>

                <p>
                    <strong>Montante final ≈ R$ 1.336,34</strong>
                </p>

                <h4>Juros simples x juros compostos</h4>

                <p>
                    Nos juros simples, os juros são calculados apenas sobre
                    o valor inicial. Nos juros compostos, são calculados
                    sobre o valor inicial e também sobre os juros acumulados.
                </p>

                <p>
                    Esse tipo de cálculo é muito utilizado em investimentos,
                    financiamentos e aplicações financeiras.
                </p>

            </div>

        </div>

        <div class="card">

            <h3>Histórico de simulações</h3>

            <div id="financeHistory">
                Carregando histórico...
            </div>

        </div>
    `;
}

// ==========================================
// FORMATAR MOEDA
// ==========================================

function formatarMoedaFinanceira(valor) {

    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return "R$ 0,00";
    }

    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}

// ==========================================
// CALCULAR JUROS COMPOSTOS
// ==========================================

async function calcularJuros() {

    const capitalInput = document.getElementById("capital");
    const taxaInput = document.getElementById("taxa");
    const tempoInput = document.getElementById("tempo");
    const aporteInput = document.getElementById("aporte");

    const resultadoElement = document.getElementById("finResult");
    const statusElement = document.getElementById("financeStatus");

    if (
        !capitalInput ||
        !taxaInput ||
        !tempoInput ||
        !aporteInput ||
        !resultadoElement ||
        !statusElement
    ) {
        return;
    }

    const capital = Number(capitalInput.value);
    const taxa = Number(taxaInput.value);
    const tempo = Number(tempoInput.value);

    const aporte = aporteInput.value.trim() === ""
        ? 0
        : Number(aporteInput.value);

    resultadoElement.textContent = "";
    statusElement.textContent = "";

    // ======================================
    // VALIDAÇÃO DOS CAMPOS
    // ======================================

    if (
        capitalInput.value.trim() === "" ||
        taxaInput.value.trim() === "" ||
        tempoInput.value.trim() === ""
    ) {

        resultadoElement.textContent =
            "Preencha o capital, a taxa e o tempo.";

        return;
    }

    if (
        !Number.isFinite(capital) ||
        !Number.isFinite(taxa) ||
        !Number.isFinite(tempo) ||
        !Number.isFinite(aporte) ||
        capital < 0 ||
        taxa < 0 ||
        tempo <= 0 ||
        !Number.isInteger(tempo) ||
        aporte < 0
    ) {

        resultadoElement.textContent =
            "Informe valores válidos. O tempo deve ser um número inteiro positivo.";

        return;
    }

    // ======================================
    // CÁLCULO
    // ======================================

    const taxaDecimal = taxa / 100;

    let montante = capital;

    for (let mes = 1; mes <= tempo; mes++) {

        montante = (montante + aporte) * (1 + taxaDecimal);

        if (!Number.isFinite(montante)) {

            resultadoElement.textContent =
                "Resultado muito elevado. Reduza os valores da simulação.";

            return;
        }

    }

    // Arredondar somente o resultado final
    montante = Number(montante.toFixed(2));

    const totalInvestido =
        Number((capital + aporte * tempo).toFixed(2));

    const jurosAcumulados =
        Number((montante - totalInvestido).toFixed(2));

    // ======================================
    // EXIBIR RESULTADO
    // ======================================

    resultadoElement.innerHTML = `

        <div class="history-item">

            <h3>Resultado da Simulação</h3>

            <p>
                <strong>Montante final:</strong>
            </p>

            <h2>
                ${formatarMoedaFinanceira(montante)}
            </h2>

            <p>
                <strong>Total investido:</strong>
                ${formatarMoedaFinanceira(totalInvestido)}
            </p>

            <p>
                <strong>Juros acumulados:</strong>
                ${formatarMoedaFinanceira(jurosAcumulados)}
            </p>

            <p>
                <strong>Período:</strong>
                ${tempo} meses
            </p>

        </div>

    `;

    statusElement.textContent = "Salvando simulação...";

    // ======================================
    // SALVAR NO SUPABASE
    // ======================================

    await salvarSimulacaoJuros(
        capital,
        taxa,
        tempo,
        aporte,
        montante
    );

}

// ==========================================
// SALVAR SIMULAÇÃO NO SUPABASE
// ==========================================

async function salvarSimulacaoJuros(
    capital,
    taxa,
    tempo,
    aporte,
    montante
) {

    const statusElement =
        document.getElementById("financeStatus");

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
            `Capital: ${capital} | ` +
            `Taxa: ${taxa}% | ` +
            `Tempo: ${tempo} meses | ` +
            `Aporte: ${aporte}`;

        const { error } = await supabaseClient
            .from("calculos")
            .insert({

                tipo: "juros_compostos",

                expressao: expressao,

                valor_inicial: capital,

                taxa: taxa,

                periodo: tempo,

                aporte_mensal: aporte,

                resultado: montante

            });

        if (error) throw error;

        if (statusElement) {

            statusElement.textContent =
                "Simulação salva no histórico!";

        }

        await carregarHistoricoFinanceiro();

    } catch (erro) {

        console.error(
            "Erro ao salvar simulação:",
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

async function carregarHistoricoFinanceiro() {

    const historyElement =
        document.getElementById("financeHistory");

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
                "valor_inicial, taxa, periodo, aporte_mensal, resultado, created_at"
            )
            .eq("tipo", "juros_compostos")
            .order("created_at", {
                ascending: false
            })
            .limit(5);

        if (error) throw error;

        if (!data || data.length === 0) {

            historyElement.textContent =
                "Nenhuma simulação realizada ainda.";

            return;
        }

        historyElement.innerHTML = data.map(item => `

            <div class="history-item">

                <p>
                    <strong>Montante:</strong>
                    ${formatarMoedaFinanceira(item.resultado)}
                </p>

                <p>
                    Capital:
                    ${formatarMoedaFinanceira(item.valor_inicial)}
                </p>

                <p>
                    Taxa:
                    ${escaparHTMLFinanceiro(item.taxa)}% ao mês |
                    Período:
                    ${escaparHTMLFinanceiro(item.periodo)} meses
                </p>

                <p>
                    Aporte mensal:
                    ${formatarMoedaFinanceira(item.aporte_mensal ?? 0)}
                </p>

                <small>
                    ${formatarDataFinanceira(item.created_at)}
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

function escaparHTMLFinanceiro(texto) {

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

function formatarDataFinanceira(data) {

    if (!data) return "";

    const dataFormatada = new Date(data);

    if (Number.isNaN(dataFormatada.getTime())) {
        return "";
    }

    return dataFormatada.toLocaleString("pt-BR");

}
