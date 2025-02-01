// api/sendMessage.js
module.exports = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Por favor, forneça uma mensagem.' });
    }

    try {
        // URL do webhook (armazenada como variável de ambiente na Vercel)
        const webhookUrl = process.env.WEBHOOK_URL;

        // Envia a mensagem para o webhook
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: message })
        });

        if (response.ok) {
            res.json({ success: true, message: 'Mensagem enviada com sucesso!' });
        } else {
            res.status(500).json({ error: 'Erro ao enviar a mensagem para o webhook.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao enviar a mensagem: ' + error.message });
    }
};