const units = {
mm: 0.001,
cm: 0.01,
dm: 0.1,
m: 1,
dam: 10,
hm: 100,
km: 1000
};

function converterHTML(){
return `
<div class="card">
<h2>Conversor de Comprimento</h2>

<input id="value" placeholder="Valor">

<select id="fromUnit">
${createOptions()}
</select>

<select id="toUnit">
${createOptions()}
</select>

<button class="action" onclick="convert()">Converter</button>

<p id="convResult"></p>

<!-- 🔥 EXPLICAÇÃO -->
<div class="explicacao">
    <h3>📘 Como funciona a conversão?</h3>
    
    <p>
    A conversão de unidades de comprimento é feita utilizando o metro (m) como base padrão.
    Todas as outras unidades são convertidas primeiro para metros e depois para a unidade desejada.
    </p>

    <h4>📐 Etapas do cálculo:</h4>
    <p>
    1️⃣ Converter o valor inicial para metros:<br>
    <strong>metros = valor × fator da unidade de origem</strong>
    </p>

    <p>
    2️⃣ Converter de metros para a unidade desejada:<br>
    <strong>resultado = metros ÷ fator da unidade destino</strong>
    </p>

    <h4>📊 Exemplo:</h4>
    <p>
    Converter 2 km para metros:
    </p>
    <p>
    1️⃣ 2 × 1000 = 2000 m<br>
    2️⃣ Resultado final: <strong>2000 m</strong>
    </p>

    <p>
    Isso funciona porque o sistema métrico é baseado em múltiplos de 10,
    facilitando conversões entre as unidades.
    </p>
</div>

</div>
`;
}

function createOptions(){
return Object.keys(units)
.map(u=> `<option value="${u}">${u}</option>`)
.join('');
}

function convert(){
let value = parseFloat(document.getElementById("value").value) || 0;
let from = document.getElementById("fromUnit").value;
let to = document.getElementById("toUnit").value;

let meters = value * units[from];
let result = meters / units[to];

document.getElementById("convResult").innerText =
`${value} ${from} = ${result.toFixed(6)} ${to}`;
}

document.addEventListener("keydown",function(e){
if(e.key==="Enter") convert();
});