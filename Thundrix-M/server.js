const express = require("express")
const http = require("http")
const {Server} = require("socket.io")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.json())
app.use(express.static("public"))

mongoose.connect("mongodb://127.0.0.1/thundrix")

const User = mongoose.model("User",{
username:String,
password:String
})

app.post("/register",async(req,res)=>{

const hash = await bcrypt.hash(req.body.password,10)

await User.create({
username:req.body.username,
password:hash
})

res.send({status:"ok"})

})

app.post("/login",async(req,res)=>{

const user = await User.findOne({
username:req.body.username
})

if(!user){
res.send({status:"error"})
return
}

const ok = await bcrypt.compare(
req.body.password,
user.password
)

if(ok){
res.send({status:"ok"})
}else{
res.send({status:"error"})
}

})

let users={}

io.on("connection",(socket)=>{

socket.on("login",(username)=>{

users[socket.id]=username

io.emit("online",
Object.values(users)
)

})

socket.on("message",(data)=>{

io.emit("message",data)

})

socket.on("disconnect",()=>{

delete users[socket.id]

io.emit("online",
Object.values(users)
)

})

})

server.listen(3000,()=>{
console.log("Thundrix-M avviato")
})