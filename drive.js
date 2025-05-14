import { google } from "googleapis";
import dotenv from "dotenv";
import { readPDFBuffer } from "./pdfReader.js";

dotenv.config();

const credentials = {
  type: process.env.GOOGLE_TYPE,
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
};

const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ["https://www.googleapis.com/auth/drive.readonly"]
);

const drive = google.drive({ version: "v3", auth });

async function getApolicePDF(cpf_cnpj) {
  const fileName = `Apolice_${cpf_cnpj}.pdf`;

  try {
    const res = await drive.files.list({
      q: `name='${fileName}' and mimeType='application/pdf'`,
      fields: "files(id, name)",
    });

    const files = res.data.files;
    if (!files.length) return null;

    return files[0].id;
  } catch (error) {
    console.error("Erro ao acessar o Drive:", error);
    return null;
  }
}

async function readPDFData(fileId) {
  try {
    const result = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "arraybuffer" }
    );
    const buffer = Buffer.from(result.data);
    const data = await readPDFBuffer(buffer);

    return data;
  } catch (error) {
    console.error("Erro ao ler PDF:", error);
    return {};
  }
}

export { getApolicePDF, readPDFData };
