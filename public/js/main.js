const currentUsers = document.getElementById("current-users");

const socket = io();

socket.on("currentUsers", ({ users }) => {
  console.log(users);
  outputUsers(users);
});

function outputUsers(users) {
  currentUsers.innerText = users - 1;
}
