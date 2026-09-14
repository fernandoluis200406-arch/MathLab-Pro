function dashboardHTML(){
return `
<h2>Dashboard</h2>

<div class="dashboard-cards">
<div class="card">Total de Cálculos<br><span id="totalCalc">0</span></div>
<div class="card">Memória Atual<br><span id="memoryValueCard">0</span></div>
</div>

<canvas id="dashboardChart"></canvas>
`;
}

function loadDashboard(){

document.getElementById("content").innerHTML = dashboardHTML();

document.getElementById("totalCalc").innerText = history.length;
document.getElementById("memoryValueCard").innerText = memoryValue;

new Chart("dashboardChart", {
type:"bar",
data:{
labels:["Jan","Fev","Mar","Abr","Mai"],
datasets:[{
label:"Uso do Sistema",
data:[5,8,6,10,12]
}]
},
options:{
animation:{
duration:1500
}
}
});
}