  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBs9XNudfx2YyL-Pb2x1Bm6jvFZ36m6ltc",
    authDomain: "login-clock.firebaseapp.com",
    projectId: "login-clock",
    storageBucket: "login-clock.appspot.com",
    messagingSenderId: "1043355631754",
    appId: "1:1043355631754:web:00be145f8d0ced6f4fed73"
  };

  firebase.initializeApp(firebaseConfig);


// Função para verificar se há um usuário logado
function checkUserLoggedIn() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // Usuário está logado
      console.log('Usuário está logado:', user.uid);
      // Faça aqui as ações necessárias quando um usuário estiver logado
      // Por exemplo, redirecionar para a página principal
    } else {
      // Usuário não está logado
      console.log('Usuário não está logado');
      // Faça aqui as ações necessárias quando um usuário não estiver logado
      // Por exemplo, redirecionar para a página de login
      window.location.href = 'login.html';
    }
  });
}

// Chamada da função para verificar se há um usuário logado
checkUserLoggedIn();
