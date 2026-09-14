// ===============================
// 🔐 PROTEÇÃO DE LOGIN
// ===============================

async function verificarLogin() {

    const { data: { user }, error } = await supabaseClient.auth.getUser();

    if (error || !user) {
        window.location.href = "login.html";
        return;
    }

    console.log("Usuário autenticado:", user.email);

        // Mostrar e-mail do usuário
    const userEmail = document.getElementById("userEmail");

    if (userEmail) {
        userEmail.innerText = user.email;
    }
}


// ===============================
// 🎨 TEMA (Dark / Light)
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
// 🚀 INICIALIZAÇÃO DO SISTEMA
// ===============================

window.onload = async function () {

    // Verificar autenticação
    await verificarLogin();

    // Restaurar tema
    const theme = localStorage.getItem("theme");

    if (theme === "light") {
        document.body.classList.add("light");
    }

    // Carregar dashboard
    loadModule("dashboard");
};


// ===============================
// 📦 SISTEMA DE MÓDULOS
// ===============================

function loadModule(module) {

    const content = document.getElementById("content");

    switch (module) {

        case "dashboard":
            content.innerHTML = dashboardHTML();
            loadDashboard();
            break;

        case "calculator":
            content.innerHTML = calculatorHTML();
            break;

        case "converter":
            content.innerHTML = converterHTML();
            break;

        case "base":
            content.innerHTML = baseHTML();
            break;

        case "finance":
            content.innerHTML = financeHTML();
            break;

        case "statistics":
            content.innerHTML = statisticsHTML();
            break;

        case "graph":
            content.innerHTML = graphHTML();
            break;

        default:
            content.innerHTML = `
                <h2>Módulo não encontrado</h2>
            `;
    }
}