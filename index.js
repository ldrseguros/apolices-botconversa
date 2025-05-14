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
  const { cpf, nascimento, ultimos4 } = req.body;

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

    // Valida os dados
    const nascimentoPdf = pdfData.nascimento.replace(/\D/g, "");
    const nascimentoReq = nascimento.replace(/\D/g, "");
    const telefonePdf = pdfData.telefone.replace(/\D/g, "");
    console.log("Nascimento extraído do PDF:", pdfData.nascimento);
    console.log("Nascimento enviado:", nascimento);
    console.log("NascimentoPdf:", nascimentoPdf);
    console.log("NascimentoReq:", nascimentoReq);
    console.log("Telefone extraído do PDF:", pdfData.telefone);
    console.log("Telefone enviado:", ultimos4);

    if (nascimentoPdf !== nascimentoReq) {
      return res.status(401).json({ erro: "Data de nascimento não confere." });
    }

    if (ultimos4 && !telefonePdf.endsWith(ultimos4)) {
      return res.status(401).json({ erro: "Telefone inválido." });
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
