# Arquitetura — Portal de Acesso Central

## Diagrama de Camadas

```
┌─────────────────────────────────────────┐
│           Frontend (React SPA)          │
│  porta 8080 — Vite + React 19 + TS     │
└────────────────┬────────────────────────┘
                 │ HTTP (JSON)
                 │ Authorization: Bearer <JWT>
┌────────────────▼────────────────────────┐
│           Backend (Express API)         │
│  porta 3333 — Express + TypeScript      │
│                                         │
│  ┌──────────┐  ┌──────────────────────┐ │
│  │ Middleware│  │       Rotas          │ │
│  │ ────────  │  │ /api/auth            │ │
│  │ helmet    │  │ /api/platforms       │ │
│  │ cors      │  │ /api/logs            │ │
│  │ auth (JWT)│  │ /api/branding        │ │
│  │ error     │  │ /api/settings        │ │
│  └──────────┘  └──────────────────────┘ │
└────────────────┬────────────────────────┘
                 │ Prisma ORM
┌────────────────▼────────────────────────┐
│           Banco de Dados                │
│  SQLite — prisma/dev.db                 │
│                                         │
│  Modelos:                               │
│  ├── User (auth, roles)                 │
│  ├── Platform (plataformas do portal)   │
│  ├── AccessLog (registro de acessos)    │
│  ├── BrandingConfig (marca/tema)        │
│  └── AppSettings (preferências)         │
└─────────────────────────────────────────┘
```

## Fluxo de Autenticação

```
1. POST /api/auth/login { email, password }
2. Backend: bcrypt.compare → JWT sign
3. Resposta: { token, user }
4. Frontend: salva token no localStorage
5. Requisições: header Authorization: Bearer <token>
6. Middleware: jwt.verify → req.user
```

## Estrutura de Pastas

```
backend/
├── prisma/
│   ├── schema.prisma       # Modelos e relações
│   ├── seed.ts             # Dados iniciais
│   └── dev.db              # Banco SQLite (gitignored)
├── src/
│   ├── index.ts            # Entrada — Express app + middlewares
│   ├── lib/
│   │   ├── prisma.ts       # Singleton do Prisma Client
│   │   └── validate-ip.ts  # Extração e validação de IP do cliente
│   ├── middleware/
│   │   ├── auth.ts         # authenticate() + requireAdmin()
│   │   ├── error.ts        # errorHandler() global
│   │   └── logger.ts       # requestLogger() — request ID + timing
│   └── routes/
│       ├── auth.ts         # Login, register, me, update perfil
│       ├── platforms.ts    # CRUD + registro de acesso
│       ├── logs.ts         # Listagem paginada + limpeza
│       ├── branding.ts     # Config de marca (público leitura)
│       └── settings.ts     # Preferências do app
├── package.json
├── tsconfig.json
└── .env                    # Variáveis de ambiente (gitignored)
```

## Decisões Técnicas

| Decisão | Motivo |
|---------|--------|
| SQLite | Sem dependência externa, ideal para dev/MVP |
| Prisma | Type-safe queries, migrations, studio |
| JWT (stateless) | Simplicidade, sem session store |
| Zod | Validação em runtime com inferência de tipos |
| Filtragem em memória | SQLite não suporta `mode: 'insensitive'` no Prisma |
| bcryptjs (não bcrypt) | Pure JS, sem dependência nativa de compilação |
| Helmet | Headers de segurança automáticos |

## Modelo de Permissões

| Role | Leitura | Escrita | Exclusão | Admin |
|------|---------|---------|----------|-------|
| USER | Plataformas, logs próprios, settings | Registro de acesso, perfil | — | — |
| ADMIN | Tudo | Tudo | Plataformas, logs | Branding, CRUD plataformas |
