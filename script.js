// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCJP24FBp7XrrXtrYnryM9cGqOdJiTEXFM",
  authDomain: "chat-privado-59115.firebaseapp.com",
  databaseURL: "https://chat-privado-59115-default-rtdb.firebaseio.com",
  projectId: "chat-privado-59115",
  storageBucket: "chat-privado-59115.appspot.com",
  messagingSenderId: "1092522382941",
  appId: "1:1092522382941:web:95ec64a47008e6a62ddfb4",
  measurementId: "G-53652YBZTL"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const users = {
  benja: '1234benja',
  angie: '123angie',
  enzo: 'enzo124'
};

let currentUser = '';

function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const error = document.getElementById('error');

  if (users[username] && users[username] === password) {
    currentUser = username;
    document.getElementById('login').style.display = 'none';
    document.getElementById('chat').style.display = 'flex';
    document.getElementById('userDisplay').textContent = `Usuario: ${username}`;
    listenMessages();
  } else {
    error.style.display = 'block';
    setTimeout(() => error.style.display = 'none', 3000);
  }
}

function sendMessage() {
  const msg = document.getElementById('message').value.trim();
  if (!msg) return;

  const newMsgRef = db.ref('messages').push();
  newMsgRef.set({
    user: currentUser,
    text: msg,
    timestamp: Date.now()
  });

  document.getElementById('message').value = '';
}

function sendImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const newMsgRef = db.ref('messages').push();
    newMsgRef.set({
      user: currentUser,
      image: reader.result,
      timestamp: Date.now()
    });
  };
  reader.readAsDataURL(file);
}

function listenMessages() {
  const messagesDiv = document.getElementById('messages');
  db.ref('messages').on('value', snapshot => {
    messagesDiv.innerHTML = '';
    snapshot.forEach(child => {
      const msg = child.val();
      const div = document.createElement('div');
      div.className = 'message';
      let content = `<span>${msg.user} (${new Date(msg.timestamp).toLocaleTimeString()}):</span>`;
      if (msg.text) content += msg.text;
      if (msg.image) content += `<br><img class="chat-img" src="${msg.image}" />`;

      // Mostrar botón borrar si es el autor o es benja
      if (msg.user === currentUser || currentUser === 'benja') {
        content += ` <button class="deleteBtn" onclick="deleteMessage('${child.key}')">🗑️</button>`;
      }

      div.innerHTML = content;
      messagesDiv.appendChild(div);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}

function deleteMessage(key) {
  db.ref('messages/' + key).remove();
}

function deleteAllMessages() {
  if (currentUser === 'benja') {
    db.ref('messages').remove();
  }
}
