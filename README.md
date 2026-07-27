# 🐾 SGC - Sistema de Gestão de Zoonoses (Cajazeiras)

Sistema web desenvolvido para o Núcleo de Zoonoses, permitindo que a população visualize campanhas e estatísticas, e que administradores autorizados gerenciem as informações em tempo real.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React (TypeScript), Vite, Tailwind CSS, React Router DOM, React Icons.
- **Backend:** Node.js, Express, TypeScript, CORS.
- **Banco de Dados:** SQLite e Prisma ORM (Persistência local).

---

## 🚀 Como Rodar o Projeto

### 1. Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

### 2. Instalação de Dependências
Na raiz do projeto, abra o terminal e rode:
```bash
npm install
```

### 3. Configurar o Banco de Dados (Prisma)
Para gerar o cliente do Prisma e sincronizar as tabelas do SQLite local (`dev.db`), rode:
```bash
npx prisma generate
npx prisma db push
```

---

## 💻 Executando o Projeto

O projeto roda em duas instâncias simultâneas (Backend e Frontend):

### Passo 1: Iniciar o Servidor (Backend API)
Em uma guia do terminal, execute:
```bash
npm run server
```
> O backend rodará na porta `http://localhost:3001`.

### Passo 2: Iniciar a Aplicação Web (Frontend React)
Em outra guia do terminal, execute:
```bash
npm run dev
```
> A aplicação abrirá no endereço `http://localhost:5173`.

---

## 🔐 Acesso à Área do Administrador

- **URL de Login:** `http://localhost:5173/login`
- **Usuário:** `admin` (ou `admin@zoonoses.com`)
- **Senha:** `admin123`

---

## 📊 Visualizando o Banco de Dados (Prisma Studio)

Para inspecionar ou editar os dados das tabelas de forma gráfica, execute:
```bash
npx prisma studio
```
> O painel abrirá automaticamente em `http://localhost:5555`.
