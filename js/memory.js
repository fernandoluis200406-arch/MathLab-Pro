let memoryValue = 0;

function memoryAdd() {
    let result = getLastResult();
    if (!isNaN(result)) {
        memoryValue += result;
        alert("Memória atual: " + memoryValue);
    }
}

function memorySubtract() {
    let result = getLastResult();
    if (!isNaN(result)) {
        memoryValue -= result;
        alert("Memória atual: " + memoryValue);
    }
}

function memoryRecall() {
    alert("Memória armazenada: " + memoryValue);
}

function getLastResult() {
    const resultText = document.getElementById("calcResult");
    if (!resultText) return 0;

    const match = resultText.innerText.match(/[-+]?[0-9]*\.?[0-9]+/);
    return match ? parseFloat(match[0]) : 0;
}