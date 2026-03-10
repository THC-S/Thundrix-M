const socket = io()

const username = localStorage.getItem("user")

socket.emit("login",username)

socket.on("online",(list)=>{

document.getElementById("online").innerText =
"Online: "+list.join(", ")

})

socket.on("message",(data)=>{

const div = document.createElement("div")

div.innerText =
data.user + ": " + data.text

document.getElementById("messages")
.appendChild(div)

})

function send(){

const input =
document.getElementById("msg")

socket.emit("message",{

user:username,
text:input.value

})

input.value=""

}