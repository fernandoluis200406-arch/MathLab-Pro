function baseHTML() {
    return `
        <div class="card">
            <h2>Conversor de Bases</h2>

            <input id="baseInput" placeholder="Digite o número" oninput="validateInput()">

            <div class="row">
                <select id="fromBase">
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

            <button class="action" onclick="convertBase()">Converter</button>

            <p id="baseResult"></p>

            <!-- 🔥 EXPLICAÇÃO -->
            <div class="explicacao">
                <h3>📘 Como funciona a conversão de bases?</h3>

                <p>
                Sistemas numéricos são formas diferentes de representar números utilizando bases distintas.
                As principais bases utilizadas são:
                </p>

                <ul>
                    <li><strong>Base 2 (Binário):</strong> utiliza apenas 0 e 1</li>
                    <li><strong>Base 8 (Octal):</strong> utiliza números de 0 a 7</li>
                    <li><strong>Base 10 (Decimal):</strong> sistema padrão (0 a 9)</li>
                    <li><strong>Base 16 (Hexadecimal):</strong> utiliza 0–9 e A–F</li>
                </ul>

                <h4>📐 Como o cálculo é feito?</h4>

                <p>
                O processo de conversão acontece em duas etapas:
                </p>

                <p>
                1️⃣ Primeiro, o número é convertido para decimal:<br>
                <strong>Valor Decimal = soma dos dígitos × (base<sup>posição</sup>)</strong>
                </p>

                <p>
                2️⃣ Depois, o decimal é convertido para a base desejada usando divisões sucessivas:<br>
                <strong>Dividir o número pela base e guardar os restos</strong>
                </p>

                <h4>📊 Exemplo:</h4>

                <p>
                Converter o número binário <strong>1011</strong> para decimal:
                </p>

                <p>
                (1×2³) + (0×2²) + (1×2¹) + (1×2⁰)<br>
                = 8 + 0 + 2 + 1 = <strong>11</strong>
                </p>

                <p>
                Depois, para converter 11 para hexadecimal:
                </p>

                <p>
                11 ÷ 16 → resto 11 → equivalente a <strong>B</strong><br>
                Resultado: <strong>B</strong>
                </p>

                <p>
                Esse processo é amplamente utilizado na computação, principalmente em sistemas digitais e programação.
                </p>
            </div>
        </div>
    `;
}

// 🔥 Validação automática SEM depender do main.js
function validateInput() {
    const input = document.getElementById("baseInput");
    const base = document.getElementById("fromBase").value;

    let value = input.value;

    if (base == 2) {
        value = value.replace(/[^01]/g, '');
    } 
    else if (base == 8) {
        value = value.replace(/[^0-7]/g, '');
    } 
    else if (base == 10) {
        value = value.replace(/[^0-9]/g, '');
    } 
    else if (base == 16) {
        value = value.replace(/[^0-9a-fA-F]/g, '');
    }

    input.value = value;
}

function convertBase() {
    let input = document.getElementById("baseInput").value.trim();
    let fromBase = parseInt(document.getElementById("fromBase").value);
    let toBase = parseInt(document.getElementById("toBase").value);
    let resultElement = document.getElementById("baseResult");

    let decimal = parseInt(input, fromBase);

    if (isNaN(decimal)) {
        resultElement.innerText = "❌ Número inválido.";
        return;
    }

    let result = decimal.toString(toBase);

    resultElement.innerText = `Resultado: ${result.toUpperCase()}`;
}