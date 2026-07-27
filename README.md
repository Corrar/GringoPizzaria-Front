# Gringo Pizzaria — PWA de pedidos

PWA (Progressive Web App) com o cardápio da Gringo Pizzaria, feito para **substituir a
página de cliente fornecida pela Anota AI**, mantendo toda a operação (atendimento,
painel, cozinha e impressão) dentro da Anota AI.

O app **não processa pagamentos**. O cliente apenas informa como pretende pagar
(Pix, cartão ou dinheiro) e o acerto acontece na entrega/retirada, como já é feito hoje.

## Como funciona com a Anota AI

1. O cliente acessa o PWA (ou instala na tela inicial), monta o pedido e confirma.
2. O app abre o WhatsApp do cliente com o pedido completo já formatado (itens,
   observações, endereço, forma de pagamento e total), endereçado ao número da
   pizzaria — o mesmo número atendido pelo robô da Anota AI.
3. O pedido chega no atendimento da Anota AI como uma mensagem estruturada; a equipe
   confirma no painel e o fluxo segue normal: cozinha, impressão, entrega.

Ou seja: só a "vitrine" muda. Nada na operação da Anota AI precisa ser alterado.

Opcionalmente, o pedido também pode ser enviado em JSON para um webhook
(`webhookPedidos` no `config.js`) — útil para integrar com um fluxo n8n ou com a API
de parceiros da Anota AI no futuro, sem mexer no app.

## Configuração (obrigatória antes de publicar)

Edite `config.js`:

```js
window.GRINGO_CONFIG = {
  whatsapp: "5511999999999", // 55 + DDD + número do WhatsApp da pizzaria (robô Anota AI)
  webhookPedidos: "",        // opcional: URL que recebe o pedido em JSON (POST)
  taxaEntrega: 7,            // taxa de entrega em R$
};
```

## Publicação

É um site 100% estático (sem build e sem backend). Basta servir a pasta em qualquer
hospedagem com HTTPS — HTTPS é obrigatório para o PWA instalar e o service worker
funcionar:

- **GitHub Pages**: Settings → Pages → Deploy from branch.
- **Vercel / Netlify / Cloudflare Pages**: aponte para o repositório, sem comando de build.

Para testar localmente:

```bash
npx serve .
# ou
python3 -m http.server 8000
```

A cada alteração publicada, aumente `CACHE_VERSION` no `sw.js` para que os clientes
recebam a versão nova.

## Estrutura

| Caminho | Conteúdo |
|---|---|
| `index.html` | App completo (template + lógica do cardápio, carrinho, checkout e acompanhamento) |
| `config.js` | Configuração da loja (WhatsApp, webhook, taxa de entrega) |
| `manifest.webmanifest` | Manifest do PWA (nome, ícones, cores) |
| `sw.js` | Service worker (funcionamento offline e cache) |
| `assets/` | Fotos das pizzas, logo e vídeo de abertura |
| `fonts/` | Fontes Bebas Neue e Sora (locais, sem CDN) |
| `vendor/` | React 18.3.1 e runtime da interface (locais, sem CDN) |
| `icons/` | Ícones do PWA (inclusive maskable) |

## Editando o cardápio

Sabores, preços, bordas e tamanhos ficam no início do script da aplicação dentro de
`index.html` (constantes `SABORES`, `LINHAS`, `TAMANHOS`, `RECHEIOS`, `PREMIOS` e
`CARDAPIOS`). Cada sabor tem preços por linha (`sem`/`com`/`premium`) e tamanho
(`g`/`p`). As fotos referenciadas em `img`/`premImg` ficam em `assets/`.

## Limitações conhecidas

- O acompanhamento de pedido ("recebido → preparando → saiu → entregue") é uma
  estimativa local por tempo, não o status real da Anota AI. Para status real seria
  necessário integrar com a API da Anota AI via `webhookPedidos` + um backend.
- O envio por WhatsApp depende de o cliente concluir o envio da mensagem aberta.
