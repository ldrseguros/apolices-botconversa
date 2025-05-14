import pdf from "pdf-parse";

export async function readPDFBuffer(buffer) {
  const data = await pdf(buffer);
  const text = data.text;

  const nascimento =
    (text.match(/DATA NASCIMENTO \s*(\d{2}\/\d{2}\/\d{4})/) || [])[1] || "";
  const telefone =
    (text.match(/Telefone:\s*(\(?\d{2}\)?\s?\d{4,5}-?\d{4})/) || [])[1] || "";

  console.log("=== TEXTO COMPLETO EXTRAÍDO DO PDF ===");
  console.log(text);

  return { nascimento, telefone };
}
