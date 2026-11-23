
"use strict";

// ========================================
// MATHLAB PRO - CALCULADORA CIENTÍFICA
// INTEGRAÇÃO COM SUPABASE
// ========================================

let history = [];
let isDegree = true;
let lastCalculationResult = null;


// ========================================
// INTERFACE DA CALCULADORA
// ========================================

function calculatorHTML() {

    return `
        <div class="card">

            <h2>Calculadora Científica</h2>

            <input
                id="calcDisplay"
                placeholder="Digite ou use os botões"
                autocomplete="off"
            >

            <p>
                Resultado:
                <strong id="calcResult"></strong>
            </p>

            <div class="calc-grid">
                ${createButtons()}
            </div>

            <h3>Histórico</h3>

            <p id="historyStatus"></p>

            <ul id="historyList"></ul>

        </div>

        <div class="explicacao">

            <h3>Calculadora Científica</h3>

            <p>
                Realize operações básicas e cálculos matemáticos avançados.
            </p>

            <h4>Operações Básicas</h4>

            <ul>
                <li>+ Adição</li>
                <li>- Subtração</li>
                <li>* Multiplicação</li>
                <li>/ Divisão</li>
                <li>% Resto da divisão</li>
            </ul>

            <h4>Potência e Raiz</h4>

            <ul>
                <li>x² e xʸ: Potência</li>
                <li>sqrt(x): Raiz quadrada</li>
            </ul>

            <h4>Funções Trigonométricas</h4>

            <ul>
                <li>sen(x): Seno</li>
                <li>cos(x): Cosseno</li>
                <li>tan(x): Tangente</li>
                <li>Alternância entre graus e radianos</li>
            </ul>

            <h4>Outras Funções</h4>

            <ul>
                <li>log(x): Logaritmo na base 10</li>
                <li>ln(x): Logaritmo natural</li>
                <li>π: Número pi</li>
            </ul>

            <h4>Memória</h4>

            <ul>
                <li>M+: Adicionar resultado à memória</li>
                <li>M−: Subtrair resultado da memória</li>
                <li>MR: Recuperar memória</li>
                <li>MC: Limpar memória</li>
            </ul>

            <h4>Como usar</h4>

            <p>
                Digite a expressão, utilize os botões e pressione
                "=" ou Enter para calcular.
            </p>

        </div>
    `;
}


// ========================================
// BOTÕES
// ========================================

function createButtons() {

    const buttons = [
        '1', '2', '3', '+',
        '4', '5', '6', '-',
        '7', '8', '9', '*',
        '.', '0', '=', '/',
        '^', '%', 'π', 'C',
        'sqrt(', 'sen(', 'cos(', 'tan(',
        'log(', 'ln(', '(', ')',
        'M+', 'M-', 'MR', 'MC'
    ];

    return `
        <button
            id="angleModeButton"
            onclick="toggleAngleMode()"
        >
            DEG
        </button>

        ${buttons.map(btn =>
            `<button onclick="press('${btn}')">${btn}</button>`
        ).join('')}
    `;
}


// ========================================
// MODO GRAUS / RADIANOS
// ========================================

function toggleAngleMode() {

    isDegree = !isDegree;

    const button =
        document.getElementById("angleModeButton");

    if (button) {

        button.textContent =
            isDegree ? "DEG" : "RAD";

    }

    const status =
        document.getElementById("historyStatus");

    if (status) {

        status.textContent = isDegree
            ? "Modo graus ativado."
            : "Modo radianos ativado.";

    }
}


// ========================================
// INSERIR VALORES
// ========================================

function press(value) {

    const display =
        document.getElementById("calcDisplay");

    if (!display) return;

    // Limpar visor
    if (value === "C") {

        display.value = "";

        lastCalculationResult = null;

        const resultado =
            document.getElementById("calcResult");

        if (resultado) {
            resultado.textContent = "";
        }

        return;
    }

    // Calcular
    if (value === "=") {

        calculate();

        return;
    }

    // Funções de memória
    if (value === "M+") {

        memoryAdd();

        return;
    }

    if (value === "M-") {

        memorySubtract();

        return;
    }

    if (value === "MR") {

        memoryRecall();

        return;
    }

    if (value === "MC") {

        memoryClear();

        return;
    }

    // Depois de um resultado, começar nova expressão
    // ao inserir um número ou uma função.
    if (lastCalculationResult !== null) {

        const iniciarNovaExpressao =
            /^[0-9.]$/.test(value) ||
            value === "π" ||
            value === "(" ||
            value.endsWith("(");

        if (iniciarNovaExpressao) {

            display.value = "";

        }

        lastCalculationResult = null;

    }

    // Número pi
    if (value === "π") {

        display.value += "pi";

        display.focus();

        return;
    }

    display.value += value;

    display.focus();
}


// ========================================
// PREPARAR EXPRESSÃO PARA MATH.JS
// ========================================

