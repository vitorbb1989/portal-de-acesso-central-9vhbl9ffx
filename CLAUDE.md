# CLAUDE.md — Instruções para o projeto Portal de Acesso Central

## Visão Geral
Portal web para acesso centralizado a plataformas internas de uma organização.
- **Frontend:** React 19 + Vite + TypeScript + Shadcn UI + Tailwind CSS (porta 8080)
- **Backend:** Express + TypeScript + Prisma + SQLite (porta 3333)

## Comandos Essenciais

### Frontend
```bash
npm start          # Dev server (porta 8080)
npm run build      # Build de produção
npm run lint       # Oxlint
npm run format     # Oxfmt
```

### Backend
```bash
cd backend
npm run dev        # Dev server com hot reload (porta 3333)
npm run build      # Compila TypeScript
npx prisma db push # Aplica schema ao banco
npm run db:seed    # Popula banco com dados mock
npx tsc --noEmit   # Verificação de tipos
```

## Convenções de Código

### TypeScript
- Strict mode habilitado no backend
- Validação de entrada com Zod em todas as rotas
- Tipos explícitos para request/response

### Backend
- Rotas em `backend/src/routes/` — um arquivo por domínio
- Middlewares em `backend/src/middleware/`
- Prisma client singleton em `backend/src/lib/prisma.ts`
- Erros tratados pelo error handler global — rotas usam `next(err)`
- Autenticação via JWT no header `Authorization: Bearer <token>`
- Roles: `ADMIN` (CRUD completo) e `USER` (leitura + registro de acesso)

### Frontend
- Páginas em `src/pages/`
- Componentes reutilizáveis em `src/components/`
- Estado global em `src/stores/main.ts`
- Path alias: `@/*` → `./src/*`

## Credenciais Seed (desenvolvimento)
- **Admin:** admin@portal.com / Admin123
- **User:** ana.silva@portal.com / User1234

## Regras Importantes
- **Nunca** commitar `.env` com secrets reais
- **Nunca** expor stack traces em respostas de produção
- **Sempre** validar entrada com Zod antes de acessar o banco
- **Sempre** usar `next(err)` para propagar erros nas rotas
- SQLite não suporta `mode: 'insensitive'` — usar filtragem em memória
- Rotas de escrita (POST/PATCH/DELETE) em platforms requerem role ADMIN
- GET /api/branding é público (necessário para renderizar o app)
