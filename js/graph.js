
"use strict";

// =====================================================
// MATHLAB PRO - GRÁFICO DE FUNÇÃO
// COM SUPORTE A DEG / RAD E SUPABASE
// =====================================================

let chartInstance = null;

// RAD é o modo padrão
let graphAngleMode = "RAD";

// =====================================================
// INTERFACE DO MÓDULO
// =====================================================

function graphHTML() {
    return `
        <div class="card graph-module">

            <div class="module-header">
                <div>
                    <span class="module-icon">📈</span>
                    <h2>Gráfico de Função</h2>
                    <p class="module-subtitle">
                        Digite uma função matemática e visualize seu comportamento.
                    </p>
                </div>
            </div>

            <!-- CAMPO DA FUNÇÃO -->

            <div class="graph-input-area">

                <label for="func">
                    Função matemática
                </label>

                <input
                    type="text"
                    id="func"
                    placeholder="Ex: x² + 2x - 3"
                    autocomplete="off"
                >

                <small>
                    Exemplos:
                    <strong>x²</strong>,
                    <strong>x^2</strong>,
                    <strong>2x + 5</strong>,
                    <strong>sen(x)</strong> ou
                    <strong>√x</strong>.
                </small>

            </div>

            <!-- SUGESTÕES -->

            <div class="suggestions-area">

                <span class="suggestions-title">
                    Sugestões rápidas:
                </span>

                <div class="suggestions">

                    <button onclick="setFunction('x')">x</button>
                    <button onclick="setFunction('x²')">x²</button>
                    <button onclick="setFunction('x³')">x³</button>
                    <button onclick="setFunction('2x + 1')">2x + 1</button>
                    <button onclick="setFunction('sen(x)')">sen(x)</button>
                    <button onclick="setFunction('cos(x)')">cos(x)</button>
                    <button onclick="setFunction('tan(x)')">tan(x)</button>
                    <button onclick="setFunction('√x')">√x</button>
                    <button onclick="setFunction('log(x)')">log(x)</button>

                </div>

            </div>

            <!-- MODO ANGULAR -->

            <div class="graph-angle-area">

                <span>
                    Unidade angular:
                </span>

                <button
                    type="button"
                    id="graphAngleModeButton"
                    class="secondary-action"
                    onclick="toggleGraphAngleMode()"
                >
                    RAD
                </button>

                <small id="graphAngleDescription">
                    Ângulos em radianos
                </small>

            </div>

            <!-- CONTROLES -->

            <div class="graph-actions">

                <button
                    class="action"
                    onclick="plotGraph()"
                >
                    📊 Plotar gráfico
                </button>

                <button
                    class="secondary-action"
                    onclick="resetGraphZoom()"
                >
                    🔄 Redefinir zoom
                </button>

            </div>

            <!-- MENSAGEM -->

            <div
                id="graphMessage"
                class="graph-message"
            ></div>

            <!-- GRÁFICO -->

            <div class="graph-container">
                <canvas id="myChart"></canvas>
            </div>

            <!-- HISTÓRICO -->

            <div class="card">
                <h3>Histórico de gráficos</h3>

                <div id="graphHistory">
                    Carregando histórico...
                </div>
            </div>

            <!-- EXPLICAÇÃO -->

            <div class="explicacao">

                <h3>📘 Como funciona o gráfico de função?</h3>

                <p>
                    O módulo permite representar visualmente uma função
                    matemática em um plano cartesiano. A função determina
                    o valor de <strong>y</strong> para cada valor de
                    <strong>x</strong>.
                </p>

                <h4>📐 Forma geral</h4>

                <p>Uma função pode ser representada por:</p>

                <p class="formula">y = f(x)</p>

                <p>
                    O sistema escolhe diversos valores para
                    <strong>x</strong>, calcula o valor correspondente
                    de <strong>y</strong> e posiciona esses pontos no gráfico.
                </p>

                <h4>📊 Exemplos</h4>

                <ul>
                    <li><strong>x</strong> → gera uma reta diagonal.</li>
                    <li><strong>x²</strong> → gera uma parábola.</li>
                    <li><strong>x³</strong> → gera uma curva cúbica.</li>
                    <li><strong>2x + 1</strong> → gera uma reta.</li>
                    <li><strong>x² + 2x - 3</strong> → gera uma parábola deslocada.</li>
                    <li><strong>1/x</strong> → gera uma hipérbole.</li>
                    <li><strong>x^4 - x^2</strong> → gera uma curva de 4º grau.</li>
                    <li><strong>sen(x)</strong> → gera uma onda senoidal.</li>
                    <li><strong>cos(x)</strong> → gera uma onda cossenoidal.</li>
                    <li><strong>tan(x)</strong> → gera uma curva com assíntotas verticais.</li>
                    <li><strong>√x</strong> → gera uma curva de raiz quadrada.</li>
                    <li><strong>16</strong> → gera uma reta horizontal.</li>
                </ul>

                <h4>📏 DEG e RAD</h4>

                <p>
                    O modo DEG utiliza graus para medir ângulos.
                    O modo RAD utiliza radianos.
                </p>

                <ul>
                    <li><strong>DEG:</strong> uma volta completa corresponde a 360°.</li>
                    <li><strong>RAD:</strong> uma volta completa corresponde a 2π radianos.</li>
                    <li><strong>90°</strong> corresponde a <strong>π/2 radianos</strong>.</li>
                    <li><strong>180°</strong> corresponde a <strong>π radianos</strong>.</li>
                </ul>

                <p>
                    A alternância DEG/RAD afeta as funções trigonométricas
                    seno, cosseno e tangente.
                </p>

                <h4>⌨️ Como escrever as funções?</h4>

                <ul>
                    <li><strong>x²</strong> ou <strong>x^2</strong> representam x ao quadrado.</li>
                    <li><strong>2x</strong> representa 2 × x.</li>
                    <li><strong>3x + 5</strong> representa 3 × x + 5.</li>
                    <li><strong>sen(x)</strong> representa o seno de x.</li>
                    <li><strong>√x</strong> representa a raiz quadrada de x.</li>
                    <li><strong>π</strong> representa a constante matemática pi.</li>
                </ul>

                <h4>🔍 Interação com o gráfico</h4>

                <ul>
                    <li>Use a roda do mouse para aproximar ou afastar.</li>
                    <li>Clique e arraste o gráfico para movimentar a visualização.</li>
                    <li>Utilize o botão <strong>Redefinir zoom</strong> para voltar à visualização inicial.</li>
                    <li>Alterne entre DEG e RAD para mudar a unidade angular.</li>
                </ul>

                <h4>⚠️ Observação</h4>

                <p>
                    Algumas funções possuem restrições matemáticas.
                    Por exemplo, a raiz quadrada de um número negativo
                    não possui resultado real e o logaritmo de zero
                    não é definido.
                </p>

            </div>

        </div>
    `;
}