function prepararExpressao(expression) {

    return expression

        .replace(/π/g, "pi")

        .replace(/\bMath\.PI\b/g, "pi")

        .replace(/\bMath\.sqrt\b/g, "sqrt")

        .replace(/\bsen\s*\(/gi, "sin(")

        .replace(/\blog\s*\(/gi, "log10(")

        .replace(/\bln\s*\(/gi, "log(");

}


// ========================================
// FUNÇÕES TRIGONOMÉTRICAS
// ========================================

function criarFuncoesTrigonométricas() {

    return {

        sin: valor => {

            return isDegree
                ? math.sin(math.unit(valor, "deg"))
                : math.sin(valor);

        },

        cos: valor => {

            return isDegree
                ? math.cos(math.unit(valor, "deg"))
                : math.cos(valor);

        },

        tan: valor => {

            return isDegree
                ? math.tan(math.unit(valor, "deg"))
                : math.tan(valor);

        }

    };

}


// ========================================
// CALCULAR
// ========================================

async function calculate() {

    const display =
        document.getElementById("calcDisplay");

    const resultadoElemento =
        document.getElementById("calcResult");

    const status =
        document.getElementById("historyStatus");

    if (!display) return;

    const expressaoOriginal =
        display.value.trim();

    if (!expressaoOriginal) return;

    try {

        if (typeof math === "undefined") {

            throw new Error(
                "Biblioteca Math.js não carregada."
            );

        }

        const expressao =
            prepararExpressao(expressaoOriginal);

        const resultado = math.evaluate(
            expressao,
            criarFuncoesTrigonométricas()
        );

        if (
            typeof resultado !== "number" ||
            !Number.isFinite(resultado)
        ) {

            throw new Error(
                "Resultado matemático inválido."
            );

        }

        // Guardar último resultado
        lastCalculationResult = resultado;

        // Exibir resultado
        display.value = String(resultado);

        if (resultadoElemento) {

            resultadoElemento.textContent =
                String(resultado);

        }

        if (status) {
            status.textContent = "";
        }

        // Criar registro local
        const novoCalculo = {

            expressao: expressaoOriginal,

            resultado: resultado,

            created_at: new Date().toISOString()

        };

        history.unshift(novoCalculo);

        history = history.slice(0, 5);

        updateHistory();

        // Salvar no Supabase
        await salvarCalculo(
            expressaoOriginal,
            resultado
        );

    } catch (error) {

        console.error(
            "Erro no cálculo:",
            error
        );

        lastCalculationResult = null;

        if (resultadoElemento) {

            resultadoElemento.textContent = "Erro";

        }

        if (status) {

            status.textContent =
                "Não foi possível realizar esse cálculo.";

        }

    }

}


// ========================================
// SALVAR CÁLCULO NO SUPABASE
// ========================================

async function salvarCalculo(expressao, resultado) {

    const status =
        document.getElementById("historyStatus");

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

            throw new Error(
                "Usuário não autenticado."
            );

        }

        const { error } = await supabaseClient
            .from("calculos")
            .insert({

                tipo: "calculadora_cientifica",

                expressao: expressao,

                resultado: resultado

            });

        if (error) throw error;

        if (status) {

            status.textContent =
                "Cálculo salvo na nuvem.";

        }

        await carregarHistorico();

    } catch (error) {

        console.error(
            "Erro ao salvar cálculo:",
            error
        );

        if (status) {

            status.textContent =
                "Cálculo realizado, mas não foi possível salvar no banco.";

        }

    }

}


// ========================================
// CARREGAR HISTÓRICO DO SUPABASE
// ========================================

async function carregarHistorico() {

    const status =
        document.getElementById("historyStatus");

    try {

        if (
            typeof supabaseClient === "undefined" ||
            !supabaseClient
        ) {

            throw new Error(
                "Conexão com Supabase não encontrada."
            );

        }

        const { data, error } = await supabaseClient
            .from("calculos")
            .select("expressao, resultado, created_at")
            .eq("tipo", "calculadora_cientifica")
            .order("created_at", {
                ascending: false
            })
            .limit(5);

        if (error) throw error;

        history = data || [];

        updateHistory();

        if (status) {

            status.textContent = history.length
                ? "Histórico sincronizado com o Supabase."
                : "Nenhum cálculo registrado ainda.";

        }

    } catch (error) {

        console.error(
            "Erro ao carregar histórico:",
            error
        );

        if (status) {

            status.textContent =
                "Não foi possível carregar o histórico do banco.";

        }

    }

}


// ========================================
// EXIBIR HISTÓRICO
// ========================================

function updateHistory() {

    const list =
        document.getElementById("historyList");

    if (!list) return;

    list.innerHTML = "";

    history.slice(0, 5).forEach(item => {

        const li = document.createElement("li");

        li.textContent =
            `${item.expressao} = ${item.resultado}`;

        list.appendChild(li);

    });

}


// ========================================
// TECLADO
// ========================================

document.addEventListener("keydown", function(event) {

    const display =
        document.getElementById("calcDisplay");

    if (
        !display ||
        document.activeElement !== display
    ) {
        return;
    }

    if (event.key === "Enter") {

        event.preventDefault();

        calculate();

    }

});
