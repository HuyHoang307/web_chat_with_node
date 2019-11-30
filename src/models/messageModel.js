import mongoose from "mongoose";

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
  senderId: String,
  receiverId: String,
  conversationType: String,
  messageType: String,
  sender: {
    id: String,
    username:String,
    avatar: String
  },
  reciever: {
    id: String,
    username:String,
    avatar: String
  },
  text: String,
  file:{data: Buffer, contentType: String, fileName: String},
  createAt: {type: Number, default: Date.now},
  updateAt: {type: Number, default: null},
  deleteAt: {type: Number, default: null}
});

MessageSchema.statics = {
  getMessages(senderId, receiverId, limit) {
    
    return this.find({
      $or: [
        {$and:[
          {"senderId": senderId},
          {"receiverId": receiverId}
        ]},
        {$and: [
          {"receiverId": senderId},
          {"senderId": receiverId}
        ]}
      ]
    }).sort({"createAt": 1}).limit(limit).exec();
  }
}

const MESSAGE_CONVERSATION_TYPE = {
  PERSONAL: "personal",
  GROUP: "group"
};

const MESSAGE_TYPE = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file"
}

module.exports = {
  model: mongoose.model("messages", MessageSchema),
  conversationTypes: MESSAGE_CONVERSATION_TYPE,
  messageTypes: MESSAGE_TYPE
};