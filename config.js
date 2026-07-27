// Configuração da Gringo Pizzaria — edite este arquivo antes de publicar.
window.GRINGO_CONFIG = {
  // Número de WhatsApp que recebe os pedidos (o mesmo número atendido pelo
  // robô da Anota AI). Formato internacional, só dígitos: 55 + DDD + número.
  // Ex.: "5511999999999"
  whatsapp: "",

  // Hub de pedidos (n8n): recebe o pedido completo em JSON via POST e
  // registra para acompanhamento. Deixe vazio ("") para desativar.
  webhookPedidos: "https://n8n.fluxo-royale.com.br/webhook/gringo/pedido",

  // Hub de pedidos (n8n): consulta de status real do pedido. Com esta URL
  // preenchida, o acompanhamento usa o status marcado pela pizzaria em vez
  // da estimativa por tempo. Deixe vazio ("") para voltar à estimativa.
  statusUrl: "https://n8n.fluxo-royale.com.br/webhook/gringo/status",

  // Taxa de entrega em reais.
  taxaEntrega: 7,

  // Tempos médios do acompanhamento do pedido, em minutos a partir da
  // confirmação. Calibre com a média real da pizzaria:
  //  - preparando: quando o app passa a mostrar "Preparando no forno"
  //  - saiu:       quando passa a mostrar "Saiu para entrega"
  //  - entregue:   previsão de entrega exibida ("Chega em ~X min")
  etaMinutos: { preparando: 5, saiu: 25, entregue: 40 },
};
