import pdf from "pdf-parse";

export async function readPDFBuffer(buffer) {
  const data = await pdf(buffer);
  const text = data.text;

  const nascimento =
    (text.match(/Data de Nascimento:\s*(\d{2}\/\d{2}\/\d{4})/) || [])[1] || "";
  const telefone =
    (text.match(/Telefone:\s*(\(?\d{2}\)?\s?\d{4,5}-?\d{4})/) || [])[1] || "";

  return { nascimento, telefone };
}
