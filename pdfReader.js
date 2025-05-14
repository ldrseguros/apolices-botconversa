import { pdf } from "pdf-parse";

export async function readPDFBuffer(buffer) {
  const data = await pdf(buffer);
  const text = data.text;

  const nascimentoMatch = text.match(
    /nascimento\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/i
  );
  const nascimento = nascimentoMatch ? nascimentoMatch[1] : "";

  const telefoneMatch = text.match(/\(?\d{2}\)?\s?\d{4,5}-?\d{4}/);
  const telefone = telefoneMatch ? telefoneMatch[0] : "";

  console.log("=== TEXTO COMPLETO EXTRAÍDO DO PDF ===");
  console.log(text);

  return { nascimento, telefone };
}
