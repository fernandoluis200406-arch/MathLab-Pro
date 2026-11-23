
"use strict";

// ========================================
// MATHLAB PRO - AUTENTICAÇÃO SUPABASE
// ========================================

const SUPABASE_URL = "https://rqmdhiiqqtzfeoycpqfm.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_2Mp2jmEqcNXmad4Mwje1og_NQURWe_Z";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// ========================================
// ELEMENTOS E MENSAGENS
// ========================================

function mostrarMensagem(mensagem) {
    const elemento = document.getElementById("loginError");

    if (elemento) {
        elemento.textContent = mensagem;
    }
}

function limparMensagem() {
    mostrarMensagem("");
}


// ========================================
// NAVEGAÇÃO ENTRE TELAS
// ========================================

function mostrarLogin() {
    document.getElementById("loginSection").hidden = false;
    document.getElementById("recoverySection").hidden = true;
    document.getElementById("newPasswordSection").hidden = true;

    limparMensagem();
}

function mostrarRecuperacao() {
    document.getElementById("loginSection").hidden = true;
    document.getElementById("recoverySection").hidden = false;
    document.getElementById("newPasswordSection").hidden = true;

    const email = document.getElementById("email").value.trim();

    if (email) {
        document.getElementById("recoveryEmail").value = email;
    }

    limparMensagem();
}

function mostrarNovaSenha() {
    document.getElementById("loginSection").hidden = true;
    document.getElementById("recoverySection").hidden = true;
    document.getElementById("newPasswordSection").hidden = false;

    limparMensagem();
}


// ========================================
// VERIFICAR ACESSO E SESSÃO
// ========================================

async function verificarAcesso() {

    const paginaLogin =
        document.getElementById("loginError") !== null;

    if (!paginaLogin) {
        const { data, error } =
            await supabaseClient.auth.getSession();

        if (error || !data.session) {
            window.location.replace("login.html");
            return;
        }

        const elementoEmail =
            document.getElementById("userEmail");

        if (elementoEmail) {
            elementoEmail.textContent =
                data.session.user.email || "Usuário conectado";
        }

        return;
    }

    // Verificar se o link recebido é de recuperação
    const hash = window.location.hash;

    const parametros = new URLSearchParams(
        hash.startsWith("#") ? hash.substring(1) : hash
    );

    if (
        parametros.get("error_code") === "otp_expired" ||
        parametros.get("error") === "access_denied"
    ) {
        mostrarMensagem(
            "O link de recuperação expirou ou é inválido. Solicite outro e-mail."
        );

        return;
    }

    const ehRecuperacao =
        parametros.get("type") === "recovery";

    const { data, error } =
        await supabaseClient.auth.getSession();

    if (ehRecuperacao && data.session) {
        mostrarNovaSenha();
        return;
    }

    if (error) {
        console.error("Erro ao verificar sessão:", error);
    }

    if (data.session) {
        window.location.replace("index.html");
    }
}


// ========================================
// LOGIN
// ========================================

async function login() {

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    limparMensagem();

    if (!email || !password) {
        mostrarMensagem("Preencha o e-mail e a senha.");
        return;
    }

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

    if (error) {
        console.error("Erro no login:", error);
        mostrarMensagem("E-mail ou senha incorretos.");
        return;
    }

    if (data.session) {
        window.location.replace("index.html");
    }
}


// ========================================
// SOLICITAR RECUPERAÇÃO DE SENHA
// ========================================

async function recuperarSenha() {

    const email =
        document.getElementById("recoveryEmail").value.trim();

    limparMensagem();

    if (!email) {
        mostrarMensagem("Informe seu e-mail.");
        return;
    }

    const { error } =
        await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin +
                window.location.pathname
        });

    if (error) {
        console.error("Erro na recuperação:", error);
        mostrarMensagem(
            "Não foi possível enviar o e-mail. Tente novamente."
        );
        return;
    }

    mostrarMensagem(
        "Solicitação enviada! Confira sua caixa de entrada e o spam."
    );
}


// ========================================
// SALVAR NOVA SENHA
// ========================================

async function atualizarSenha() {

    const senha =
        document.getElementById("newPassword").value;

    const confirmacao =
        document.getElementById("confirmPassword").value;

    limparMensagem();

    if (!senha || !confirmacao) {
        mostrarMensagem("Preencha os dois campos de senha.");
        return;
    }

    if (senha.length < 6) {
        mostrarMensagem(
            "A senha deve ter pelo menos 6 caracteres."
        );
        return;
    }

    if (senha !== confirmacao) {
        mostrarMensagem("As senhas não são iguais.");
        return;
    }

    const { error } =
        await supabaseClient.auth.updateUser({
            password: senha
        });

    if (error) {
        console.error("Erro ao atualizar senha:", error);
        mostrarMensagem(
            "Não foi possível atualizar a senha. Solicite um novo link."
        );
        return;
    }

    alert("Senha alterada com sucesso!");

    window.location.replace("index.html");
}


// ========================================
// LOGOUT
// ========================================

async function logout() {

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {
        console.error("Erro ao sair:", error);

        alert("Não foi possível encerrar a sessão.");
        return;
    }

    window.location.replace("login.html");
}


// ========================================
// DETECTAR EVENTO DE RECUPERAÇÃO
// ========================================

supabaseClient.auth.onAuthStateChange((event, session) => {

    if (event === "PASSWORD_RECOVERY" && session) {
        mostrarNovaSenha();
    }

});


// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    const paginaLogin =
        document.getElementById("loginError") !== null;

    if (paginaLogin) {
        verificarAcesso();
    }

});
