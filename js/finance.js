function financeHTML(){
return `
<div class="card">
<h2>Juros Compostos</h2>

<input id="capital" placeholder="Capital Inicial">
<input id="taxa" placeholder="Taxa % ao mês">
<input id="tempo" placeholder="Meses">
<input id="aporte" placeholder="Aporte Mensal">

<button class="action" onclick="calcularJuros()">Calcular</button>

<p id="finResult"></p>

<!-- 🔥 EXPLICAÇÃO -->
<div class="explicacao">
    <h3>📘 Como funcionam os Juros Compostos?</h3>

    <p>
    Juros compostos são aqueles em que os juros são calculados sobre o valor inicial
    e também sobre os juros acumulados ao longo do tempo. Isso é conhecido como
    <strong>"juros sobre juros"</strong>.

    Essa forma de cálculo faz com que o montante cresça de maneira exponencial, proporcionando maior retorno para os investidores ou gerando maior custo para os tomadores de empréstimos e financiamentos no crédito.
    </p>

    <h4>📐 Fórmula básica:</h4>

    <p>
    <strong>M = C × (1 + i)<sup>t</sup></strong>
    </p>

    <p>
    Onde:
    </p>
    <ul>
        <li><strong>M</strong> = Montante final</li>
        <li><strong>C</strong> = Capital inicial</li>
        <li><strong>i</strong> = Taxa de juros (em decimal)</li>
        <li><strong>t</strong> = Tempo (meses)</li>
    </ul>

    <h4>📊 Com aporte mensal:</h4>

    <p>
    Quando existe um valor sendo adicionado todos os meses (aporte),
    o cálculo é feito de forma acumulativa, mês a mês:
    </p>

    <p>
    <strong>
    Montante = (Montante atual + Aporte) × (1 + i)
    </strong>
    </p>

    <p>
    Esse processo se repete até o final do período.
    </p>

    <h4>📊 Exemplo:</h4>

    <p>
    Capital inicial: R$1000<br>
    Taxa: 1% ao mês<br>
    Tempo: 3 meses<br>
    Aporte: R$100
    </p>

    <p>
    Mês 1: (1000 + 100) × 1,01 = 1111<br>
    Mês 2: (1111 + 100) × 1,01 ≈ 1223,11<br>
    Mês 3: (1223,11 + 100) × 1,01 ≈ 1336,34
    </p>

    <p>
    <strong>Montante final ≈ R$1336,34</strong>
    </p>

    <p>
    <h4>Qual a diferença entre juros simples e juros compostos?</h4>
A diferença entre juros simples e juros compostos está na forma como os juros são calculados ao longo do tempo.

Nos juros simples, os juros são calculados apenas sobre o valor inicial. Já nos juros compostos, os juros são calculados sobre o valor inicial e também sobre os juros acumulados anteriormente.

Em termos de resultado, os juros compostos tendem a acumular um montante maior ao longo do tempo do que os juros simples.
    </p>

    <p>
    Esse tipo de cálculo é muito utilizado em investimentos, financiamentos e aplicações financeiras.
    </p>
</div>

</div>
`;
}

function calcularJuros(){

let c = parseFloat(document.getElementById("capital").value) || 0;
let i = (parseFloat(document.getElementById("taxa").value) || 0)/100;
let t = parseInt(document.getElementById("tempo").value) || 0;
let aporte = parseFloat(document.getElementById("aporte").value) || 0;

let montante = c;

for(let mes=1; mes<=t; mes++){
montante = (montante + aporte) * (1+i);
}

document.getElementById("finResult").innerText =
"Montante Final: R$ " + montante.toFixed(2);
}

document.addEventListener("keydown",function(e){
if(e.key==="Enter"){
calcularJuros();
}
});