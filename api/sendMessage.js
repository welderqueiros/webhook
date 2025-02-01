// Se estiver usando Node 18+, o fetch já é nativo. Se não, mantenha o node-fetch.
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Aceita apenas método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Por favor, forneça uma mensagem.' });
  }

  try {
    // Variável de ambiente com a URL do seu webhook
    const webhookUrl = process.env.WEBHOOK_URL;
    if (!webhookUrl) {
      return res.status(500).json({ error: 'Webhook URL não configurada.' });
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
