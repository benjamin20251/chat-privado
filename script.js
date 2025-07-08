const allowedUsers = ['benjamín1', 'angie2', 'enzoo'];
let currentUser = '';

const loginBtn = document.getElementById('loginBtn');
const sendBtn = document.getElementById('sendBtn');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const chatDiv = document.getElementById('chat');
const messagesDiv = document.getElementById('messages');

loginBtn.addEventListener('click', login);
sendBtn.addEventListener('click', sendMessage);

function login() {
  const username = usernameInput.value.trim();
  if (!allowedUsers.includes(username)) {
    alert('Usuario no permitido');
    return;
  }
  currentUser = username;
  chatDiv.style.display = 'flex';
  loadMessages();

  // Escuchar mensajes nuevos en otras pestañas
  window.addEventListener('storage', (event) => {
    if (event.key === 'chat_messages') {
      loadMessages();
    }
  });
}

function loadMessages() {
  messagesDiv.innerHTML = '';

  const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');

  messages.forEach(({user, message}) => {
    addMessage(user, message, false);
  });

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage() {
  const msg = messageInput.value.trim();
  if (msg === '') return;

  const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
  messages.push({ user: currentUser, message: msg });
  localStorage.setItem('chat_messages', JSON.stringify(messages));

  addMessage(currentUser, msg, true);

  messageInput.value = '';
}

function addMessage(user, message, scroll = true) {
  const div = document.createElement('div');
  div.className = 'message ' + (user === currentUser ? 'own' : 'other');
  div.innerHTML = `<span>${user}:</span> ${message}`;
  messagesDiv.appendChild(div);
  if (scroll) messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
