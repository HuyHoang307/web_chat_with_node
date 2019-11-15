import express from "express";
let app = express();

let hostname = "localhost";
let port = 3000;

app.get("/helloworld", (req,res)=>{
  res.send("<h1>Hello world!</h1>");
});

app.listen(port, hostname, ()=>{
  console.log(`Hello Hoang, I'm running at ${hostname}:${port}`);
});
