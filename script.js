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

const allowedUsers = {
  'benja': '1234benja',
  'enzo': 'enzo124',
  'angie': '123angie'
};

let currentUser = "";

function login() {
  const username = document.getElementById("username").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  if (allowedUsers[username] && allowedUsers[username] === password) {
    currentUser = username;
    document.getElementById("loginArea").style.display = "none";
    document.getElementById("chatArea").style.display = "flex";
    document.getElementById("welcome").textContent = `Bienvenido, ${currentUser}`;
    if (currentUser === "benja") {
      document.getElementById("deleteAllBtn").style.display = "inline-block";
    }
    updateOnlineStatus(true);
  } else {
    const error = document.getElementById("error");
    error.textContent = "Usuario o contraseña incorrectos.";
    setTimeout(() => { error.textContent = ""; }, 3000);
  }
}

function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (text === "") return;

  const timestamp = new Date().toISOString();
  db.ref("chat").push({
    user: currentUser,
    message: text,
    time: timestamp
  });

  input.value = "";
}

function addMessage(key, data) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message");
  msgDiv.classList.add(data.user === currentUser ? "mine" : "other");
  msgDiv.dataset.key = key;

  let content = `<strong>${data.user}:</strong> `;
  if (data.imageUrl) {
    content += `<br><img src="${data.imageUrl}" style="max-width: 200px; border-radius: 8px;">`;
  } else {
    content += data.message;
  }

  content += `<div class="time">${new Date(data.time).toLocaleString()}</div>`;
  msgDiv.innerHTML = content;

  if (data.user === currentUser || currentUser === "benja") {
    const btn = document.createElement("button");
    btn.textContent = "🗑";
    btn.classList.add("deleteBtn");
    btn.onclick = () => {
      if (confirm("¿Eliminar este mensaje?")) {
        db.ref("chat/" + key).remove();
      }
    };
    msgDiv.appendChild(btn);
  }

  document.getElementById("messages").appendChild(msgDiv);
  document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
}

function deleteAllMessages() {
  if (confirm("¿Seguro que quieres borrar todos los mensajes?")) {
    db.ref("chat").remove();
  }
}

function uploadImage() {
  const fileInput = document.getElementById("imageInput");
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const imageUrl = reader.result;
    const timestamp = new Date().toISOString();
    db.ref("chat").push({
      user: currentUser,
      imageUrl,
      time: timestamp
    });
  };
  reader.readAsDataURL(file);
}

db.ref("chat").on("child_added", snapshot => {
  addMessage(snapshot.key, snapshot.val());
});
db.ref("chat").on("child_removed", snapshot => {
  const el = document.querySelector(`.message[data-key="${snapshot.key}"]`);
  if (el) el.remove();
});

const connectedRef = db.ref(".info/connected");
const usersRef = db.ref("online");

function updateOnlineStatus(connected) {
  if (connected) {
    const userRef = usersRef.child(currentUser);
    userRef.set(true);
    userRef.onDisconnect().remove();
  }

  usersRef.on("value", snapshot => {
    const users = snapshot.val() || {};
    const names = Object.keys(users).join(", ");
    document.getElementById("onlineUsers").textContent = `Conectados: ${names}`;
  });
}

connectedRef.on("value", snap => {
  if (snap.val() === true && currentUser) {
    updateOnlineStatus(true);
  }
});
