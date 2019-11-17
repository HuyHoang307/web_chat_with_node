import mongoose from "mongoose";

let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
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
  type: String,
  content: String,
  isRead: {type: String, default: false},
  createAt: {type: Number, default: Date.now},
  updateAt: {type: Number, default: null},
  deleteAt: {type: Number, default: null}
});

module.exports = mongoose.model("notification", NotificationSchema);