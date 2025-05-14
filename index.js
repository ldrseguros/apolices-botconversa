import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getApolicePDF, readPDFData } from "./drive.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor rodando. Envie um POST para /validar-apolice.");
});

app.post("/validar-apolice", async (req, res) => {
  const { cpf, nascimento, rg } = req.body;

  if (!cpf || !nascimento) {
    return res
      .status(400)
      .json({ erro: "CPF e data de nascimento são obrigatórios." });
  }

  try {
    const fileId = await getApolicePDF(cpf);
    if (!fileId)
      return res.status(404).json({ erro: "Apólice não encontrada." });

    const pdfData = await readPDFData(fileId);

    const nascimentoPdf = pdfData.nascimento.replace(/\D/g, "");
    const nascimentoReq = nascimento.replace(/\D/g, "");
    const rgPdf = pdfData.rg.replace(/\D/g, "");

    console.log("Nascimento extraído do PDF:", pdfData.nascimento);
    console.log("Nascimento enviado:", nascimento);
    console.log("RG extraído do PDF:", pdfData.rg);
    console.log("RG enviado (últimos dígitos):", rg);

    if (nascimentoPdf !== nascimentoReq) {
      return res.status(401).json({ erro: "Data de nascimento não confere." });
    }

    if (rg && !rgPdf.endsWith(rg)) {
      return res.status(401).json({ erro: "RG inválido." });
    }

    const link = `https://drive.google.com/file/d/${fileId}/view`;
    return res.json({ link });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro no servidor." });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
