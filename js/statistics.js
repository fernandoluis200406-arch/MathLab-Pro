function statisticsHTML(){
return `
<h2>Estatística</h2>
<input id="nums" placeholder="1,2,3,4">
<button class="action" onclick="calcStats()">Calcular</button>
<p id="statResult"></p>

<!-- 🔥 EXPLICAÇÃO -->
<div class="explicacao">
    <h3>📘 O que são Média e Desvio Padrão?</h3>

    <p>
    A média e o desvio padrão são medidas estatísticas utilizadas para analisar um conjunto de dados.
    Elas ajudam a entender o comportamento e a dispersão dos valores.
    </p>

    <h4>📐 Média Aritmética:</h4>

    <p>
    A média é o valor central de um conjunto de números.
    </p>

    <p>
    <strong>Média = (x₁ + x₂ + x₃ + ... + xₙ) / n</strong>
    </p>

    <p>
    Onde:
    </p>
    <ul>
        <li><strong>x</strong> = valores do conjunto</li>
        <li><strong>n</strong> = quantidade de valores</li>
    </ul>

    <h4>📊 Desvio Padrão:</h4>

    <p>
    O desvio padrão mede o quanto os valores estão dispersos em relação à média.
    Quanto maior o desvio, mais espalhados estão os dados.
    </p>

    <p>
    <strong>
    σ = √( Σ(x - média)² / n )
    </strong>
    </p>

    <h4>📊 Etapas do cálculo:</h4>

    <p>
    1️⃣ Calcular a média dos valores<br>
    2️⃣ Subtrair a média de cada valor<br>
    3️⃣ Elevar ao quadrado cada resultado<br>
    4️⃣ Somar tudo<br>
    5️⃣ Dividir por n (variância)<br>
    6️⃣ Tirar a raiz quadrada (desvio padrão)
    </p>

    <h4>📊 Exemplo:</h4>

    <p>
    Dados: 2, 4, 6, 8
    </p>

    <p>
    Média = (2 + 4 + 6 + 8) / 4 = 5
    </p>

    <p>
    Variância = [(2-5)² + (4-5)² + (6-5)² + (8-5)²] / 4<br>
    = (9 + 1 + 1 + 9) / 4 = 5
    </p>

    <p>
    Desvio padrão = √5 ≈ <strong>2,24</strong>
    </p>

    <p>
    Essas medidas são muito utilizadas em análise de dados, pesquisas e inteligência de negócios.
    </p>
</div>
`;
}

function calcStats(){
let arr=document.getElementById("nums").value.split(",").map(Number);
let media=arr.reduce((a,b)=>a+b)/arr.length;

let variancia=arr.reduce((a,b)=>a+Math.pow(b-media,2),0)/arr.length;
let desvio=Math.sqrt(variancia);

document.getElementById("statResult").innerText=
`Média: ${media.toFixed(2)} | Desvio Padrão: ${desvio.toFixed(2)}`;
}