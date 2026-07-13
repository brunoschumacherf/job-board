# Job Board

Kanban pessoal para acompanhar candidaturas, com sincronização em tempo real via Firebase Firestore.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS
- Firebase Firestore
- React Hook Form + Zod
- dnd-kit
- Recharts
- React Router DOM
- Lucide React
- date-fns
- Sonner (toasts)
- ESLint (oxlint) + Prettier

## Setup

1. Copie `.env.example` para `.env` e preencha as credenciais do Firebase:

```bash
cp .env.example .env
```

2. Instale as dependências e inicie o servidor:

```bash
npm install
npm run dev
```

3. No Firebase Console, crie a collection `jobs` (será criada automaticamente no primeiro `addDoc`) e habilite as regras de leitura/escrita adequadas no Firestore.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Ambiente de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | Lint com oxlint |
| `npm run format` | Formatar com Prettier |

## Funcionalidades

- Board Kanban com 8 etapas do processo seletivo
- Drag and drop com persistência automática
- CRUD de vagas com modal e formulário validado
- Pesquisa instantânea, filtros e ordenação
- Estatísticas + gráfico de distribuição
- Tema claro/escuro com persistência
- Atalho `Ctrl/Cmd + N` para nova vaga
- Importação/exportação JSON
- Campos extras: tags, salário, localização, prioridade, feedback, observações
- Estrutura pronta para Firebase Authentication (`AuthContext` + `auth` export)

## Estrutura

```
src/
  components/   # Board, Column, JobCard, JobForm, Stats, etc.
  pages/        # Dashboard
  hooks/        # useJobs, useKeyboardShortcut
  services/     # firebase.ts, jobs.ts
  contexts/     # Theme, Auth
  types/        # Job
  utils/        # helpers, schemas, constants
```
# job-board
