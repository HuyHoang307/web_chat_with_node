import mongoose from "mongoose";

let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
  senderId: String,
  receiverId: String, 
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
  removeRequestContactNotification(senderId, receiverId, type) {
    return this.remove({
     $and:[
      {"senderId": senderId},
      {"receiverId": receiverId},
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
    return this.find({"receiverId": userId}).sort({"createAt": -1}).limit(limit).exec();
  },
/**
 * count alll notification unread
 * @param {String} userId 
 */
  countNotifUnread(userId) {
    return this.count({
      $and: [
        {"receiverId": userId},
        {"isRead":false}
      ]
    });
  }
}

const NOTIFICATION_TYPE = {
  ADD_CONTACT: "add_contact",
  APPROVE_CONTACT: "approve_contact"
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

    if(notificationType === NOTIFICATION_TYPE.APPROVE_CONTACT) {      
      if (isRead) {
        return  `<div data-uid="${userId}">
               <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
               <strong>${username}</strong> đã chấp nhận lời mời kết bạn của bạn!
               </div>`;
      }else{
        return  `<div  class="notif-readed-false"  data-uid="${userId}">
               <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
               <strong>${username}</strong> đã chấp nhận lời mời kết bạn của bạn!
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