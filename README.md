# Teste Técnico - VR Software

## Este projeto é um sistema Full-Stack simplificado para envio e acompanhamento de notificações.

# Frontend

Desenvolvido em Angular.

Possui uma interface onde é possível enviar mensagens para uma fila do RabbitMQ.

Após o envio, a fila é processada de forma assíncrona e o status da mensagem é atualizado e exibido em tempo real.

# Backend

Desenvolvido em NestJS.

Implementa toda a lógica de notificações, incluindo:

Configuração do RabbitMQ para envio e consumo de mensagens.

WebSocket para atualização de status em tempo real.

Módulo de Notificações, que gerencia o envio, processamento e rastreamento das mensagens.

Roda por padrão na porta 3001.
