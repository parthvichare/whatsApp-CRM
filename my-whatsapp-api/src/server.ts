import app from "./app";

const PORT = process.env.PORT || 8000

app.get("/",(req,res)=>{
    res.send("Hello")
})

app.listen(PORT, ()=>{
    console.log(`Server is running on  PORT ${PORT}`);
})