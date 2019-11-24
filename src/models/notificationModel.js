import mongoose from "mongoose";

let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
  senderId: String,
  recieverId: String, 
  type: String,
  isRead: {type: Boolean, default: false},
  createAt: {type: Number, default: Date.now},
  updateAt: {type: Number, default: null},
  deleteAt: {type: Number, default: null}
});
NotificationSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  removeRequestContactNotification(senderId, recieverId, type) {
    return this.remove({
     $and:[
      {"senderId": senderId},
      {"recieverId": recieverId},
      {"type": type}
     ] 
    }).exec();
  },
/**
 * Get by user and limit
 * @param {String} userId 
 * @param {number} limit 
 */
  getByUserIdAndLimit(userId, limit) {
    return this.find({"recieverId": userId}).sort({"createAt": -1}).limit(limit).exec();
  },
/**
 * count alll notification unread
 * @param {String} userId 
 */
  countNotifUnread(userId) {
    return this.count({
      $and: [
        {"recieverId": userId},
        {"isRead":false}
      ]
    });
  }
}

const NOTIFICATION_TYPE = {
  ADD_CONTACT: "add_contact"
};

const NOTIFICATION_CONTENTS = {
  getContent: (notificationType, isRead, userId, username, userAvatar) => {
    if(notificationType === NOTIFICATION_TYPE.ADD_CONTACT) {      
      if (isRead) {
        return  `<div data-uid="${userId}">
               <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
               <strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn!
               </div>`;
      }else{
        return  `<div  class="notif-readed-false"  data-uid="${userId}">
               <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
               <strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn!
               </div>`;
              }
    }
    return "No matching with any notification type";
  }
}

module.exports = {
  model: mongoose.model("notification", NotificationSchema),
  types: NOTIFICATION_TYPE,
  content: NOTIFICATION_CONTENTS
}