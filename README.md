# Rio-AI – Portal da Família de Modelos de IA

Portal institucional da Prefeitura do Rio de Janeiro, desenvolvido pela **IPLANRIO**, para apresentar a nova geração de modelos **Rio Open**. O projeto destaca o compromisso da cidade com a transparência tecnológica, o fomento ao ecossistema Open Source e a aplicação prática de IA no setor público.

---

## 🌟 Visão Geral

- **Stack Moderna**: Baseado em **React 19** e **TypeScript**, orquestrado pelo **Vite 6** para uma experiência de desenvolvimento e performance de ponta.
- **Navegação Fluida**: SPA (Single Page Application) com controle de estado nativo, garantindo transições instantâneas entre o playground de chat e o catálogo de modelos.
- **Ecossistema de Modelos**: Catálogo enxuto com foco nos modelos Open Source da família Rio.
- **Inovação Técnica**: Destaque para técnicas de raciocínio latente e otimizações de desempenho presentes nos modelos open source.

---

## 🧬 Modelos Open Source

Catálogo focado nos modelos abertos que serão lançados:

| Modelo | Foco | Base Tecnológica |
| :--- | :--- | :--- |
| **Rio 3.0 Open** | Modelo principal | Qwen3-235B-Thinking |
| **Rio 3.0 Open Mini** | Eficiência | Qwen3-4B-Thinking |
| **Rio 3.0 Open Nano** | Ultraeficiência e baixa latência | — |
| **Rio 2.5 Open** | Equilíbrio custo/qualidade | Qwen3-30B-Thinking |
| **Rio 2.5 Open VL** | Multimodal (visão e linguagem) | — |

### 🔓 Iniciativa Open Source

O Rio-AI é um dos maiores contribuidores públicos para a comunidade de IA no Brasil. Modelos como o **Rio 2.5 Open** são disponibilizados sob a licença **CC BY 4.0**, permitindo uso comercial e acadêmico.

- **Diferencial Técnico**: O Rio 2.5 Open utiliza a arquitetura **SwiReasoning**, permitindo alternar entre o modo de resposta rápida e o modo de raciocínio profundo (pensamento latente), alcançando scores de até **95.0 no AIME 2025**.
- **Datasets**: Treinado com curadoria de dados institucionais e datasets globais como `nvidia/OpenScienceReasoning-2` e `nvidia/Nemotron-Post-Training-Dataset-v1`.

---

## 🚀 Principais Experiências

### 💬 Chat Rio (Advanced Branching)
Um playground de chat que vai além do básico, oferecendo ferramentas para desenvolvedores e pesquisadores:
- **Árvore de Mensagens**: Suporte total a *branching*. Edite qualquer mensagem passada para criar um novo ramo na conversa sem perder o histórico original.
- **Renderização Rica**: Suporte nativo a Markdown GFM, tabelas complexas e expressões matemáticas via **KaTeX**.
- **Controle de Fluxo**: Botão de interrupção (*Stop*) e regeneração de respostas com animação de "pensamento" integrada.
 
### 🧪 Catálogo Open Source
Acesse as fichas técnicas, benchmarks e links oficiais de cada modelo Open Source.

---

## 🛠️ Arquitetura Técnica

### Estrutura de Diretórios

```
.
├── App.tsx                    # Orquestrador de views e roteamento de estado
├── constants.ts               # Definição central do catálogo de modelos
├── components/
│   ├── detail/                # Views específicas para cada modelo Open
│   ├── ui/                    # Design System (Button, Badge, Card, etc.)
│   └── ...                    # Componentes modulares (Hero, Chat, etc.)
├── hooks/
│   ├── useRioChat.ts          # Lógica de chat baseada em árvore de mensagens
│   └── useScrollAnimation.ts  # Trigger de animações baseadas em scroll
├── utils/
│   ├── messageTree.ts         # Estrutura de dados para branching de conversa
│   └── chart.ts               # Helpers para gráficos de dispersão (Scatter Plots)
├── server/
│   └── proxy.mjs              # Proxy Express para injeção segura de API Keys
└── docs/                      # Technical briefs e documentação complementar
```

