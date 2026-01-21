# Tech Challenger 2 - API de Posts - Documentação

API RESTful para gerenciamento de posts, desenvolvida com Node.js, TypeScript, Express e PostgreSQL.

## Tecnologias

- Node.js 20
- TypeScript
- Express
- PostgreSQL
- Jest (testes)
- Docker

## Estrutura do Projeto

```
src/
├── config/
│   └── database.ts        # Configuracao do PostgreSQL
├── posts/
│   ├── dto/               # Data Transfer Objects
│   ├── interfaces/        # Interfaces (IPost, IPostRepository)
│   ├── mappers/           # Mapeamento entidade -> DTO
│   ├── post.controller.ts # Controller HTTP
│   ├── post.service.ts    # Logica de negocio
│   └── post.repository.ts # Acesso ao banco
├── utils/
│   ├── AppError.ts        # Classe de erro + middleware
│   └── ErrorEnum.ts       # Enums de erro
└── main.ts                # Entrada da aplicacao
```

## Instalacao

```bash
npm install
```

## Configuracao

Arquivos de ambiente:
- `.env.development` - Desenvolvimento local
- `.env.production` - Producao

Variaveis:
```
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=posts_dev
```

## Comandos

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Sobe PostgreSQL + inicia servidor |
| `npm run prod` | Build + deploy com Docker |
| `npm run build` | Compila TypeScript |
| `npm test` | Roda testes |
| `npm run test:coverage` | Testes com coverage |

## Endpoints

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/posts` | Lista todos os posts |
| GET | `/posts/:id` | Busca post por ID |
| GET | `/posts/search?q=termo` | Busca por termo |
| POST | `/posts` | Cria novo post |
| PUT | `/posts/:id` | Atualiza post |
| DELETE | `/posts/:id` | Deleta post |

### Exemplo de Request (POST /posts)

```json
{
  "title": "Meu post",
  "content": "Conteudo do post com pelo menos 10 caracteres",
  "author": "Joao Silva"
}
```

### Exemplo de Response

```json
{
  "success": true,
  "message": "Post criado com sucesso",
  "data": {
    "id": "uuid",
    "title": "Meu post",
    "content": "Conteudo do post com pelo menos 10 caracteres",
    "author": "Joao Silva",
    "createdAt": "2026-01-17T18:00:00.000Z",
    "updatedAt": "2026-01-17T18:00:00.000Z"
  }
}
```

## Docker

**Desenvolvimento:**
```bash
docker compose -f docker-compose.dev.yml up -d
```

**Producao:**
```bash
docker compose up -d --build
```

## Testes

```bash
npm test              # Rodar testes
npm run test:coverage # Com coverage
```

## CI/CD

GitHub Actions configurado para:
- Rodar testes em push/PR para main
- Build do projeto

## Postman

Importe o arquivo `tech-challenger2.postman_collection.json` no Postman para testar os endpoints.
