

const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Login bem-sucedido
      console.log('Usuário logado:', userCredential.user);
      window.location.href = 'index.html'; // Redirecionar para a página inicial
    })
    .catch((error) => {
      // Tratamento de erros de login
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Erro no login:', errorCode, errorMessage);
      // Exiba uma mensagem de erro ao usuário, se necessário
    });
});

const userInfoDiv = document.getElementById('user-info');
const logoutButton = document.getElementById('logout-btn');

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // Usuário está logado
    userInfoDiv.innerHTML = `
      <p>Bem-vindo, ${user.email}!</p>
      <button id="logout-btn">Logout</button>
    `;
    logoutButton.addEventListener('click', () => {
      firebase.auth().signOut().then(() => {
        // Logout bem-sucedido
        window.location.href = 'login.html'; // Redirecionar para a tela de login
      }).catch((error) => {
        console.error('Erro no logout:', error);
      });
    });
  } else {
    // Usuário não está logado
    userInfoDiv.innerHTML = '';
    window.location.href = 'login.html'; // Redirecionar para a tela de login
  }
});
