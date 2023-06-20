const webhookURL = ''; // Substitua pelo URL do webhook do Discord

function startTimer(timerId, pauseName, duration) {
  const timerElement = document.getElementById(timerId);
  const startButton = document.querySelector(`button[data-timer-id="${timerId}"]`);

  if (timerElement) {
    if (timerElement.textContent === '') {
      startButton.textContent = 'Pausa em andamento...';
      timerElement.textContent = formatTime(duration);

      const intervalId = setInterval(() => {
        duration--;

        if (duration === 180) {
          sendMessageToWebhook(`A pausa ${pauseName} está chegando ao fim. Faltam 3 minutos.`);
          sendSMS(`A pausa ${pauseName} está chegando ao fim. Faltam 3 minutos.`, 'numero de destino');
        }

        if (duration <= 0) {
          clearInterval(intervalId);
          startButton.textContent = 'Iniciar';
          timerElement.textContent = '';
          return;
        }

        timerElement.textContent = formatTime(duration);
      }, 1000);
    }
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function sendMessageToWebhook(message) {
  fetch(webhookURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: message,
    }),
  });
}

function sendSMS(message, toPhoneNumber) {
  const twilioAccountSid = 'sid';
  const twilioAuthToken = 'tokensms';
  const twilioPhoneNumber = '+';

  const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
    },
    body: new URLSearchParams({
      From: twilioPhoneNumber,
      To: toPhoneNumber,
      Body: message,
    }),
  })
    .then(response => {
      if (response.ok) {
        console.log('SMS enviado com sucesso!');
      } else {
        console.error('Erro ao enviar SMS:', response.status);
      }
    })
    .catch(error => {
      console.error('Erro ao enviar SMS:', error);
    });
}

function updateClock() {
  const clockElement = document.getElementById('clock');
  const currentDate = new Date();
  const options = { timeZone: 'America/Sao_Paulo', hour12: false };
  const formattedTime = currentDate.toLocaleTimeString('pt-BR', options);
  clockElement.textContent = formattedTime;
}

setInterval(updateClock, 1000);
