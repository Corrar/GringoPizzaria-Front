# Gringo Pizzaria — PWA de pedidos (contexto do projeto)

> Memória do projeto para sessões futuras do Claude Code. Última atualização: julho/2026,
> após o merge do PR #1. Leia este arquivo antes de mexer em qualquer coisa.

## O que é este projeto

PWA estático (sem build, sem backend próprio) que **substitui o cardápio digital que a
Anota AI fornece** ao cliente final da Gringo Pizzaria, mantendo toda a operação
(robô de WhatsApp, painel, cozinha, impressão) dentro da Anota AI.
**O app não processa pagamentos** — a forma de pagamento é só informada e acertada na
entrega/retirada. Decisão do dono do projeto: **não usar a API da Anota AI** — a ponte
de status é manual, via Painel de Pedidos (abaixo).

## Arquitetura

```
Cliente (PWA) ──WhatsApp (wa.me)──▶ robô Anota AI ──▶ atendente lança no painel ──▶ cozinha
      │                                                        │
      ├──POST pedido JSON──▶ Hub n8n (data table gringo_pedidos)
      └──GET status (poll 15s)◀── equipe toca botões no Painel de Pedidos
```

- Pedido confirmado → app abre WhatsApp com texto formatado ("*NOVO PEDIDO — Gringo
  Pizzaria*") **e** registra o pedido no hub n8n em paralelo.
- Pedidos registrados no hub (`pedido.remoto = true`) mostram o **status real** marcado
  pela equipe no Painel; os demais usam **estimativa por tempo** (`etaMinutos`).
- "Entregue" também pode ser confirmado pelo cliente no app.

## URLs e credenciais importantes

| O quê | Valor |
|---|---|
| Workflow do hub (n8n "Agente - VPS", projeto pessoal Brunnao Corral) | `https://n8n.fluxo-royale.com.br/workflow/WvNMPLVlNU1m43ds` |
| Painel de Pedidos (equipe) | `https://n8n.fluxo-royale.com.br/webhook/gringo/painel` |
| Criar pedido (PWA usa) | `POST https://n8n.fluxo-royale.com.br/webhook/gringo/pedido` |
| Consultar status (PWA usa) | `GET https://n8n.fluxo-royale.com.br/webhook/gringo/status?id=<id>` |
| Atualizar status (Painel usa) | `POST https://n8n.fluxo-royale.com.br/webhook/gringo/atualizar` (body: `{id, status, segredo}`) |
| Segredo dos endpoints protegidos | `gringo-status-x7k9m3p2` — nos nós "Autorizado?" e "Painel Autorizado?" do workflow; **deve ser trocado antes do go-live** |
| Data table no n8n | `gringo_pedidos` (id `VSTeWG0ZjHKI4SiB`) — colunas: pedidoId, status, cliente, telefone, total, resumo, payload |
| WhatsApp da pizzaria (config.js) | `5518991666717` |
| Statuses válidos | `recebido`, `preparando`, `saiu`, `entregue`, `cancelado` (o app ignora `cancelado` na timeline) |

## Estrutura do código

- `index.html` — app inteiro: template `<x-dc>` + lógica (classe `Component extends DCLogic`)
  executada pelo `vendor/dc-runtime.js` com React UMD local. **Não há build**; edite direto.
  Constantes do cardápio no topo do script: `SABORES`, `LINHAS`, `TAMANHOS`, `RECHEIOS`,
  `PREMIOS`, `CARDAPIOS`. Métodos-chave: `confirmarPedido`, `_enviarPedido` (WhatsApp+hub),
  `_sincronizarStatus` (poll 15s), `_mensagemPedido` (texto do WhatsApp).
- `config.js` — única configuração: whatsapp, webhookPedidos, statusUrl, taxaEntrega,
  etaMinutos. Lido em runtime (`window.GRINGO_CONFIG`).
- `sw.js` — service worker. **Sempre subir `CACHE_VERSION` a cada deploy.**
- `manifest.webmanifest` + `icons/` — PWA instalável (ícones gerados do logo 200px).
- `assets/`, `fonts/`, `vendor/` — tudo local, zero CDN (funciona offline).
- `INTEGRACAO-ANOTA-AI.md` — guia técnico completo. `docs/*.pdf` — guias em PDF
  (regeneráveis; scripts de origem ficavam no scratchpad da sessão original).
- O app veio de um bundle HTML fornecido pelo usuário (design pronto); a lógica de
  pedidos/hub foi adicionada por cima. Alterações visuais: preservar o design.

## Estado atual (pós PR #1)

Feito: app completo e testado (Playwright), hub n8n publicado e testado, Painel da
equipe no ar, WhatsApp configurado, PR #1 mesclado na `main`.

Pendências (operacionais, fora do código):
1. Ativar GitHub Pages (Settings → Pages → main/root) ou Vercel → gera o link do app.
2. Definir `main` como branch padrão do repositório.
3. No painel da Anota AI: trocar o link do cardápio na mensagem do robô pelo link do
   app + regra de transferência para humano quando chegar "NOVO PEDIDO".
4. Trocar o segredo do painel no n8n e treinar a equipe (lançou no Anota AI → "Aprovar").
5. Atualizar Instagram/Google/QR codes; teste de ponta a ponta (checklist no PDF).

Evolução futura já desenhada (se o dono mudar de ideia sobre API): pedir token da API
de parceiros ao suporte Anota AI (chat no painel, 10h–24h, sem telefone) e acrescentar
ao hub um fluxo que chama `atualizar` sozinho — PWA e Painel não mudam.

## Como testar localmente

```bash
python3 -m http.server 8811   # na raiz do repo
# Playwright: chromium em /opt/pw-browsers; interceptar **/wa.me/** nos testes.
# Hub simulado: ver contrato dos endpoints acima (mock simples em Node resolve).
```

Decisões do usuário a respeitar: não alterar o Painel de Pedidos sem pedido explícito;
não adicionar processamento de pagamentos; manter WhatsApp como canal principal.
