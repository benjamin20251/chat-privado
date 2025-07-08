// Usuarios permitidos
const allowedUsers = ['benjamín1', 'enzoo', 'angie2'];

// Configuración Firebase con tus datos
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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const loginArea = document.getElementById('loginArea');
const chatArea = document.getElementById('chatArea');
const usernameInput = document.getElementById('username');
const loginBtn = document.getElementById('loginBtn');
const errorP = document.getElementById('error');

const messagesDiv = document.getElementById('messages');
const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('message');
const logoutBtn = document.getElementById('logoutBtn');

let currentUser = null;

loginBtn.addEventListener('click', () => {
  const user = usernameInput.value.trim().toLowerCase();
  if (allowedUsers.includes(user)) {
    currentUser = user;
    loginArea.style.display = 'none';
    chatArea.style.display = 'flex';
    errorP.style.display = 'none';
    listenMessages();
  } else {
    errorP.style.display = 'block';
  }
});

sendBtn.addEventListener('click', () => {
  if (!currentUser) return alert('Debes iniciar sesión primero.');
  const text = messageInput.value.trim();
  if (!text) return;
  db.ref('chat').push({ user: currentUser, text, timestamp: Date.now() });
  messageInput.value = '';
});

logoutBtn.addEventListener('click', () => {
  currentUser = null;
  chatArea.style.display = 'none';
  loginArea.style.display = 'block';
  messagesDiv.innerHTML = '';
  usernameInput.value = '';
});

function listenMessages() {
  db.ref('chat').off(); // Quitar listeners antiguos si hubiera
  db.ref('chat').on('child_added', snapshot => {
    const msg = snapshot.val();
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<span>${msg.user}:</span> ${msg.text}`;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}
