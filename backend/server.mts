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
  const peças = await prisma.peca.findMany();
  return res.json(peças);
});

app.post("/funcionario", async (req, res) => {
  try {
    const { nome, cpf, cargo, login, senha, endereco, telefone } = req.body;

    if (!nome || !cpf || !cargo || !login || !senha || !endereco || !telefone) {
      return res.status(400).json({
        error:
          "Todos os campos (incluindo Endereço e Telefone) são obrigatórios.",
      });
    }

    const [novoEndereco, novoTelefone, novoFuncionario] =
      await prisma.$transaction([
        prisma.endereco.create({
          data: {
            rua: endereco.rua,
            numero: endereco.numero,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
          },
        }),

        prisma.telefone.create({
          data: {
            ddd: telefone.ddd,
            numero: telefone.numero,
          },
        }),

        prisma.funcionario.create({
          data: { nome, cpf, cargo, login, senha },
        }),
      ]);

    const funcionarioCompleto = await prisma.funcionario.update({
      where: { id: novoFuncionario.id },
      data: {
        endereco: { connect: { id: novoEndereco.id } },
        telefone: { connect: { id: novoTelefone.id } },
      },
      include: {
        endereco: true,
        telefone: true,
      },
    });

    return res.status(201).json(funcionarioCompleto);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erro ao criar funcionário", detalhe: error });
  }
});

app.put("/funcionarioEdit", async (req, res) => {
  try {
    const { id, nome, cpf, cargo, login, senha } = req.body;

    const funcionarioAtualizado = await prisma.funcionario.update({
      where: { id: Number(id) },
      data: {
        nome,
        cpf,
        cargo,
        login,
        senha,
      },
    });

    return res.status(200).json(funcionarioAtualizado);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Erro ao atualizar funcionário", detalhe: error });
  }
});

app.get("/funcionario/:id", async (req, res) => {
  try {
    const funcionario = await prisma.funcionario.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        endereco: true,
        telefone: true,
      },
    });

    if (!funcionario) {
      return res.status(404).json({ error: "Funcionário não encontrado" });
    }

    return res.json(funcionario);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar funcionário" });
  }
});

app.delete("/funcionario/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [enderecoResult, telefoneResult, funcionarioResult] =
      await prisma.$transaction([
        prisma.endereco.deleteMany({
          where: { funcionarioId: id },
        }),

        prisma.telefone.deleteMany({
          where: { funcionarioId: id },
        }),

        prisma.funcionario.delete({
          where: { id },
        }),
      ]);

    return res.status(200).json({
      message: "Funcionário e dados relacionados excluídos com sucesso.",
      funcionario: funcionarioResult,
      enderecosDeletados: enderecoResult.count,
      telefonesDeletados: telefoneResult.count,
    });
  } catch (error) {
    return res.status(404).json({ error: "Funcionário não encontrado." });
  }
});

app.get("/funcionariosList", async (req, res) => {
  const funcionarios = await prisma.funcionario.findMany();
  return res.json(funcionarios);
});

