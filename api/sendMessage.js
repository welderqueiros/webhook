const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { message } = req.body;

    console.log('Mensagem recebida:', message); // Log da mensagem recebida

    if (!message) {
        return res.status(400).json({ error: 'Por favor, forneça uma mensagem.' });
    }

    try {
        // URL do webhook (armazenada como variável de ambiente na Vercel)
        const webhookUrl = process.env.WEBHOOK_URL;

        console.log('Enviando mensagem para o webhook:', webhookUrl); // Log da URL do webhook

        // Envia a mensagem para o webhook
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: message })
        });

        console.log('Resposta do webhook:', response.status, response.statusText); // Log da resposta do webhook

        if (response.ok) {
            res.json({ success: true, message: 'Mensagem enviada com sucesso!' });
        } else {
            res.status(500).json({ error: 'Erro ao enviar a mensagem para o webhook.' });
        }
    } catch (error) {
        console.error('Erro ao enviar a mensagem:', error); // Log de erro
        res.status(500).json({ error: 'Erro ao enviar a mensagem: ' + error.message });
    }
};