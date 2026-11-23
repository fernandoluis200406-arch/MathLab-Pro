
"use strict";

// ===============================
// MEMÓRIA DA CALCULADORA
// ===============================

let memoryValue = 0;


// ===============================
// ADICIONAR À MEMÓRIA (M+)
// ===============================

function memoryAdd() {

    const result = getLastResult();

    if (result !== null) {

        memoryValue += result;

        alert(
            "Valor adicionado à memória: " + memoryValue
        );

    }

}


// ===============================
// SUBTRAIR DA MEMÓRIA (M-)
// ===============================

function memorySubtract() {

    const result = getLastResult();

    if (result !== null) {

        memoryValue -= result;

        alert(
            "Valor subtraído da memória: " + memoryValue
        );

    }

}


// ===============================
// RECUPERAR MEMÓRIA (MR)
// ===============================

function memoryRecall() {

    const display =
        document.getElementById("calcDisplay");

    const resultado =
        document.getElementById("calcResult");

    if (display) {

        display.value = String(memoryValue);

        lastCalculationResult = memoryValue;

        if (resultado) {
            resultado.textContent = String(memoryValue);
        }

    }

    alert(
        "Memória recuperada: " + memoryValue
    );

}


// ===============================
// LIMPAR MEMÓRIA (MC)
// ===============================

function memoryClear() {

    memoryValue = 0;

    alert("Memória limpa!");

}


// ===============================
// CAPTURAR ÚLTIMO RESULTADO
// ===============================

function getLastResult() {

    if (
        typeof lastCalculationResult === "number" &&
        Number.isFinite(lastCalculationResult)
    ) {

        return lastCalculationResult;

    }

    alert("Nenhum resultado disponível.");

    return null;

}
