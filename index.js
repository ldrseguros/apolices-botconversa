import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getApolicePDF } from "./drive.js";

// Carregar as variáveis de ambiente do .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Permite o frontend a partir da URL configurada no .env
  })
);

app.get("/", (req, res) => {
  res.send(
    "Servidor rodando. Acesse /apolice?cpf=12345678900 para obter o link da apólice."
  );
});

app.get("/apolice", async (req, res) => {
  const cpf_cnpj = req.query.cpf;
  if (!cpf_cnpj) return res.status(400).send("CPF é obrigatório");

  try {
    const fileId = await getApolicePDF(cpf_cnpj);
    if (!fileId) return res.status(404).send("Apolice não encontrada");

    const pdfLink = `https://drive.google.com/file/d/${fileId}/view`;
    res.send({ link: pdfLink });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar apólice");
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
