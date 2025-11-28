// server.mts
import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const JWT_SECRET = "sua_chave_secreta_fixa_para_o_projeto_aerocode_dev";

app.get("/", (req, res) => {
  res.send("Servidor Express rodando.");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { funcionario: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    if (user.password == password) {
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          funcionarioId: user.funcionarioId,
        },
        JWT_SECRET,
        { expiresIn: "8h" }
      );
      return res.json({
        token,
        user: { id: user.id, email: user.email, funcionario: user.funcionario },
        login: true,
      });
    } else {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

app.post("/aeronave", async (req, res) => {
  try {
    const data = req.body;

    if (!data.modelo || !data.tipo) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    const aeronave = await prisma.aeronave.create({
      data: {
        codigo: data.codigo,
        modelo: data.modelo,
        tipo: data.tipo,
        capacidade: data.capacidade,
        autonomia: data.autonomia,
      },
    });

    return res.status(200).json(aeronave);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao salvar aeronave." });
  }
});

app.post("/aeronaveDelete", async (req, res) => {
  try {
    const { codigo } = req.body;

    const aeronave = await prisma.aeronave.delete({
      where: { codigo },
    });

    return res.status(200);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro ao deletar a aeronave" });
  }
});

app.put("/aeronaveEdit", async (req, res) => {
  try {
    const { codigo, modelo, tipo, capacidade, autonomia } = req.body;

    if (!codigo) {
      return res
        .status(400)
        .json({ error: "Código da aeronave é obrigatório." });
    }

    const aeronaveAtualizada = await prisma.aeronave.update({
      where: { codigo: Number(codigo) },
      data: {
        modelo,
        tipo,
        capacidade,
        autonomia,
      },
    });

    return res.status(200).json(aeronaveAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar aeronave:", error);
    return res.status(500).json({ error: "Erro ao atualizar aeronave." });
  }
});

app.get("/aeronavesList", async (req, res) => {
  const aeronaves = await prisma.aeronave.findMany();
  return res.json(aeronaves);
});

app.post("/peca", async (req, res) => {
  try {
    const { id, nome, tipo, fornecedor, status, aeronaveId } = req.body;

    if (!nome || !tipo || !aeronaveId) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    const peca = await prisma.peca.create({
      data: {
        id,
        nome,
        tipo,
        fornecedor,
        status: status,
        aeronaveId,
      },
    });

    return res.status(201).json(peca);
  } catch (error) {
    console.error("Erro ao criar peça:", error);
    return res.status(500).json({ error: "Erro ao criar peça." });
  }
});

app.post("/pecaDelete", async (req, res) => {
  try {
    const { id } = req.body;

    const peça = await prisma.peca.delete({
      where: { id: id },
    });

    return res.status(200).json(peça);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro ao deletar a aeronave" });
  }
});

app.put("/pecaEdit", async (req, res) => {
  try {
    const { id, nome, fornecedor, status, aeronaveId } = req.body;

    const peçaAtualizada = await prisma.peca.update({
      where: { id: Number(id) },
      data: {
        nome,
        fornecedor,
        status,
        aeronaveId,
      },
    });

    return res.status(200).json(peçaAtualizada);
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
});


app.get("/pecasList", async (req, res) => {
    const peças = await prisma.peca.findMany()
    return res.json(peças)
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

process.on("beforeExit", async () => {
  console.log("Fechando conexão com o Prisma...");
  await prisma.$disconnect();
});
