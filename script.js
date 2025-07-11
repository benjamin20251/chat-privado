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

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const allowedUsers = {
  'benjamín1': '1234benja',
  'angie2': '123angie',
  'enzoo': 'enzo124'
};

let currentUser = "";

// LOGIN
function login() {
  const usernameInput = document.getElementById("username").value.trim().toLowerCase();
  const passwordInput = document.getElementById("password").value.trim();

  if (allowedUsers[usernameInput] && allowedUsers[usernameInput] === passwordInput) {
    currentUser = usernameInput;
    document.getElementById("login").style.display = "none";
    document.getElementById("chat").style.display = "block";
  } else {
    const error = document.getElementById("error");
    error.style.display = "block";
    setTimeout(() => error.style.display = "none", 3000);
  }
}

// ENVIAR MENSAJE DE TEXTO
function sendMessage() {
  const input = document.getElementById("message");
  const text = input.value.trim();
  if (text === "") return;

  const timestamp = new Date().toISOString();
  db.ref("chat").push({
    user: currentUser,
    message: text,
    time: timestamp,
    type: "text"
  });

  input.value = "";
}

// ENVIAR IMAGEN
function sendImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const timestamp = new Date().toISOString();
    db.ref("chat").push({
      user: currentUser,
      message: e.target.result,
      time: timestamp,
      type: "image"
    });
  };
  reader.readAsDataURL(file);
}

// AÑADIR MENSAJE AL CHAT
function addMessage(key, data) {
  const messagesDiv = document.getElementById("messages");
  const div = document.createElement("div");
  div.classList.add("message");

  const isMine = data.user === currentUser;
  const isAdmin = currentUser === "benjamín1";

  let content = `<span><b>${data.user}</b> <small>${formatTime(data.time)}</small>:</span> `;

  if (data.type === "image") {
    content += `<br><img src="${data.message}" style="max-width:100%; border-radius:10px;" />`;
  } else {
    content += `${data.message}`;
  }

  if (isMine || isAdmin) {
    content += ` <button onclick="deleteMessage('${key}')" style="margin-left:8px;">🗑️</button>`;
  }

  div.innerHTML = content;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// BORRAR UN MENSAJE
function deleteMessage(key) {
  db.ref("chat").child(key).remove();
}

// FORMATEAR HORA
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

// BORRAR TODOS LOS MENSAJES (SOLO ADMIN)
function deleteAllMessages() {
  if (currentUser === "benjamín1") {
    if (confirm("¿Seguro que deseas borrar todos los mensajes?")) {
      db.ref("chat").remove();
    }
  }
}

// ESCUCHAR NUEVOS MENSAJES
db.ref("chat").on("child_added", snapshot => {
  addMessage(snapshot.key, snapshot.val());
});

db.ref("chat").on("child_removed", snapshot => {
  document.querySelectorAll(".message").forEach(msg => {
    if (msg.innerHTML.includes(snapshot.key)) {
      msg.remove();
    }
  });
});
