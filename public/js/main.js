const currentUsers = document.getElementById("current-users");
const currentValue = document.getElementById("current-value");

const socket = io();

socket.on("currentUsers", ({ users }) => {
  this.outputUsers(users);
});

socket.on("currentValue", ({ value }) => {
  this.outputValue(value);
});

function outputUsers(users) {
  currentUsers.innerText = users;
}

function outputValue(value) {
  currentValue.innerText = value;
}
