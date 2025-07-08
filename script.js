// Aquí pega tu configuración de Firebase (cambia estos valores por los tuyos)
const firebaseConfig = {
  apiKey: "AIzaSyCJP24FBp7XrrXtrYnryM9cGqOdJiTEXFM",
  authDomain: "chat-privado-59115.firebaseapp.com",
  databaseURL: "https://chat-privado-59115-default-rtdb.firebaseio.com",
  projectId: "chat-privado-59115",
  storageBucket: "chat-privado-59115.firebasestorage.app",
  messagingSenderId: "1092522382941",
  appId: "1:1092522382941:web:95ec64a47008e6a62ddfb4",
  measurementId: "G-53652YBZTL"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const messagesDiv = document.getElementById('messages');
const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('message');
const usernameInput = document.getElementById('username');

sendBtn.addEventListener('click', () => {
  const user = usernameInput.value.trim();
  const text = messageInput.value.trim();
  if (!user || !text) {
    alert('Por favor ingresa usuario y mensaje.');
    return;
  }

  // Guardar mensaje en Firebase Realtime Database
  db.ref('chat').push({ user, text, timestamp: Date.now() });
  messageInput.value = '';
});

db.ref('chat').on('child_added', snapshot => {
  const msg = snapshot.val();
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<span>${msg.user}:</span> ${msg.text}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