// =====================================================
// SUGESTÕES DE FUNÇÕES
// =====================================================

function setFunction(value) {
    const input = document.getElementById("func");

    if (!input) return;

    input.value = value;
    input.focus();
}

// =====================================================
// ALTERNAR DEG / RAD
// =====================================================

function toggleGraphAngleMode() {

    graphAngleMode =
        graphAngleMode === "RAD" ? "DEG" : "RAD";

    atualizarInterfaceAngular();

    const input = document.getElementById("func");

    // Recalcula o gráfico sem salvar outra entrada no histórico
    if (input && input.value.trim() !== "") {
        plotGraph(false);
    }
}

// =====================================================
// ATUALIZAR BOTÃO E DESCRIÇÃO DO MODO ANGULAR
// =====================================================

function atualizarInterfaceAngular() {

    const button = document.getElementById(
        "graphAngleModeButton"
    );

    const description = document.getElementById(
        "graphAngleDescription"
    );

    if (button) {
        button.textContent = graphAngleMode;
    }

    if (description) {
        description.textContent =
            graphAngleMode === "DEG"
                ? "Ângulos em graus"
                : "Ângulos em radianos";
    }
}

// =====================================================
// NORMALIZAÇÃO DA EXPRESSÃO
// =====================================================

function normalizeFunction(expression) {

    let f = expression.trim();

    // Símbolos matemáticos
    f = f
        .replace(/²/g, "^2")
        .replace(/³/g, "^3")
        .replace(/π/g, "pi")
        .replace(/√\s*([a-zA-Z0-9.]+)/g, "sqrt($1)");

    // Funções em português
    f = f.replace(/\bsen\b/gi, "sin");
    f = f.replace(/\bcos\b/gi, "cos");
    f = f.replace(/\btan\b/gi, "tan");

    // Espaços
    f = f.replace(/\s+/g, " ");

    return f;
}