app.post("/teste", async (req, res) => {
  try {
    const { aeronaveId, tipo, resultado, data } = req.body;
    const aeronaveIdNum = Number(aeronaveId);

    // 1. Validação
    if (!aeronaveIdNum || !tipo || !resultado) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    // 2. Tenta encontrar um teste existente para esta aeronave e tipo
    const testeExistente = await prisma.teste.findFirst({
      where: {
        aeronaveId: aeronaveIdNum,
        tipo: tipo, // Usa o enum TipoTeste
      },
      // Garante que pega o mais recente, caso haja mais de um (se você mantiver a tabela sem @@unique)
      orderBy: {
        data: "desc",
      },
    });

    // 3. Lógica Condicional (Aprovado, Reprovado, Inexistente)

    if (testeExistente) {
      // 3a. CASO 1: Teste JÁ EXISTE e está APROVADO
      if (testeExistente.resultado === "Aprovado") {
        return res.status(403).json({
          error: `O teste de ${tipo} para a aeronave ${aeronaveId} já foi APROVADO e não pode ser alterado.`,
        });
      }

      // 3b. CASO 2: Teste JÁ EXISTE e está REPROVADO -> Permite a atualização (PUT)
      if (testeExistente.resultado === "Reprovado") {
        const testeAtualizado = await prisma.teste.update({
          where: {
            id: testeExistente.id, // Usa o ID do registro que será atualizado
          },
          data: {
            resultado: resultado,
            data: new Date(), // Atualiza a data/hora para o momento da correção
          },
        });

        return res.status(200).json({
          message: `Resultado de teste ${tipo} atualizado com sucesso.`,
          teste: testeAtualizado,
        });
      }

      // Nota: Se houver outros status no futuro, eles cairiam aqui.
    } else {
      // 3c. CASO 3: Teste NÃO EXISTE -> Cria um novo registro (POST)
      const novoTeste = await prisma.teste.create({
        data: {
          aeronaveId: aeronaveIdNum,
          tipo: tipo,
          resultado: resultado,
          data: data ? new Date(data) : new Date(),
        },
      });

      return res.status(201).json({
        message: `Novo teste ${tipo} registrado com sucesso.`,
        teste: novoTeste,
      });
    }
  } catch (error) {
    console.error("Erro no processamento do teste:", error);

    if (error === "P2003") {
      return res
        .status(404)
        .json({
          error: "Aeronave não encontrada. Verifique o código da aeronave.",
        });
    }

    return res
      .status(500)
      .json({ error: "Erro interno do servidor.", detalhe: error });
  }
});

app.get("/testes/:aeronaveId", async (req, res) => {
  try {
    const aeronaveId = parseInt(req.params.aeronaveId);

    // 1. Validação do ID
    if (isNaN(aeronaveId)) {
      return res
        .status(400)
        .json({ error: "O ID da aeronave deve ser um número válido." });
    }

    // 2. Busca no banco de dados usando Prisma
    // Utilizamos findMany para retornar todos os registros que atendem à condição.
    const historicoTestes = await prisma.teste.findMany({
      where: {
        aeronaveId: aeronaveId,
      },
      // Ordenamos pelo campo 'data' em ordem decrescente (mais recente primeiro)
      orderBy: {
        data: "desc",
      },
    });

    // 3. Resposta de sucesso (retorna array vazio se não houver registros)
    // O frontend já está preparado para lidar com um array vazio (testesHistorico.length === 0)
    return res.status(200).json(historicoTestes);
  } catch (error) {
    console.error("Erro ao buscar histórico de testes:", error);
    // Em caso de erro, retorna 500
    return res
      .status(500)
      .json({
        error: "Erro interno do servidor ao buscar histórico de testes.",
      });
  }
});

app.post("/etapa", async (req, res) => {
  try {
    const { nome, dataPrevista, aeronaveId, funcionarioIds } = req.body;

    if (
      !nome ||
      !dataPrevista ||
      !aeronaveId ||
      !Array.isArray(funcionarioIds)
    ) {
      return res
        .status(400)
        .json({
          error:
            "Campos obrigatórios faltando (nome, dataPrevista, aeronaveId e lista de IDs de funcionários).",
        });
    }

    // Converte IDs de funcionários para o formato de conexão many-to-many
    const funcionariosConnect = funcionarioIds.map((id) => ({
      funcionarioId: Number(id),
    }));

    const novaEtapa = await prisma.etapa.create({
      data: {
        nome,
        dataPrevista: new Date(dataPrevista),
        status: "Pendente", // Enum StatusProducao.Pendente
        aeronaveId: Number(aeronaveId),
        funcionarios: {
          create: funcionariosConnect,
        },
      },
      include: {
        funcionarios: true,
      },
    });

    return res.status(201).json(novaEtapa);
  } catch (error) {
    console.error("Erro ao criar etapa:", error);
    return res
      .status(500)
      .json({ error: "Erro ao criar etapa.", detalhe: error });
  }
});

