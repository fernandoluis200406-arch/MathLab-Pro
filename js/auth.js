// ========================================
// 🔐 CONFIGURAÇÃO DO SUPABASE
// ========================================

const SUPABASE_URL = "https://rqmdhiiqqtzfeoycpqfm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_2Mp2jmEqcNXmad4Mwje1og_NQURWe_Z";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// ========================================
// 🔑 LOGIN
// ========================================

async function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const loginError = document.getElementById("loginError");

    loginError.innerText = "";

    if (!email || !password) {
        loginError.innerText = "Preencha o e-mail e a senha.";
        return;
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        console.error(error);

        loginError.innerText = "E-mail ou senha incorretos.";
        return;
    }

    console.log("Login realizado:", data.user);

    window.location.href = "index.html";
}


// ========================================
// 🚪 LOGOUT
// ========================================

async function logout() {

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        console.error("Erro ao sair:", error);
        return;
    }

    window.location.href = "login.html";
}