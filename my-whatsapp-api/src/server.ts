import app from "./app";
import { socketController } from "./sockets/socketHandler";
import http from "http";
import cors from "cors";
import socketIo from "socket.io"

const server = http.createServer(app)
const PORT = process.env.PORT || 8000

socketController(server)

app.get("/",(req,res)=>{
    res.send("Hello")
})

server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});


// app.listen(PORT, ()=>{
//     console.log(`Server is running on  PORT ${PORT}`);
// });
