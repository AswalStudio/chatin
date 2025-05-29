let socket;

const loginDiv = document.getElementById("login");
const chatDiv = document.getElementById("chat");
const usernameInput = document.getElementById("username");
const roomInput = document.getElementById("room");
const passwordInput = document.getElementById("password");
const joinBtn = document.getElementById("joinBtn");
const loginError = document.getElementById("loginError");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");

joinBtn.onclick = () => {
  const username = usernameInput.value.trim();
  const room = roomInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !room || !password) {
    loginError.textContent = "All fields are required";
    return;
  }

  socket = io({
    auth: { username, room, password }
  });

  socket.on("connect_error", (err) => {
    loginError.textContent = err.message;
  });

  socket.on("connect", () => {
    loginDiv.style.display = "none";
    chatDiv.style.display = "block";
    loginError.textContent = "";
  });

  socket.on("message", (msg) => {
    const div = document.createElement("div");
    div.textContent = msg;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
};

messageInput.onkeydown = (e) => {
  if (e.key === "Enter" && messageInput.value.trim()) {
    socket.emit("message", messageInput.value);
    messageInput.value = "";
  }
};
