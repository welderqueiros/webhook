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
  
    // Para debugar:
    console.log("Status do fetch:", response.status);
    const responseText = await response.text();
    console.log("Resposta do webhook:", responseText);
    
    // Tente converter o body para JSON se houver conteúdo
    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      responseData = {};
    }
    
    if (response.ok) {
      res.status(200).json({ message: 'Mensagem enviada com sucesso!' });
    } else {
      res.status(response.status).json({ message: 'Erro ao enviar a mensagem para o webhook.' });
    }
  } catch (error) {
    console.log("Erro no fetch:", error);
    res.status(500).json({ message: 'Erro ao enviar a mensagem: ' + error.message });
  }
}