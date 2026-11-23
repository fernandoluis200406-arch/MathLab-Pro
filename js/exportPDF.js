
"use strict";

// ==========================================
// MATHLAB PRO - EXPORTAÇÃO DE RELATÓRIO PDF
// INTEGRADO AO SUPABASE
// ==========================================

async function exportPDF() {

    try {

        // ==================================
        // VERIFICAR BIBLIOTECA
        // ==================================

        if (
            !window.jspdf ||
            !window.jspdf.jsPDF
        ) {

            alert("Biblioteca jsPDF não encontrada.");

            return;
        }

        const { jsPDF } = window.jspdf;

        // ==================================
        // VERIFICAR AUTENTICAÇÃO
        // ==================================

        if (
            typeof supabaseClient === "undefined" ||
            !supabaseClient
        ) {

            alert("Conexão com Supabase indisponível.");

            return;
        }

        const { data: sessionData, error: authError } =
            await supabaseClient.auth.getSession();

        if (authError) throw authError;

        const user = sessionData.session?.user;

        if (!user) {

            alert("Faça login para exportar seu relatório.");

            window.location.href = "login.html";

            return;
        }

        // ==================================
        // BUSCAR CÁLCULOS
        // ==================================

        const { data: calculos, error } = await supabaseClient
            .from("calculos")
            .select(
                "tipo, expressao, resultado, resultado_texto, created_at"
            )
            .order("created_at", {
                ascending: false
            });

        if (error) throw error;

        if (!calculos || calculos.length === 0) {

            alert("Você ainda não possui cálculos registrados.");

            return;
        }

        // ==================================
        // CRIAR DOCUMENTO
        // ==================================

        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        const larguraPagina = doc.internal.pageSize.getWidth();
        const alturaPagina = doc.internal.pageSize.getHeight();

        const margem = 20;

        const larguraTexto = larguraPagina - margem * 2;

        let y = 20;

        // ==================================
        // CABEÇALHO
        // ==================================

        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);

        doc.text(
            "MathLab Pro",
            margem,
            y
        );

        y += 9;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);

        doc.text(
            "Relatório de Atividades",
            margem,
            y
        );

        y += 10;

        doc.setFontSize(9);

        doc.text(
            `Usuário: ${user.email || "Não informado"}`,
            margem,
            y
        );

        y += 6;

        doc.text(
            `Data de emissão: ${new Date().toLocaleString("pt-BR")}`,
            margem,
            y
        );

        y += 6;

        doc.text(
            `Total de registros: ${calculos.length}`,
            margem,
            y
        );

        y += 8;

        doc.setDrawColor(150, 150, 150);

        doc.line(
            margem,
            y,
            larguraPagina - margem,
            y
        );

        y += 10;

        // ==================================
        // IDENTIFICAR TIPOS DE CÁLCULO
        // ==================================

        function nomeTipoPDF(tipo) {

            const tipos = {

                calculadora_cientifica: "Calculadora Científica",

                conversor_comprimento: "Conversor de Comprimento",

                conversor_bases: "Conversor de Bases",

                juros_compostos: "Juros Compostos",

                estatistica: "Estatística",

                grafico: "Gráficos"

            };

            return tipos[tipo] || tipo || "Cálculo";

        }

        // ==================================
        // CONFIGURAR RODAPÉ
        // ==================================

        function adicionarRodape() {

            const paginas = doc.internal.getNumberOfPages();

            for (let i = 1; i <= paginas; i++) {

                doc.setPage(i);

                doc.setFont("helvetica", "normal");

                doc.setFontSize(8);

                doc.setTextColor(100);

                doc.text(
                    `MathLab Pro - Página ${i} de ${paginas}`,
                    larguraPagina / 2,
                    alturaPagina - 10,
                    {
                        align: "center"
                    }
                );

            }

        }

        // ==================================
        // VERIFICAR ESPAÇO NA PÁGINA
        // ==================================

        function verificarEspaco(alturaNecessaria) {

            if (y + alturaNecessaria > alturaPagina - 20) {

                doc.addPage();

                y = 20;

            }

        }

        // ==================================
        // ADICIONAR REGISTROS
        // ==================================

        calculos.forEach((item, index) => {

            const tipo = nomeTipoPDF(item.tipo);

            const expressao =
                item.expressao || "Expressão não informada";

            const resultado =
                item.resultado_texto ??
                item.resultado ??
                "Não informado";

            const data = item.created_at
                ? new Date(item.created_at).toLocaleString("pt-BR")
                : "Data não informada";

            const linhas = [

                `${index + 1}. ${tipo}`,

                `Expressão: ${expressao}`,

                `Resultado: ${resultado}`,

                `Data: ${data}`

            ];

            // Calcular altura aproximada do bloco
            const linhasPreparadas = linhas.map(linha => {

                return doc.splitTextToSize(
                    String(linha),
                    larguraTexto - 8
                );

            });

            const alturaBloco =
                linhasPreparadas.reduce(
                    (total, texto) => total + texto.length * 5,
                    0
                ) + 12;

            verificarEspaco(alturaBloco);

            // Título do registro
            doc.setFont("helvetica", "bold");

            doc.setFontSize(11);

            doc.setTextColor(30, 30, 30);

            doc.text(
                linhasPreparadas[0],
                margem,
                y
            );

            y += linhasPreparadas[0].length * 5 + 2;

            // Expressão
            doc.setFont("helvetica", "normal");

            doc.setFontSize(9);

            doc.setTextColor(60, 60, 60);

            doc.text(
                linhasPreparadas[1],
                margem + 3,
                y
            );

            y += linhasPreparadas[1].length * 5 + 2;

            // Resultado
            doc.setFont("helvetica", "bold");

            doc.text(
                linhasPreparadas[2],
                margem + 3,
                y
            );

            y += linhasPreparadas[2].length * 5 + 2;

            // Data
            doc.setFont("helvetica", "normal");

            doc.text(
                linhasPreparadas[3],
                margem + 3,
                y
            );

            y += linhasPreparadas[3].length * 5 + 7;

            // Separador
            doc.setDrawColor(220, 220, 220);

            doc.line(
                margem,
                y,
                larguraPagina - margem,
                y
            );

            y += 7;

        });

        // ==================================
        // ADICIONAR RODAPÉS
        // ==================================

        adicionarRodape();

        // ==================================
        // SALVAR PDF
        // ==================================

        doc.save("relatorio_mathlab.pdf");

        alert("Relatório PDF gerado com sucesso!");

    } catch (erro) {

        console.error(
            "Erro ao exportar PDF:",
            erro
        );

        alert(
            "Ocorreu um erro ao gerar o relatório."
        );

    }

}
