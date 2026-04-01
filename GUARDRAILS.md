# Guardrails — Regras de Segurança e Qualidade

## Segurança

### Autenticação
- JWT com secret forte (mín 32 chars em produção)
- Tokens expiram em 7 dias (configurável via JWT_EXPIRES_IN)
- Rate limiting obrigatório em rotas de auth
- Senha: mínimo 8 caracteres, 1 maiúscula, 1 número
- Troca de senha exige confirmação da senha atual

### Autorização
- Rotas de escrita em platforms: somente ADMIN
- Logs: USER vê apenas os próprios; ADMIN vê todos
- Branding leitura: público (necessário para SSR/preload)
- Branding escrita: somente ADMIN

### Dados
- Validação de entrada com Zod em TODAS as rotas
- Nunca confiar em headers que podem ser spoofados (x-forwarded-for) sem validação
- URLs armazenadas devem ser validadas (rejeitar javascript:, data:)
- Soft delete preferido sobre hard delete
- Nunca permitir deleção em massa sem filtro obrigatório

### Respostas
- Nunca expor stack traces em produção
- Erros retornam mensagens genéricas para o client
- Logs internos mantêm detalhes completos
- Senhas nunca retornadas nas respostas da API

## Qualidade de Código

### TypeScript
- `strict: true` no backend
- Sem `any` explícito — usar tipos específicos
- Validação Zod para todo input externo

### Banco de Dados
- Índices em campos de filtro/join frequentes
- Campos de auditoria (createdBy, updatedBy) em entidades editáveis
- Soft delete (deletedAt) em entidades que podem ser restauradas
- Seed idempotente e atômico (dentro de transaction)

### API
- Paginação obrigatória em listagens
- Responses consistentes: `{ data, pagination }` para listas
- Códigos HTTP semânticos (201 create, 204 delete, 409 conflict)
- Error handler global como último middleware

## Limitações Aceitas (MVP)
- **JWT de user soft-deleted:** token continua válido até expirar (7d). Rotas /me já verificam deletedAt e retornam 404. Rotas como GET /platforms usam o JWT sem re-verificar no banco (performance). Para revogar acesso imediato, implementar token blacklist em versão futura.
- **Settings/Branding globais:** não são per-user. Todos os usuários compartilham as mesmas configurações.
- **Filtragem em memória:** SQLite não suporta `mode: 'insensitive'` no Prisma. Buscas com search param carregam todos os registros na memória. Aceitável enquanto volume de dados for baixo (<10k registros).

## O que NÃO fazer
- Commitar .env com secrets reais
- Usar `mode: 'insensitive'` com SQLite (não suportado)
- Deletar registros sem filtro (DELETE sem where)
- Permitir troca de senha sem confirmação da atual
- Retornar campos sensíveis (password) na API
- Ignorar validação de tipos em runtime
- Aceitar URLs com schemes perigosos (javascript:, data:, vbscript:) em qualquer campo de URL
