// Configuração da Gringo Pizzaria — edite este arquivo antes de publicar.
window.GRINGO_CONFIG = {
  // Número de WhatsApp que recebe os pedidos (o mesmo número atendido pelo
  // robô da Anota AI). Formato internacional, só dígitos: 55 + DDD + número.
  // Ex.: "5511999999999"
  whatsapp: "",

  // Opcional: URL de um webhook (ex.: fluxo no n8n ou integração com a API
  // de parceiros da Anota AI) que recebe o pedido completo em JSON via POST.
  // Deixe vazio ("") para desativar.
  webhookPedidos: "",

  // Taxa de entrega em reais.
  taxaEntrega: 7,

  // Tempos médios do acompanhamento do pedido, em minutos a partir da
  // confirmação. Calibre com a média real da pizzaria:
  //  - preparando: quando o app passa a mostrar "Preparando no forno"
  //  - saiu:       quando passa a mostrar "Saiu para entrega"
  //  - entregue:   previsão de entrega exibida ("Chega em ~X min")
  etaMinutos: { preparando: 5, saiu: 25, entregue: 40 },
};
