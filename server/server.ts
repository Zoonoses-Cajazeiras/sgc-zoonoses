import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Interface da Campanha
interface Campaign {
  id: string;
  title: string;
  description: string;
}

// Interface dos Dados de Impacto (Stats)
interface Stats {
  vaccinated: number;
  castrations: number;
  tests: number;
  sheltered: number;
  citizens: number;
}

// BANCO DE DADOS EM MEMÓRIA (Ideal para a apresentação/teste)
let campaigns: Campaign[] = [
  {
    id: '1',
    title: 'Campanha Antirrábica 2026',
    description: 'Vacinação gratuita para cães e gatos.'
  },
  {
    id: '2',
    title: 'Controle de Leishmaniose',
    description: 'Testagem e monitoramento epidemiológico.'
  }
];

let stats: Stats = {
  vaccinated: 4280,
  castrations: 1130,
  tests: 870,
  sheltered: 340,
  citizens: 2600
};

// ------------------- ROTAS DAS CAMPANHAS -------------------

// Listar Campanhas (Usado pela Home)
app.get('/api/campaigns', (req, res) => {
  res.json(campaigns);
});

// Criar Campanha (Usado pelo Admin)
app.post('/api/campaigns', (req, res) => {
  const { title, description } = req.body;
  const newCampaign: Campaign = {
    id: Date.now().toString(),
    title,
    description
  };
  campaigns.push(newCampaign);
  res.status(201).json(newCampaign);
});

// Deletar Campanha (Usado pelo Admin)
app.delete('/api/campaigns/:id', (req, res) => {
  const { id } = req.params;
  campaigns = campaigns.filter(c => c.id !== id);
  res.status(200).json({ message: 'Campanha removida com sucesso' });
});

// ------------------- ROTAS DE ESTATÍSTICAS (STATS) -------------------

// Buscar Stats
app.get('/api/stats', (req, res) => {
  res.json(stats);
});

// Atualizar Stats (Usado pelo Admin)
app.put('/api/stats', (req, res) => {
  stats = { ...stats, ...req.body };
  res.json(stats);
});

// ------------------- ROTA DE LOGIN DO ADMIN -------------------
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Login simples mockado para a entrega
  if (username === 'admin' && password === 'admin123') {
    return res.json({ success: true, token: 'fake-jwt-token-12345' });
  }
  
  return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
});

// Inicialização do servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});