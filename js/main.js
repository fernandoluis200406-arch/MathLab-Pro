
"use strict";

// ===============================
// PROTEÇÃO DE LOGIN
// ===============================

async function verificarLogin() {

    const { data: { user }, error } =
        await supabaseClient.auth.getUser();

    if (error || !user) {
        window.location.href = "login.html";
        return false;
    }

    console.log("Usuário autenticado:", user.email);

    const userEmail = document.getElementById("userEmail");

    if (userEmail) {
        userEmail.innerText = user.email;
    }

    return true;
}


// ===============================
// TEMA (DARK / LIGHT)
// ===============================

function toggleTheme() {

    document.body.classList.toggle("light");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("light")
            ? "light"
            : "dark"
    );
}


// ===============================
// INICIALIZAÇÃO
// ===============================

window.onload = async function () {

    const autenticado = await verificarLogin();

    if (!autenticado) {
        return;
    }

    const theme = localStorage.getItem("theme");

    if (theme === "light") {
        document.body.classList.add("light");
    }

    loadModule("dashboard");
};


// ===============================
// SISTEMA DE MÓDULOS
// ===============================

function loadModule(module) {

    const content = document.getElementById("content");

    if (!content) {
        console.error("Elemento content não encontrado.");
        return;
    }

    switch (module) {

        case "dashboard":
            loadDashboard();
            break;

        case "calculator":
            content.innerHTML = calculatorHTML();
            carregarHistorico();
            break;

        case "converter":
            content.innerHTML = converterHTML();
            carregarHistoricoConversoes();
            break;

        case "base":
            content.innerHTML = baseHTML();
            carregarHistoricoBases();
            break;

        case "finance":
            content.innerHTML = financeHTML();
            carregarHistoricoFinanceiro();
            break;

        case "statistics":
            content.innerHTML = statisticsHTML();
            carregarHistoricoEstatistico();
            break;

        case "graph":
            content.innerHTML = graphHTML();
            carregarHistoricoGraficos();
            break;

        default:
            content.innerHTML = `
                <h2>Módulo não encontrado</h2>
            `;
    }
}
