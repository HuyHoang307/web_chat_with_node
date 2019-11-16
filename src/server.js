import express from "express";
import ConnectDB from "./config/connectDB";
import ContactModel from "./models/contact.model"

let app = express();
//connect to mongo
ConnectDB();

app.get("/test-database", async (req, res) => {
  try {
    let item = {
      userId: "123415531",
      contactId: "123452415514546",
    };
    console.log(ContactModel.createNew(item));
    let contact = await ContactModel.createNew(item);
    res.send(contact);
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.APP_PORT, process.env.APP_HOST, ()=>{
  console.log(`Hello Hoang, I'm running at ${process.env.APP_HOST}:${process.env.APP_PORT}`);
});
