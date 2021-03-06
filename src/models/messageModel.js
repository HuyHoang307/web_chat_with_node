import mongoose from "mongoose";

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
  senderId: String,
  receiverId: String,
  conversationType: String,
  messageType: String,
  sender: {
    id: String,
    name:String,
    avatar: String
  },
  receiver: {
    id: String,
    name:String,
    avatar: String
  },
  text: String,
  file:{data: Buffer, contentType: String, fileName: String},
  createAt: {type: Number, default: Date.now},
  updateAt: {type: Number, default: null},
  deleteAt: {type: Number, default: null}
});

MessageSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  getMessagesInPersonal(senderId, receiverId, limit) {
    
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
    }).sort({"createAt": -1}).limit(limit).exec();
  },
   
  getMessagesInGroup(receiverId, limit) {
    return this.find({"receiverId": receiverId}).sort({"createAt": -1}).limit(limit).exec();
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