// =====================================================
// FUNÇÕES TRIGONOMÉTRICAS
// =====================================================

function criarEscopoTrigonometrico(x) {

    function converterAngulo(valor) {

        if (graphAngleMode === "DEG") {
            return valor * Math.PI / 180;
        }

        return valor;
    }

    return {
        x: x,

        sin: function(valor) {
            return Math.sin(converterAngulo(valor));
        },

        cos: function(valor) {
            return Math.cos(converterAngulo(valor));
        },

        tan: function(valor) {
            return Math.tan(converterAngulo(valor));
        }
    };
}

// =====================================================
// MOSTRAR MENSAGEM
// =====================================================

function showGraphMessage(message, type = "info") {

    const element = document.getElementById("graphMessage");

    if (!element) return;

    element.innerHTML = message;
    element.className = "graph-message " + type;
}

// =====================================================
// PLOTAR GRÁFICO
// =====================================================

async function plotGraph(salvarNoHistorico = true) {

    const input = document.getElementById("func");

    if (!input) return;

    const expressaoOriginal = input.value.trim();

    if (expressaoOriginal === "") {

        showGraphMessage(
            "⚠️ Digite uma função ou expressão matemática para gerar o gráfico.",
            "warning"
        );

        input.focus();
        return;
    }

    if (typeof math === "undefined") {

        showGraphMessage(
            "❌ A biblioteca matemática não foi carregada.",
            "error"
        );

        return;
    }

    if (typeof Chart === "undefined") {

        showGraphMessage(
            "❌ A biblioteca Chart.js não foi carregada.",
            "error"
        );

        return;
    }

    const expression = normalizeFunction(expressaoOriginal);

    const points = [];

    try {

        // Gera pontos de -10 até 10
        // Intervalo de 0.05

        for (let x = -10; x <= 10; x += 0.05) {

            let y;

            try {

                const scope = criarEscopoTrigonometrico(x);

                y = math.evaluate(expression, scope);

            } catch (error) {

                // Ignora pontos fora do domínio da função
                continue;
            }

            // Mantém apenas resultados numéricos reais e finitos
            if (
                typeof y === "number" &&
                Number.isFinite(y) &&
                Math.abs(y) <= 1000000
            ) {

                points.push({
                    x: Number(x.toFixed(4)),
                    y: y
                });

            }

        }

        if (points.length === 0) {

            showGraphMessage(
                "❌ Não foi possível interpretar essa expressão. Tente algo como <strong>x² + 2x</strong>, <strong>sen(x)</strong> ou <strong>√x</strong>.",
                "error"
            );

            return;
        }

        // Destrói o gráfico anterior
        if (chartInstance) {

            chartInstance.destroy();
            chartInstance = null;

        }

        const canvas = document.getElementById("myChart");

        if (!canvas) return;

        // Cria o gráfico
        chartInstance = new Chart(canvas, {

            type: "line",

            data: {

                datasets: [
                    {
                        label: "f(x) = " + expressaoOriginal,
                        data: points,
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        tension: 0.2,
                        fill: false
                    }
                ]

            },

            options: {

                responsive: true,
                maintainAspectRatio: false,

                interaction: {
                    mode: "nearest",
                    intersect: false
                },

                scales: {

                    x: {

                        type: "linear",
                        position: "center",
                        min: -10,
                        max: 10,

                        title: {
                            display: true,
                            text: "Eixo X"
                        },

                        grid: {
                            display: true,
                            drawOnChartArea: true
                        },

                        ticks: {

                            maxTicksLimit: 11,
                            maxRotation: 0,
                            minRotation: 0,

                            callback: function(value) {
                                return Number(value).toFixed(1);
                            }

                        }

                    },

                    y: {

                        position: "center",

                        title: {
                            display: true,
                            text: "Eixo Y"
                        },

                        grid: {
                            display: true,
                            drawOnChartArea: true
                        },

                        ticks: {

                            maxTicksLimit: 9,

                            callback: function(value) {
                                return Number(value).toFixed(2);
                            }

                        }

                    }

                },

                plugins: {

                    legend: {
                        display: true,
                        position: "top"
                    },

                    zoom: {

                        limits: {

                            x: {
                                min: -100,
                                max: 100
                            },

                            y: {
                                min: -1000,
                                max: 1000
                            }

                        },

                        pan: {
                            enabled: true,
                            mode: "xy"
                        },

                        zoom: {

                            wheel: {
                                enabled: true,
                                speed: 0.08
                            },

                            pinch: {
                                enabled: true
                            },

                            mode: "xy"

                        }

                    }

                }

            }

        });

        showGraphMessage(
            "✓ Gráfico gerado com sucesso. Modo angular: <strong>" +
            graphAngleMode +
            "</strong>.",
            "success"
        );

        // Salva no histórico somente quando solicitado
        if (salvarNoHistorico) {
            await salvarGrafico(expressaoOriginal);
        }

    } catch (error) {

        console.error("Erro ao gerar gráfico:", error);

        showGraphMessage(
            "❌ Não foi possível interpretar essa expressão. Verifique a função digitada.",
            "error"
        );

    }

}

