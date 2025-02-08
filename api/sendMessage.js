export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }
  
  const { message } = req.body;
  
  if (!message) {
    res.status(400).json({ message: 'Mensagem não fornecida' });
    return;
  }
  
  const webhookUrl = process.env.WEBHOOK_URL;
  
  if (!webhookUrl) {
    res.status(500).json({ message: 'Erro de configuração do servidor' });
    return;
  }
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: message })
    });
  
    console.log("Status do fetch:", response.status);
    const text = await response.text();
    console.log("Resposta completa do webhook:", text);
    
    // Se não houver corpo, tratamos como JSON vazio
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.log("Erro ao converter resposta para JSON:", e);
      }
    }
    
    // Se o status for 204 (no content) ou 200, consideramos sucesso.
    if (response.ok || response.status === 204) {
      res.status(200).json({ message: 'Mensagem enviada com sucesso!' });
    } else {
      res.status(response.status).json({ message: 'Erro ao enviar a mensagem para o webhook.', details: data });
    }
  } catch (error) {
    console.log("Erro no fetch:", error);
    res.status(500).json({ message: 'Erro ao enviar a mensagem: ' + error.message });
  }
}