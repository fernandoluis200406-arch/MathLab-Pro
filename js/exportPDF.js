function exportPDF(){
const { jsPDF } = window.jspdf;
let doc=new jsPDF();

doc.text("MathLab Pro - Relatório",20,20);

let y=40;
history.forEach(item=>{
doc.text(item,20,y);
y+=10;
});

doc.save("relatorio_mathlab.pdf");
}