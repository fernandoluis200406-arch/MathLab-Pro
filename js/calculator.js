let history = [];
let isDegree = true;

function calculatorHTML(){
return `

<div class="card">
<h2>Calculadora Científica</h2>

<input id="display" placeholder="Digite ou use os botões">

<div class="calc-grid">
${createButtons()}
</div>

<h3>Histórico</h3>
<ul id="historyList"></ul>
</div>

<div class="explicacao">
    <h3>🧮 Calculadora Científica</h3>

    <p>
    A calculadora científica permite realizar desde operações básicas até cálculos mais avançados,
    sendo útil para resolver expressões matemáticas do dia a dia.
    </p>

    <h4>📌 Operações Básicas</h4>
    <ul>
        <li><strong>+</strong> → Adição (ex: 2 + 3 = 5)</li>
        <li><strong>-</strong> → Subtração (ex: 5 - 2 = 3)</li>
        <li><strong>*</strong> → Multiplicação (ex: 4 * 3 = 12)</li>
        <li><strong>/</strong> → Divisão (ex: 10 / 2 = 5)</li>
    </ul>

    <h4>📐 Potência e Raiz</h4>
    <ul>
        <li><strong>x²</strong> → Eleva o número ao quadrado</li>
        <li><strong>xʸ</strong> → Potência (ex: 2^3 = 8)</li>
        <li><strong>√</strong> → Raiz quadrada (ex: √9 = 3)</li>
    </ul>

    <h4>📊 Funções Trigonométricas</h4>
    <ul>
        <li><strong>sen(x)</strong> → Seno</li>
        <li><strong>cos(x)</strong> → Cosseno</li>
        <li><strong>tan(x)</strong> → Tangente</li>
    </ul>

    <h4>🔢 Outras Funções</h4>
    <ul>
        <li><strong>log(x)</strong> → Logaritmo</li>
        <li><strong>π</strong> → Valor aproximado de 3.1416</li>
        <li><strong>ln(x)</strong> → Logaritmo natural do número x (utiliza a base e (número de Euler), aproximadamente 2,718)</li>
    </ul>

    <h4>⚙️ Como usar</h4>
    <ul>
        <li>Digite a expressão desejada</li>
        <li>Use os botões ou teclado</li>
        <li>Pressione "=" ou Enter para calcular</li>
    </ul>

    <h4>⚠️ Observações</h4>
    <ul>
        <li>Use <strong>*</strong> para multiplicar (ex: 2*3)</li>
        <li>Use <strong>Math.</strong> para funções (ex: Math.sin(1))</li>
        <li>Evite expressões incompletas</li>
    </ul>
</div>
`;


}

function createButtons(){
const buttons = [
'1','2','3','+',
'4','5','6','-',
'7','8','9','*',
'.','0','=','/',
'^','%','π','C',
'sqrt()','sen()','cos()',
'tan()','log()','ln()'
];

return buttons.map(btn =>
`<button onclick="press('${btn}')">${btn}</button>`
).join('');
}

function press(value){
const display = document.getElementById("display");

if(value === "C"){
display.value="";
return;
}

if(value === "="){
calculate();
return;
}

if(value === "π"){
display.value += "Math.PI";
return;
}

if(value === "^"){
display.value += "**";
return;
}

display.value += value;
}

function calculate(){
const display = document.getElementById("display");
try{

let expression = display.value
.replace(/sqrt/g,"Math.sqrt")
.replace(/sin/g,"Math.sin")
.replace(/cos/g,"Math.cos")
.replace(/tan/g,"Math.tan")
.replace(/log/g,"Math.log10")
.replace(/ln/g,"Math.log");

let result = Function('"use strict";return ('+expression+')')();

history.push(display.value + " = " + result);
updateHistory();

display.value = result;

}catch{
display.value = "Erro";
}
}

function updateHistory(){
const list = document.getElementById("historyList");
list.innerHTML = "";

history.slice(-5).forEach(item=>{
list.innerHTML += `<li>${item}</li>`;
});
}

document.addEventListener("keydown",function(e){
const display = document.getElementById("display");
if(!display) return;

if(e.key === "Enter"){
calculate();
}
});