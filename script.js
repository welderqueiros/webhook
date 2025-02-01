async function sendMessage() {
    const message = document.getElementById('message').value;
    const messageArea = document.getElementById('messageArea');

    // Limpa a área de mensagens
    messageArea.innerText = "";
    messageArea.className = "message";

    if (!message) {
        messageArea.innerText = "Por favor, escreva uma mensagem.";
        messageArea.classList.add("error");
        return;
    }

    try {
        // Usa a variável de ambiente da Vercel para a URL do webhook
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
            messageArea.innerText = "Mensagem enviada com sucesso!";
            messageArea.classList.add("success");
        } else {
            messageArea.innerText = "Erro ao enviar a mensagem para o webhook.";
            messageArea.classList.add("error");
        }
    } catch (error) {
        messageArea.innerText = "Erro ao enviar a mensagem: " + error.message;
        messageArea.classList.add("error");
    }
}