import pdf from "pdf-parse";

export async function readPDFBuffer(buffer) {
  const data = await pdf(buffer);
  const text = data.text;

  const nascimentoMatch = text.match(
    /nascimento\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/i
  );
  const nascimento = nascimentoMatch ? nascimentoMatch[1] : "";

  // Ajustado: Captura o RG antes da data (ex: 378329101/01/2000 => 378329101)
  const rgMatch = text.match(/RG\s+(\d+)(?=\/)/i);
  const rg = rgMatch ? rgMatch[1] : "";

  console.log("=== TEXTO COMPLETO EXTRAÍDO DO PDF ===");
  console.log(text);

  return { nascimento, rg };
}