### Segurança e Performance
Para proteger as credenciais institucionais, o frontend nunca se comunica diretamente com a API externa. Um **Proxy Express** injeta as chaves de API necessárias e gerencia políticas de CORS, garantindo que o portal seja seguro e escalável.

---

## ⚙️ Configuração e Instalação

### Pré-requisitos
- **Node.js**: 18.x ou superior (Recomendado: 20 LTS)
- **npm**: 9.x ou superior

### Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:

| Variável | Descrição | Valor Padrão |
| :--- | :--- | :--- |
| `RIO_API_KEY` | Chave de acesso à API Rio (Necessária para o Chat) | — |
| `RIO_API_URL` | Endpoint da API de inferência | `https://rio-api-test.onrender.com/v1/...` |
| `RIO_PROXY_PORT` | Porta onde o servidor proxy será executado | `3001` |
| `RIO_ALLOWED_ORIGINS` | Lista de origens permitidas (CORS + validação de origem/referer) | `http://localhost:3000,...` |
| `RIO_RATE_LIMIT_WINDOW_MS` | Janela do rate limit em ms | `60000` |
| `RIO_RATE_LIMIT_MAX` | Máximo de requisições por janela e por cliente | `30` |
| `RIO_RATE_LIMIT_BLOCK_MS` | Tempo de bloqueio após exceder limite | `120000` |
| `RIO_UPSTREAM_TIMEOUT_MS` | Timeout de requisição para API upstream | `1200000` |
| `RIO_MAX_BODY_BYTES` | Tamanho máximo do JSON aceito no endpoint | `8388608` |
| `RIO_MAX_MESSAGES` | Máximo de mensagens por payload | `40` |
| `RIO_MAX_MESSAGE_CHARS` | Máximo de caracteres por mensagem/bloco textual | `20000` |
| `RIO_MAX_TOTAL_CHARS` | Máximo de caracteres totais por payload | `250000` |
| `RIO_MAX_BLOCKS_PER_MESSAGE` | Máximo de blocos multimodais por mensagem | `12` |
| `RIO_MAX_ATTACHMENT_CHARS` | Máximo de caracteres por anexo (`data:` / URL) | `5000000` |
| `RIO_ALLOWED_MODELS` | (Opcional) lista de modelos permitidos no backend | — |
| `VITE_RIO_CHAT_PROXY_URL` | URL do proxy (usado pelo Vite) | `http://localhost:3001/api/chat` |

Em produção, configure `RIO_ALLOWED_ORIGINS` com o(s) domínio(s) oficial(is) do portal e, se possível, defina `RIO_ALLOWED_MODELS` para reduzir risco de abuso/custo inesperado.

### Início Rápido
1. **Instalar dependências**:
   ```bash
   npm install
   ```
2. **Iniciar o Proxy** (em um terminal separado):
   ```bash
   npm run proxy
   ```
3. **Iniciar o Ambiente de Desenvolvimento**:
   ```bash
   npm run dev
   ```
4. **Build de Produção**:
   ```bash
   npm run build
   ```

---

## 📈 Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Lucide React (Ícones)
- **Estilização**: Tailwind CSS (UI Utility-first)
- **Processamento de Texto**: React Markdown, Remark GFM, KaTeX
- **Gráficos**: CSS customizado para scatter plots de performance/custo
- **Backend (Proxy)**: Express 5, Node.js Fetch API

---

## 📄 Licença e Contato

© 2025 **Prefeitura do Rio de Janeiro / IPLANRIO**.
Todos os direitos reservados sobre o conteúdo visual e experimental. Modelos open source seguem suas respectivas licenças (CC BY 4.0 onde indicado).

**Escritório de Dados – IPLANRIO**
Email: [dados@iplan.rio](mailto:dados@iplan.rio)