app.get("/etapasList", async (req, res) => {
  try {
    const etapas = await prisma.etapa.findMany({
      include: {
        // Inclui a relação com funcionários para exibição/edição
        funcionarios: {
          include: {
            funcionario: {
              select: { nome: true, id: true },
            },
          },
        },
      },
      orderBy: { id: "asc" },
    });
    return res.json(etapas);
  } catch (error) {
    console.error("Erro ao listar etapas:", error);
    return res.status(500).json({ error: "Erro ao listar etapas." });
  }
});

app.put("/etapaEdit", async (req, res) => {
  try {
    const { id, nome, dataPrevista, status, aeronaveId, funcionarioIds } =
      req.body;
    const etapaId = Number(id);

    if (!etapaId) {
      return res.status(400).json({ error: "ID da etapa é obrigatório." });
    }

    const etapaExistente = await prisma.etapa.findUnique({
      where: { id: etapaId },
    });

    if (!etapaExistente) {
      return res.status(404).json({ error: "Etapa não encontrada." });
    }

    // Lógica de Status: Se já estiver Concluído, não permite reabrir (alterar para outro status)
    if (etapaExistente.status === "Concluido" && status !== "Concluido") {
      return res
        .status(403)
        .json({
          error:
            "Etapa já concluída não pode ter o status alterado (reaberta).",
        });
    }

    // 1. Prepara dados para atualização (apenas campos escalares)
    const dataToUpdate = {
      nome: nome,
      dataPrevista: new Date(dataPrevista),
      status: status,
      aeronaveId: Number(aeronaveId), // Inclui explicitamente, se necessário
    };

    // 2. Atualiza a Etapa e suas Associações (Transação)
    const etapaAtualizada = await prisma.$transaction(async (prisma) => {
      // Se IDs de funcionários foram passados, manipula associações
      if (funcionarioIds && Array.isArray(funcionarioIds)) {
        // Remove todos os funcionários atuais da EtapaFuncionario
        await prisma.etapaFuncionario.deleteMany({
          where: { etapaId: etapaId },
        });

        // Cria novas associações
        if (funcionarioIds.length > 0) {
          const connectFuncs = funcionarioIds.map((id) => ({
            etapaId: etapaId,
            funcionarioId: Number(id),
          }));
          await prisma.etapaFuncionario.createMany({
            data: connectFuncs,
          });
        }
      }

      // Atualiza os dados escalares da Etapa
      return prisma.etapa.update({
        where: { id: etapaId },
        data: dataToUpdate,
      });
    });

    // Retorna a etapa completa com os nomes dos funcionários após a transação
    const etapaCompleta = await prisma.etapa.findUnique({
      where: { id: etapaId },
      include: {
        funcionarios: {
          include: {
            funcionario: {
              select: { nome: true, id: true },
            },
          },
        },
      },
    });

    return res.status(200).json(etapaCompleta);
  } catch (error) {
    console.error("Erro ao atualizar etapa:", error);
    return res
      .status(500)
      .json({ error: "Erro ao atualizar etapa.", detalhe: error });
  }
});

app.delete("/etapaDelete/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID da etapa inválido." });
    }

    // Transação para deletar associações e a etapa principal
    await prisma.$transaction([
      // 1. Deleta as associações EtapaFuncionario
      prisma.etapaFuncionario.deleteMany({
        where: { etapaId: id },
      }),
      // 2. Deleta a Etapa
      prisma.etapa.delete({
        where: { id },
      }),
    ]);

    return res
      .status(200)
      .json({ message: "Etapa e associações excluídas com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar etapa:", error);
    return res.status(404).json({ error: "Etapa não encontrada." });
  }
});

app.get("/funcionariosListAll", async (req, res) => {
  try {
    const funcionarios = await prisma.funcionario.findMany({
      select: {
        id: true,
        nome: true,
        cargo: true, // Útil para contexto
      },
    });
    return res.json(funcionarios);
  } catch (error) {
    console.error("Erro ao listar funcionários:", error);
    return res.status(500).json({ error: "Erro ao listar funcionários." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

process.on("beforeExit", async () => {
  console.log("Fechando conexão com o Prisma...");
  await prisma.$disconnect();
});
