import path from "path";
import { google } from "googleapis";
import dotenv from "dotenv";

// Carregar as variáveis de ambiente do .env
dotenv.config();

// Construir a chave privada a partir da variável de ambiente
const credentials = {
  type: process.env.GOOGLE_TYPE,
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Corrige a quebra de linha no private key
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
};

// Configuração da autenticação no Google Drive
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ["https://www.googleapis.com/auth/drive.readonly"]
);

const drive = google.drive({ version: "v3", auth });

// Função para obter a apólice de acordo com o CPF
async function getApolicePDF(cpf_cnpj) {
  const fileName = `Apolice_${cpf_cnpj}.pdf`;

  try {
    const res = await drive.files.list({
      q: `name='${fileName}' and mimeType='application/pdf'`,
      fields: "files(id, name)",
    });

    const files = res.data.files;
    if (!files.length) return null;

    const fileId = files[0].id;

    // Retorna o ID do arquivo
    return fileId;
  } catch (error) {
    console.error("Erro no acesso ao Drive:", error);
    return null;
  }
}

export { getApolicePDF };
