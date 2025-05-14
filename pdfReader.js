import pdf from "pdf-parse";

export async function readPDFBuffer(buffer) {
  const data = await pdf(buffer);
  const text = data.text;

  const nascimentoMatch = text.match(
    /nascimento\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/i
  );
  const nascimento = nascimentoMatch ? nascimentoMatch[1] : "";

  const rgMatch = text.match(/\b\d{1,2}\.?\d{3}\.?\d{3}-?[0-9Xx]\b/);
  const rg = rgMatch ? rgMatch[0] : "";

  console.log("=== TEXTO COMPLETO EXTRAÍDO DO PDF ===");
  console.log(text);

  return { nascimento, telefone };
}
