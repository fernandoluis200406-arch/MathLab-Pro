
"use strict";

// ==========================================
// MATHLAB PRO - DASHBOARD
// INTEGRADO AO SUPABASE
// ==========================================

let dashboardChartInstance = null;


// ==========================================
// INTERFACE DO DASHBOARD
// ==========================================

function dashboardHTML() {

    return `
        <style>

            /* INDICADORES */

            .dashboard-cards {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 20px;
                margin-bottom: 20px;
            }

            .dashboard-stat-card {
                background: #202D40;
                border-radius: 14px;
                padding: 24px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                min-width: 0;
            }

            .dashboard-stat-title {
                color: #B8C7DC;
                font-size: 15px;
                font-weight: 500;
            }

            .dashboard-stat-value {
                color: #FFFFFF;
                font-size: 30px;
                font-weight: 700;
            }

            .dashboard-stat-description {
                color: #91A4BD;
                font-size: 12px;
            }


            /* HISTÓRICO */

            .dashboard-history-list {
                display: flex;
                flex-direction: column;
                gap: 14px;
                margin-top: 20px;
            }

            .dashboard-history-item {
                background: #172338;
                border: 1px solid #30415A;
                border-left: 4px solid #3B82F6;
                border-radius: 10px;
                padding: 18px;
                transition: transform 0.2s, border-color 0.2s;
            }

            .dashboard-history-item:hover {
                transform: translateY(-2px);
                border-color: #4B91F5;
            }

            .dashboard-history-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 12px;
            }

            .dashboard-history-type {
                color: #93C5FD;
                font-size: 14px;
                font-weight: 700;
            }

            .dashboard-history-expression {
                color: #D1DCEC;
                font-size: 14px;
                line-height: 1.6;
                overflow-wrap: anywhere;
                margin-bottom: 12px;
            }

            .dashboard-history-result {
                background: #24364F;
                border-radius: 7px;
                padding: 10px 12px;
                color: #FFFFFF;
                font-size: 14px;
                overflow-wrap: anywhere;
            }

            .dashboard-history-result strong {
                color: #60A5FA;
            }

            .dashboard-history-date {
                display: block;
                margin-top: 12px;
                color: #91A4BD;
                font-size: 12px;
            }

            .dashboard-empty {
                color: #AABBD0;
                padding: 15px 0;
            }

            @media (max-width: 640px) {

                .dashboard-cards {
                    grid-template-columns: 1fr;
                }

                .dashboard-stat-card {
                    padding: 20px;
                }

                .dashboard-stat-value {
                    font-size: 26px;
                }

            }

        </style>


        <!-- CABEÇALHO -->

        <div class="card">

            <h2>Dashboard</h2>

            <p>
                Visão geral da utilização do MathLab Pro.
            </p>

        </div>


        <!-- INDICADORES -->

        <div class="dashboard-cards">

            <div class="dashboard-stat-card">

                <span class="dashboard-stat-title">
                    Total de Cálculos
                </span>

                <strong
                    id="totalCalc"
                    class="dashboard-stat-value"
                >
                    Carregando...
                </strong>

                <span class="dashboard-stat-description">
                    Registros realizados no sistema
                </span>

            </div>


            <div class="dashboard-stat-card">

                <span class="dashboard-stat-title">
                    Memória Atual
                </span>

                <strong
                    id="memoryValueCard"
                    class="dashboard-stat-value"
                >
                    0
                </strong>

                <span class="dashboard-stat-description">
                    Valor armazenado na calculadora
                </span>

            </div>

        </div>


        <!-- GRÁFICO -->

        <div class="card">

            <h3>Uso do Sistema</h3>

            <p>
                Quantidade de cálculos realizados por mês.
            </p>

            <div style="position: relative; height: 320px;">

                <canvas id="dashboardChart"></canvas>

            </div>

        </div>


        <!-- HISTÓRICO -->

        <div class="card">

            <h3>Últimos cálculos</h3>

            <p>
                Seus cinco registros mais recentes.
            </p>

            <div
                id="dashboardHistory"
                class="dashboard-history-list"
            >
                <p class="dashboard-empty">
                    Carregando histórico...
                </p>
            </div>

        </div>
    `;
}


// ==========================================
// CARREGAR DASHBOARD
// ==========================================

