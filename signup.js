const signupForm = document.getElementById('signup-form');
const firstnameInput = document.getElementById('firstname-input');
const lastnameInput = document.getElementById('lastname-input');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const confirmPasswordInput = document.getElementById('confirm-password-input');

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const firstname = firstnameInput.value;
  const lastname = lastnameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (password !== confirmPassword) {
    console.error('As senhas não coincidem.');
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Cadastro bem-sucedido
      const user = userCredential.user;
      console.log('Usuário cadastrado:', user);
      // Faça ações adicionais, como redirecionar para outra página
    })
    .catch((error) => {
      // Tratamento de erros de cadastro
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Erro no cadastro:', errorCode, errorMessage);
      // Exiba uma mensagem de erro ao usuário, se necessário
    });
});
