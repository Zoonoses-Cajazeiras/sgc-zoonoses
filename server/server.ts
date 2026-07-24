import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ------------------- ROTAS DAS CAMPANHAS -------------------

// 1. Listar Campanhas (Do Banco SQLite)
app.get('/api/campaigns', async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar campanhas do banco' });
  }
});

// 2. Criar Campanha (Salva no Banco SQLite)
app.post('/api/campaigns', async (req, res) => {
  const { title, description, status, schedule, location, buttonText } = req.body;
  
  try {
    const newCampaign = await prisma.campaign.create({
      data: {
        title,
        description,
        status: status || "Em andamento",
        schedule: schedule || "Todo sábado - 08h às 12h",
        location: location || "Ponto de vacinação do seu bairro",
        buttonText: buttonText || null,
      },
    });
    res.status(201).json(newCampaign);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar campanha no banco' });
  }
});

// 3. Deletar Campanha (Apaga do Banco SQLite)
app.delete('/api/campaigns/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await prisma.campaign.delete({
      where: { id },
    });
    res.status(200).json({ message: 'Campanha removida do banco com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar campanha' });
  }
});

// ------------------- ROTAS DE ESTATÍSTICAS (STATS) -------------------

// 4. Buscar Stats (Do Banco SQLite)
app.get('/api/stats', async (req, res) => {
  try {
    let stats = await prisma.impactStats.findUnique({
      where: { id: 1 },
    });

    // Se ainda não existir o registro inicial, cria automaticamente
    if (!stats) {
      stats = await prisma.impactStats.create({
        data: {
          id: 1,
          vaccinated: 4280,
          castrations: 1130,
          tests: 870,
          sheltered: 340,
          citizens: 2600,
        },
      });
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// 5. Atualizar Stats (Salva no Banco SQLite)
app.put('/api/stats', async (req, res) => {
  const { vaccinated, castrations, tests, sheltered, citizens } = req.body;

  try {
    const updatedStats = await prisma.impactStats.upsert({
      where: { id: 1 },
      update: { vaccinated, castrations, tests, sheltered, citizens },
      create: { id: 1, vaccinated, castrations, tests, sheltered, citizens },
    });
    res.json(updatedStats);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar estatísticas' });
  }
});

// ------------------- ROTA DE LOGIN DO ADMIN -------------------
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if ((username === 'admin' || username === 'admin@zoonoses.com') && password === 'admin123') {
    return res.json({ success: true, token: 'token-admin-db-12345' });
  }

  return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
});

// Inicialização do servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor e Banco SQLite rodando em http://localhost:${PORT}`);
});