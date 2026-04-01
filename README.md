# Projeto Criado com o Skip

Este projeto foi criado de ponta a ponta com o [Skip](https://goskip.dev).

## 🚀 Stack Tecnológica

- **React 19** - Biblioteca JavaScript para construção de interfaces
- **Vite** - Build tool extremamente rápida
- **TypeScript** - Superset tipado do JavaScript
- **Shadcn UI** - Componentes reutilizáveis e acessíveis
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Roteamento para aplicações React
- **React Hook Form** - Gerenciamento de formulários performático
- **Zod** - Validação de schemas TypeScript-first
- **Recharts** - Biblioteca de gráficos para React

## 📋 Pré-requisitos

- Node.js 18+
- npm

## 🔧 Instalação

```bash
npm install
```

## 💻 Scripts Disponíveis

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm start
# ou
npm run dev
```

Abre a aplicação em modo de desenvolvimento em [http://localhost:5173](http://localhost:5173).

### Build

```bash
# Build para produção
npm run build

# Build para desenvolvimento
npm run build:dev
```

Gera os arquivos otimizados para produção na pasta `dist/`.

### Preview

```bash
# Visualizar build de produção localmente
npm run preview
```

Permite visualizar a build de produção localmente antes do deploy.

### Linting e Formatação

```bash
# Executar linter
npm run lint

# Executar linter e corrigir problemas automaticamente
npm run lint:fix

# Formatar código com Oxfmt
npm run format
```

## 📁 Estrutura do Projeto

```
.
├── src/              # Código fonte da aplicação
├── public/           # Arquivos estáticos
├── dist/             # Build de produção (gerado)
├── node_modules/     # Dependências (gerado)
└── package.json      # Configurações e dependências do projeto
```

## 🎨 Componentes UI

Este template inclui uma biblioteca completa de componentes Shadcn UI baseados em Radix UI:

- Accordion
- Alert Dialog
- Avatar
- Button
- Checkbox
- Dialog
- Dropdown Menu
- Form
- Input
- Label
- Select
- Switch
- Tabs
- Toast
- Tooltip
- E muito mais...

## 📝 Ferramentas de Qualidade de Código

- **TypeScript**: Tipagem estática
- **Oxlint**: Linter extremamente rápido
- **Oxfmt**: Formatação automática de código

## 🔄 Workflow de Desenvolvimento

1. Instale as dependências: `npm install`
2. Inicie o servidor de desenvolvimento: `npm start`
3. Faça suas alterações
4. Verifique o código: `npm run lint`
5. Formate o código: `npm run format`
6. Crie a build: `npm run build`
7. Visualize a build: `npm run preview`

## 📦 Build e Deploy

Para criar uma build otimizada para produção:

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/` e estarão prontos para deploy.

## 🌐 Deploy com Traefik

Este repositório agora inclui um `compose.yml` pronto para publicar a aplicação atrás de um Traefik já existente, usando o domínio `console.antrop-ia.com`.

### O que é publicado

- Frontend React em `/`
- Backend Express em `/api`
- Health check do backend em `/health`

### Pré-requisitos

- Docker e Docker Compose instalados
- Um Traefik já rodando no host
- Uma rede Docker externa já criada para o Traefik
- DNS de `console.antrop-ia.com` apontando para o servidor

### Configuração

1. Copie o arquivo de exemplo:

```bash
cp deploy/traefik.env.example deploy/traefik.env
```

2. Ajuste os valores em `deploy/traefik.env`:

- `TRAEFIK_HOST=console.antrop-ia.com`
- `TRAEFIK_NETWORK=traefik`
- `TRAEFIK_ENTRYPOINTS=websecure`
- `TRAEFIK_CERTRESOLVER=letsencrypt`
- `JWT_SECRET` com um valor forte
- `SEED_ON_START=true` no primeiro boot se quiser criar os usuários e plataformas iniciais

### Subida

```bash
docker compose --env-file deploy/traefik.env up -d --build
```

### Observações

- O backend usa `TRUST_PROXY=1` no deploy para funcionar corretamente atrás do Traefik.
- O banco SQLite fica persistido no volume Docker `portal_console_data`.
- Com `SEED_ON_START=true`, o backend cria o admin `admin@portal.com / Admin123` e os dados iniciais uma única vez por volume.
- Se o nome da rede ou do `certresolver` do seu Traefik for diferente, basta ajustar no arquivo `deploy/traefik.env`.