// =====================================================
// REDEFINIR ZOOM
// =====================================================

function resetGraphZoom() {

    if (!chartInstance) {

        showGraphMessage(
            "ℹ️ Primeiro gere um gráfico.",
            "info"
        );

        return;
    }

    if (typeof chartInstance.resetZoom === "function") {

        chartInstance.resetZoom();

    } else {

        showGraphMessage(
            "⚠️ O recurso de zoom não está disponível.",
            "warning"
        );

    }

}

// =====================================================
// SALVAR GRÁFICO NO SUPABASE
// =====================================================

async function salvarGrafico(expressao) {

    try {

        const { data: sessionData, error: sessionError } =
            await supabaseClient.auth.getSession();

        if (sessionError) throw sessionError;

        if (!sessionData.session) {
            throw new Error("Usuário não autenticado.");
        }

        const { error } = await supabaseClient
            .from("calculos")
            .insert({
                tipo: "grafico_funcao",
                expressao: expressao,
                resultado_texto: "Gráfico gerado"
            });

        if (error) throw error;

        await carregarHistoricoGraficos();

        showGraphMessage(
            "✓ Gráfico gerado e salvo no histórico!",
            "success"
        );

    } catch (erro) {

        console.error("Erro ao salvar gráfico:", erro);

        showGraphMessage(
            "Gráfico gerado, mas não foi possível salvar no histórico.",
            "warning"
        );

    }

}

// =====================================================
// CARREGAR HISTÓRICO DE GRÁFICOS
// =====================================================

async function carregarHistoricoGraficos() {

    const elemento = document.getElementById("graphHistory");

    if (!elemento) return;

    try {

        const { data, error } = await supabaseClient
            .from("calculos")
            .select("expressao, created_at")
            .eq("tipo", "grafico_funcao")
            .order("created_at", { ascending: false })
            .limit(5);

        if (error) throw error;

        if (!data || data.length === 0) {

            elemento.textContent =
                "Nenhum gráfico registrado ainda.";

            return;
        }

        elemento.innerHTML = data.map(item => `
            <div class="history-item">

                <p>
                    <strong>
                        f(x) = ${escaparHTMLGrafico(item.expressao)}
                    </strong>
                </p>

                <small>
                    ${new Date(item.created_at).toLocaleString("pt-BR")}
                </small>

            </div>
        `).join("");

    } catch (erro) {

        console.error("Erro ao carregar histórico:", erro);

        elemento.textContent =
            "Não foi possível carregar o histórico.";

    }

}

// =====================================================
// PROTEÇÃO DE TEXTO HTML
// =====================================================

function escaparHTMLGrafico(texto) {

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