async function loadDashboard() {

    const content =
        document.getElementById("content");

    if (!content) {

        console.error(
            "Elemento content não encontrado."
        );

        return;
    }

    content.innerHTML = dashboardHTML();

    atualizarMemoriaDashboard();

    await carregarDadosDashboard();

}


// ==========================================
// ATUALIZAR MEMÓRIA
// ==========================================

function atualizarMemoriaDashboard() {

    const memoryElement =
        document.getElementById("memoryValueCard");

    if (!memoryElement) return;

    const memoria =
        typeof memoryValue !== "undefined"
            ? memoryValue
            : 0;

    memoryElement.textContent =
        Number(memoria).toLocaleString("pt-BR");

}


// ==========================================
// INTERPRETAR DATA DO SUPABASE
// ==========================================

function interpretarDataDashboard(data) {

    if (!data) return null;

    let valor = String(data).trim();

    // Converte o formato do PostgreSQL para ISO.
    valor = valor.replace(" ", "T");

    // Se não houver informação de fuso,
    // considera que o horário armazenado está em UTC.
    const possuiFuso =
        /(?:Z|[+-]\d{2}:?\d{2})$/i.test(valor);

    if (!possuiFuso) {
        valor += "Z";
    }

    const dataInterpretada = new Date(valor);

    if (Number.isNaN(dataInterpretada.getTime())) {
        return null;
    }

    return dataInterpretada;

}


// ==========================================
// BUSCAR DADOS DO SUPABASE
// ==========================================

async function carregarDadosDashboard() {

    try {

        if (
            typeof supabaseClient === "undefined" ||
            !supabaseClient
        ) {

            throw new Error(
                "Conexão com Supabase não encontrada."
            );

        }

        const {
            data: sessionData,
            error: sessionError
        } = await supabaseClient.auth.getSession();

        if (sessionError) throw sessionError;

        if (!sessionData.session) {

            window.location.href = "login.html";

            return;
        }


        // ==================================
        // TOTAL DE CÁLCULOS
        // ==================================

        const {
            count,
            error: countError
        } = await supabaseClient
            .from("calculos")
            .select("id", {
                count: "exact",
                head: true
            });

        if (countError) throw countError;

        const totalElement =
            document.getElementById("totalCalc");

        if (totalElement) {

            totalElement.textContent =
                (count ?? 0).toLocaleString("pt-BR");

        }


        // ==================================
        // CÁLCULOS DO ANO ATUAL
        // ==================================

        const anoAtual = new Date().getFullYear();

        const inicioAno =
            `${anoAtual}-01-01T00:00:00`;

        const inicioProximoAno =
            `${anoAtual + 1}-01-01T00:00:00`;

        const {
            data,
            error
        } = await supabaseClient
            .from("calculos")
            .select("created_at, tipo, expressao, resultado")
            .gte("created_at", inicioAno)
            .lt("created_at", inicioProximoAno)
            .order("created_at", {
                ascending: false
            });

        if (error) throw error;


        // ==================================
        // ORGANIZAR QUANTIDADE POR MÊS
        // ==================================

        const meses = [
            "Jan", "Fev", "Mar", "Abr",
            "Mai", "Jun", "Jul", "Ago",
            "Set", "Out", "Nov", "Dez"
        ];

        const quantidadePorMes =
            Array(12).fill(0);

        (data || []).forEach(item => {

            const dataCalculo =
                interpretarDataDashboard(item.created_at);

            if (!dataCalculo) return;

            const mes = dataCalculo.getMonth();

            quantidadePorMes[mes]++;

        });

        criarGraficoDashboard(
            meses,
            quantidadePorMes
        );


        // ==================================
        // ÚLTIMOS CÁLCULOS
        // ==================================

        await carregarUltimosCalculos();

    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

        const totalElement =
            document.getElementById("totalCalc");

        if (totalElement) {
            totalElement.textContent = "Erro";
        }

        const historyElement =
            document.getElementById("dashboardHistory");

        if (historyElement) {

            historyElement.innerHTML = `
                <p class="dashboard-empty">
                    Não foi possível carregar os dados.
                </p>
            `;

        }

    }

}


// ==========================================
// CRIAR GRÁFICO
// ==========================================

