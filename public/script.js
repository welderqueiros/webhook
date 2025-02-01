document.getElementById('sendButton').addEventListener('click', sendMessage);

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
        // Envia a mensagem para a função serverless
        const response = await fetch('/api/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const result = await response.json();

        if (response.ok) {
            messageArea.innerText = result.message;
            messageArea.classList.add("success");
        } else {
            messageArea.innerText = result.error;
            messageArea.classList.add("error");
        }
    } catch (error) {
        messageArea.innerText = "Erro ao enviar a mensagem: " + error.message;
        messageArea.classList.add("error");
    }
}