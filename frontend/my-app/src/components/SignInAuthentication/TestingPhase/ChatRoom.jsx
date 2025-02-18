import React,{useRef,useEffect,useState} from 'react'
import io from "socket.io-client";



const ChatRoom = () => {
    const socket = useRef(null);

    const socketUrl =  "http://localhost:8000";

    const userId = localStorage.getItem("userId")

    const[message,setMessage] = useState({
      message: "",
      messageBy: "",
      messageTo:"",
      conversationId: "",
    })

    useEffect(()=>{
        socket.current = io(socketUrl);

        socket.current.emit("fetchUserInfo", (userId))

        socket.current.on("Connect", ()=>{
            console.log("Connected to the server");
        })
    })
  return (
    <div>chatRoom</div>
  )
}

export default ChatRoom