function criarGraficoDashboard(meses, valores) {

    const canvas =
        document.getElementById("dashboardChart");

    if (!canvas) return;

    if (typeof Chart === "undefined") {

        console.error(
            "Chart.js não foi carregado."
        );

        return;
    }

    if (dashboardChartInstance) {

        dashboardChartInstance.destroy();

        dashboardChartInstance = null;

    }

    dashboardChartInstance = new Chart(canvas, {

        type: "bar",

        data: {

            labels: meses,

            datasets: [{

                label: "Cálculos realizados",

                data: valores,

                backgroundColor: "rgba(59, 130, 246, 0.55)",

                borderColor: "#3B82F6",

                borderWidth: 1,

                borderRadius: 6

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            animation: {
                duration: 1000
            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {
                        precision: 0,
                        color: "#91A4BD"
                    },

                    grid: {
                        color: "rgba(145, 164, 189, 0.12)"
                    },

                    title: {

                        display: true,

                        text: "Quantidade de cálculos",

                        color: "#AABBD0"

                    }

                },

                x: {

                    ticks: {
                        color: "#91A4BD"
                    },

                    grid: {
                        color: "rgba(145, 164, 189, 0.08)"
                    },

                    title: {

                        display: true,

                        text: "Meses",

                        color: "#AABBD0"

                    }

                }

            },

            plugins: {

                legend: {

                    display: true,

                    labels: {
                        color: "#AABBD0"
                    }

                }

            }

        }

    });

}


// ==========================================
// IDENTIFICAR TIPO DE CÁLCULO
// ==========================================

function nomeTipoCalculoDashboard(tipo) {

    const tipos = {

        calculadora_cientifica:
            "Calculadora Científica",

        conversor_comprimento:
            "Conversor de Comprimento",

        conversor_bases:
            "Conversor de Bases",

        juros_compostos:
            "Juros Compostos",

        estatistica:
            "Estatística",

        grafico:
            "Gráficos",

        grafico_funcao:
            "Gráficos"

    };

    return tipos[tipo] || tipo || "Cálculo";

}


// ==========================================
// ÚLTIMOS CÁLCULOS
// ==========================================

async function carregarUltimosCalculos() {

    const elemento =
        document.getElementById("dashboardHistory");

    if (!elemento) return;

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("calculos")
            .select(
                "tipo, expressao, resultado, resultado_texto, created_at"
            )
            .order("created_at", {
                ascending: false
            })
            .limit(5);

        if (error) throw error;

        if (!data || data.length === 0) {

            elemento.innerHTML = `
                <p class="dashboard-empty">
                    Nenhum cálculo registrado ainda.
                </p>
            `;

            return;
        }

        elemento.innerHTML = `
            <div class="dashboard-history-list">

                ${data.map(item => {

                    const resultado =
                        item.resultado_texto ??
                        item.resultado ??
                        "Registrado";

                    const tipo =
                        escaparHTMLDashboard(
                            nomeTipoCalculoDashboard(item.tipo)
                        );

                    const expressao =
                        escaparHTMLDashboard(
                            item.expressao || "Sem expressão"
                        );

                    const resultadoSeguro =
                        escaparHTMLDashboard(resultado);

                    const dataFormatada =
                        formatarDataDashboard(item.created_at);

                    return `

                        <div class="dashboard-history-item">

                            <div class="dashboard-history-header">

                                <span class="dashboard-history-type">
                                    ${tipo}
                                </span>

                            </div>

                            <div class="dashboard-history-expression">
                                ${expressao}
                            </div>

                            <div class="dashboard-history-result">
                                <strong>Resultado:</strong>
                                ${resultadoSeguro}
                            </div>

                            <small class="dashboard-history-date">
                                ${dataFormatada}
                            </small>

                        </div>

                    `;

                }).join("")}

            </div>
        `;

    } catch (erro) {

        console.error(
            "Erro ao carregar últimos cálculos:",
            erro
        );

        elemento.innerHTML = `
            <p class="dashboard-empty">
                Não foi possível carregar os últimos cálculos.
            </p>
        `;

    }

}


// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function escaparHTMLDashboard(texto) {

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
// FORMATAR DATA E HORÁRIO
// ==========================================

function formatarDataDashboard(data) {

    const dataFormatada =
        interpretarDataDashboard(data);

    if (!dataFormatada) return "";

    return dataFormatada.toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

}
